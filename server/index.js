import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'rgc_super_secret_jwt_key_2026_production_secure';

// Ensure public/uploads directory exists
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `event-img-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (jpg, png, webp, gif, svg) are allowed'));
    }
  }
});

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serve static uploaded images
app.use('/uploads', express.static(UPLOADS_DIR));

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

// --- AUTHENTICATION ROUTES ---

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/Email and password are required.' });
  }

  const admin = db.getAdminByUsername(username);
  if (!admin) {
    return res.status(401).json({ error: 'Invalid email/username or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, admin.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email/username or password.' });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('admin_session', token, {
    httpOnly: true,
    secure: false, // set to true in HTTPS production
    sameSite: 'lax',
    path: '/',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
  });

  return res.json({
    success: true,
    message: 'Login successful.',
    admin: { id: admin.id, username: admin.username }
  });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie('admin_session', { path: '/' });
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
    return res.json({ authenticated: true, admin: decoded });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

// --- PUBLIC FRONTEND API ---

// GET /api/events
app.get('/api/events', (_req, res) => {
  try {
    const events = db.getPublishedEvents();
    return res.json({ success: true, events });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch published events.' });
  }
});

// --- PROTECTED ADMIN APIS ---

// GET /api/admin/events
app.get('/api/admin/events', requireAuth, (_req, res) => {
  try {
    const events = db.getAllEvents();
    return res.json({ success: true, events });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin events.' });
  }
});

// POST /api/admin/events
app.post('/api/admin/events', requireAuth, (req, res) => {
  try {
    const { title, priorityDetail, description, images, date, template, published } = req.body;
    if (!title || !priorityDetail || !description) {
      return res.status(400).json({ error: 'Title, High-Priority Detail, and Description are required.' });
    }

    const newEvent = db.createEvent({
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
app.put('/api/admin/events/:id', requireAuth, (req, res) => {
  try {
    const updated = db.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ success: true, event: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update event.' });
  }
});

// DELETE /api/admin/events/:id
app.delete('/api/admin/events/:id', requireAuth, (req, res) => {
  try {
    const deleted = db.deleteEvent(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Event not found.' });
    }
    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete event.' });
  }
});

// POST /api/admin/upload (Image Upload)
app.post('/api/admin/upload', requireAuth, upload.array('images', 10), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded.' });
    }
    const fileUrls = files.map(file => `/uploads/${file.filename}`);
    return res.json({ success: true, urls: fileUrls });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to process image upload.' });
  }
});

app.listen(PORT, () => {
  console.log(`[RGC Server] Express server running on port ${PORT}`);
});
