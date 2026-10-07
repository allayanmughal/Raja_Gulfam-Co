import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { db } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rgc_super_secret_jwt_key_2026_production_secure';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://raja-gulfam-8vsl32hll-allayanmughals-projects.vercel.app',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');
    const isAllowed = allowedOrigins.some((item) => item.trim().replace(/\/$/, '') === normalizedOrigin)
      || normalizedOrigin.endsWith('.vercel.app');

    // Previously this always returned `true`, which left CORS fully open.
    if (isAllowed) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// The single super-admin account. Only this identity may manage admin users.
const SUPER_ADMIN_EMAIL = String(process.env.SUPER_ADMIN_EMAIL || 'admin@rajagulfam.com')
  .trim()
  .toLowerCase();

function isSuperAdmin(admin) {
  return Boolean(admin?.username) && String(admin.username).trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}

// Authentication Middleware
function requireAuth(req, res, next) {
  const token = req.cookies?.admin_session;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Authentication session required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

// Guards every admin-user management route. Runs after requireAuth.
function requireSuperAdmin(req, res, next) {
  if (!isSuperAdmin(req.admin)) {
    return res.status(403).json({ error: 'Only the super admin can manage admin users.' });
  }
  next();
}

// --- AUTHENTICATION ROUTES ---

// Minimal in-memory brute-force guard. Keyed by IP + username so one bad
// actor cannot lock out an entire office, and it resets on a fixed window.
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;
const loginAttempts = new Map();

function loginKey(req, username) {
  return `${req.ip || 'unknown'}:${String(username || '').toLowerCase()}`;
}

function isLoginBlocked(key) {
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (Date.now() - entry.firstAttempt > LOGIN_WINDOW_MS) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailedLogin(key) {
  const entry = loginAttempts.get(key);
  if (!entry || Date.now() - entry.firstAttempt > LOGIN_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: Date.now() });
    return;
  }
  entry.count += 1;
  loginAttempts.set(key, entry);
}

function clearLoginAttempts(key) {
  loginAttempts.delete(key);
}

/** Shared password policy for create/reset/change. */
function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number.';
  }
  return null;
}

function validateUsername(username) {
  if (typeof username !== 'string' || !username.trim()) {
    return 'Username is required.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username.trim())) {
    return 'Username must be a valid email address.';
  }
  return null;
}

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  const key = loginKey(req, username);
  if (isLoginBlocked(key)) {
    return res.status(429).json({
      error: 'Too many failed login attempts. Please try again in 15 minutes.'
    });
  }

  const admin = await db.getAdminByUsername(String(username).trim());
  if (!admin || !admin.passwordHash) {
    // Burn comparable time so a missing account is not distinguishable by latency.
    bcrypt.compareSync(String(password), '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin');
    recordFailedLogin(key);
    return res.status(401).json({ error: 'Invalid email/username or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isPasswordValid) {
    recordFailedLogin(key);
    return res.status(401).json({ error: 'Invalid email/username or password.' });
  }

  if (admin.isActive === false) {
    recordFailedLogin(key);
    return res.status(403).json({ error: 'This account has been deactivated. Contact the owner.' });
  }

  clearLoginAttempts(key);
  await db.touchAdminLogin(admin.id);

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role || 'admin', isSuper: isSuperAdmin(admin) },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    admin: {
      id: admin.id,
      username: admin.username,
      role: admin.role || 'admin',
      isSuper: isSuperAdmin(admin),
      lastLoginAt: admin.lastLoginAt || null
    }
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (_req, res) => {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.clearCookie('admin_session', {
    path: '/',
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const token = req.cookies?.admin_session;
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      authenticated: true,
      admin: { ...decoded, isSuper: isSuperAdmin(decoded) }
    });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// --- PUBLIC FRONTEND API ---

// GET /api/events
app.get('/api/events', async (_req, res) => {
  try {
    const events = await db.getPublishedEvents();
    return res.json({ success: true, events });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch published events.' });
  }
});

// --- PROTECTED ADMIN APIS ---

// GET /api/admin/events
app.get('/api/admin/events', requireAuth, async (_req, res) => {
  try {
    const events = await db.getAllEvents();
    return res.json({ success: true, events });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin events.' });
  }
});

// POST /api/admin/events
app.post('/api/admin/events', requireAuth, async (req, res) => {
  try {
    const { title, priorityDetail, description, images, date, template, published } = req.body;
    if (!title || !priorityDetail || !description) {
      return res.status(400).json({ error: 'Title, High-Priority Detail, and Description are required.' });
    }

    const newEvent = await db.createEvent({
      title,
      priorityDetail,
      description,
      images,
      date,
      template,
      published
    });

    return res.status(201).json({ success: true, event: newEvent });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create event.' });
  }
});

// PUT /api/admin/events/:id
app.put('/api/admin/events/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ success: true, event: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update event.' });
  }
});

// DELETE /api/admin/events/:id
app.delete('/api/admin/events/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// --- ADMIN USER MANAGEMENT (PROTECTED) ---

// GET /api/admin/admins
app.get('/api/admin/admins', requireAuth, requireSuperAdmin, async (_req, res) => {
  try {
    const admins = await db.listAdmins();
    return res.json({ success: true, admins });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin users.' });
  }
});

// POST /api/admin/admins
app.post('/api/admin/admins', requireAuth, requireSuperAdmin, async (req, res) => {
  const { username, password, role } = req.body || {};

  const usernameError = validateUsername(username);
  if (usernameError) return res.status(400).json({ error: usernameError });

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });

  try {
    const created = await db.createAdmin({
      username: String(username).trim(),
      password,
      role: role === 'viewer' ? 'viewer' : 'admin'
    });
    return res.status(201).json({ success: true, admin: created });
  } catch (err) {
    if (err.code === 'DUPLICATE_USERNAME') {
      return res.status(409).json({ error: 'An admin with that email already exists.' });
    }
    return res.status(500).json({ error: 'Failed to create admin user.' });
  }
});

// PUT /api/admin/admins/:id
app.put('/api/admin/admins/:id', requireAuth, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, role, isActive } = req.body || {};

  const patch = {};
  if (username !== undefined) {
    const usernameError = validateUsername(username);
    if (usernameError) return res.status(400).json({ error: usernameError });
    patch.username = String(username).trim();
  }
  if (password !== undefined && password !== '') {
    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });
    patch.password = password;
  }
  if (role !== undefined) patch.role = role === 'viewer' ? 'viewer' : 'admin';
  if (isActive !== undefined) patch.isActive = Boolean(isActive);

  // Never let the last enabled admin disable or remove themselves.
  const isSelf = req.admin?.id === id;
  if (isSelf && patch.isActive === false) {
    return res.status(400).json({ error: 'You cannot deactivate your own account.' });
  }

  try {
    const existing = await db.getAdminById(id);
    if (!existing) return res.status(404).json({ error: 'Admin user not found.' });

    // The super admin identity is permanent: it cannot be renamed, disabled,
    // or demoted, otherwise nobody could ever manage admin users again.
    if (isSuperAdmin(existing)) {
      if (patch.username !== undefined) {
        return res.status(400).json({ error: 'The super admin email cannot be changed.' });
      }
      if (patch.isActive === false) {
        return res.status(400).json({ error: 'The super admin account cannot be deactivated.' });
      }
      if (patch.role !== undefined) {
        return res.status(400).json({ error: 'The super admin role cannot be changed.' });
      }
    }

    const isDisabling = patch.isActive === false && existing.isActive !== false;
    if (isDisabling && (await db.countActiveAdmins()) <= 1) {
      return res.status(400).json({ error: 'At least one active admin must remain.' });
    }

    const updated = await db.updateAdmin(id, patch);
    if (!updated) return res.status(404).json({ error: 'Admin user not found.' });

    // Changing your own password or role invalidates the current session cookie.
    if (isSelf && (patch.password || patch.username)) {
      const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
      res.clearCookie('admin_session', {
        path: '/',
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax'
      });
    }

    return res.json({ success: true, admin: updated, sessionRevoked: isSelf && Boolean(patch.password) });
  } catch (err) {
    if (err.code === 'DUPLICATE_USERNAME') {
      return res.status(409).json({ error: 'An admin with that email already exists.' });
    }
    return res.status(500).json({ error: 'Failed to update admin user.' });
  }
});

// DELETE /api/admin/admins/:id
app.delete('/api/admin/admins/:id', requireAuth, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;

  if (req.admin?.id === id) {
    return res.status(400).json({ error: 'You cannot delete your own account.' });
  }

  try {
    const existing = await db.getAdminById(id);
    if (!existing) return res.status(404).json({ error: 'Admin user not found.' });

    // The super admin account can never be deleted, not even by itself.
    if (isSuperAdmin(existing)) {
      return res.status(400).json({ error: 'The super admin account cannot be deleted.' });
    }

    if (existing.isActive !== false && (await db.countActiveAdmins()) <= 1) {
      return res.status(400).json({ error: 'At least one active admin must remain.' });
    }

    const deleted = await db.deleteAdmin(id);
    if (!deleted) return res.status(404).json({ error: 'Admin user not found.' });

    return res.json({ success: true, message: 'Admin user deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete admin user.' });
  }
});

// POST /api/admin/admins/me/password
app.post('/api/admin/admins/me/password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  const passwordError = validatePassword(newPassword);
  if (passwordError) return res.status(400).json({ error: passwordError });

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: 'New password must be different from the current one.' });
  }

  try {
    const admin = await db.getAdminById(req.admin.id);
    if (!admin || !admin.passwordHash) {
      return res.status(404).json({ error: 'Admin user not found.' });
    }
    if (!bcrypt.compareSync(String(currentPassword || ''), admin.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    await db.updateAdmin(req.admin.id, { password: newPassword });

    const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
    res.clearCookie('admin_session', {
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax'
    });

    return res.json({ success: true, message: 'Password updated. Please sign in again.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to change password.' });
  }
});

// --- CATALOG API ROUTES ---

// GET /api/catalogs (Public)
app.get('/api/catalogs', async (_req, res) => {
  try {
    const catalogs = await db.getAllCatalogs();
    return res.json({ success: true, catalogs });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch catalog services.' });
  }
});

// POST /api/admin/catalogs (Protected)
app.post('/api/admin/catalogs', requireAuth, async (req, res) => {
  try {
    const { title, subtext, price, category } = req.body || {};
    if (!title || !price) {
      return res.status(400).json({ error: 'Service Title and Price are required.' });
    }

    const created = await db.createCatalog({ title, subtext, price, category });
    return res.status(201).json({ success: true, catalog: created });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create catalog service.' });
  }
});

// PUT /api/admin/catalogs/:id (Protected)
app.put('/api/admin/catalogs/:id', requireAuth, async (req, res) => {
  try {
    const updated = await db.updateCatalog(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Catalog item not found.' });
    }
    return res.json({ success: true, catalog: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update catalog service.' });
  }
});

// DELETE /api/admin/catalogs/:id (Protected)
app.delete('/api/admin/catalogs/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await db.deleteCatalog(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Catalog item not found.' });
    }
    return res.json({ success: true, message: 'Catalog item deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete catalog service.' });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[RGC Server] Express server running on port ${PORT}`);
  });
}

export default app;
