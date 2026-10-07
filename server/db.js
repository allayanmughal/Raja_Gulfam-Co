import fs from 'fs';
import path from 'path';
import os from 'os';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import { defaultSeedCatalogs } from './seedCatalog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL
  ? os.tmpdir()
  : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rajagulfam.com';
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';

const defaultSeedEvents = [
  {
    id: "evt-101",
    title: "Annual Statutory Tax & Regulatory Compliance Summit 2026",
    priorityDetail: "URGENT NOTICE: FBR, SECP & HMRC Q3 Corporate Filing Deadline — September 15, 2026",
    description: "Join Senior Managing Partner Raja Gulfam and executive tax advisors for an essential strategic breakdown of 2026/2027 statutory tax amendments. Learn key exemptions for tech startups, real estate investors, and cross-border trade entities.",
    images: [
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1542744801-30d00f056a20?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-09-15",
    template: "template1",
    published: true,
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z"
  },
  {
    id: "evt-102",
    title: "Overseas Tax Strategy & Non-Resident Asset Reporting Workshop",
    priorityDetail: "CRITICAL COMPLIANCE: Foreign Direct Investment & Offshore Holding Disclosure Regulations",
    description: "Comprehensive guidance for Overseas Pakistanis and international investors operating dual-jurisdiction entities across UK, UAE, and Pakistan. Ensure full protection against double-taxation.",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-09-22",
    template: "template2",
    published: true,
    createdAt: "2026-08-15T11:30:00.000Z",
    updatedAt: "2026-08-15T11:30:00.000Z"
  },
  {
    id: "evt-103",
    title: "Corporate Restructuring & Forensic Audit Insights",
    priorityDetail: "IMPORTANT WARNING: Strict SECP Beneficial Ownership & Audit Trail Enforcement",
    description: "Detailed analysis of recent forensic auditing protocols, SECP compliance mandates, and corporate restructuring frameworks designed to shield corporate assets and maintain financial transparency.",
    images: [
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-10-05",
    template: "template3",
    published: true,
    createdAt: "2026-08-20T14:15:00.000Z",
    updatedAt: "2026-08-20T14:15:00.000Z"
  },
  {
    id: "evt-104",
    title: "Digital Sales Tax & E-Invoicing Advisory Masterclass",
    priorityDetail: "IMMEDIATE ACTION REQUIRED: Direct Integration with FBR POS & Digital E-Invoicing Gateways",
    description: "Step-by-step technical and compliance blueprint for retail businesses, SaaS providers, and e-commerce operators deploying automated digital sales tax integration.",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-10-18",
    template: "template4",
    published: true,
    createdAt: "2026-08-22T08:00:00.000Z",
    updatedAt: "2026-08-22T08:00:00.000Z"
  },
  {
    id: "evt-105",
    title: "RGC Accountants Recognized as Top Financial Advisory Firm 2026",
    priorityDetail: "MILESTONE ANNOUNCEMENT: Over PKR 2.5 Billion Client Tax Liability Successfully Optimized",
    description: "We are proud to announce our recognition as Pakistan's leading tax and corporate audit consultancy firm. Thank you to our 450+ valued corporate clients across Islamabad, Lahore, Karachi & London.",
    images: [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-11-01",
    template: "template5",
    published: true,
    createdAt: "2026-08-25T16:45:00.000Z",
    updatedAt: "2026-08-25T16:45:00.000Z"
  },
  {
    id: "evt-106",
    title: "High-Net-Worth Individual (HNWI) Wealth Protection & Tax Optimization",
    priorityDetail: "EXECUTIVE BULLETIN: Capital Gains Tax (CGT) & Property Transaction Tax Amendments",
    description: "Tailored wealth management strategies for business executives, family offices, and high-net-worth investors navigating income tax slabs and capital gains exemptions.",
    images: [
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1200"
    ],
    date: "2026-11-15",
    template: "template6",
    published: true,
    createdAt: "2026-08-28T10:10:00.000Z",
    updatedAt: "2026-08-28T10:10:00.000Z"
  }
];

let sqlClient = null;
if (process.env.DATABASE_URL) {
  try {
    sqlClient = neon(process.env.DATABASE_URL);
  } catch (err) {
    console.warn("Neon DB client initialization failed. Falling back to in-memory storage.", err);
  }
}

// In-Memory state fallback for read/write when file system is read-only (e.g. Vercel without DATABASE_URL)
let memoryStore = null;

function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);
  return {
    admins: [
      {
        id: "admin-1",
        username: INITIAL_ADMIN_EMAIL,
        passwordHash: passwordHash,
        createdAt: new Date().toISOString()
      }
    ],
    events: [...defaultSeedEvents],
    catalogs: [...defaultSeedCatalogs]
  };
}

function readLocalData() {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      memoryStore = JSON.parse(raw);
      if (!memoryStore.catalogs || memoryStore.catalogs.length === 0) {
        memoryStore.catalogs = [...defaultSeedCatalogs];
      }
      return memoryStore;
    }
  } catch (err) {
    console.warn("Could not read DB_FILE, using initial data fallback:", err.message);
  }

  memoryStore = getInitialData();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    // Read-only serverless environment safe fallback
  }
  return memoryStore;
}

function writeLocalData(data) {
  memoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    // Read-only serverless environment safe fallback
  }
}

async function initNeonTables() {
  if (!sqlClient) return;
  try {
    await sqlClient`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sqlClient`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        priority_detail TEXT NOT NULL,
        description TEXT NOT NULL,
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        date TEXT NOT NULL,
        template TEXT NOT NULL DEFAULT 'template1',
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sqlClient`
      CREATE TABLE IF NOT EXISTS catalogs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtext TEXT NOT NULL,
        price TEXT NOT NULL,
        category TEXT DEFAULT 'Taxation',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // --- Auth module migrations (idempotent, safe to re-run) ---
    await sqlClient`ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin'`;
    await sqlClient`ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE`;
    await sqlClient`ALTER TABLE admins ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE`;
    await sqlClient`ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`;
    // Server-side session revocation: every token carries the version it was
    // issued at, and logout bumps it so outstanding cookies die immediately.
    await sqlClient`ALTER TABLE admins ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 0`;

    // The column-level UNIQUE on username is case-SENSITIVE, so it would happily
    // allow Foo@x.com and foo@x.com to coexist while the login lookup (which
    // uses LOWER) matched an arbitrary one. Collapse any such rows first, then
    // enforce case-insensitive uniqueness with a functional index.
    await sqlClient`
      DELETE FROM admins a
      USING admins b
      WHERE LOWER(a.username) = LOWER(b.username) AND a.created_at > b.created_at
    `;
    await sqlClient`CREATE UNIQUE INDEX IF NOT EXISTS admins_username_lower_key ON admins (LOWER(username))`;

    // Seed admin if not present
    const existingAdmins = await sqlClient`SELECT id FROM admins LIMIT 1`;
    if (existingAdmins.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);
      await sqlClient`
        INSERT INTO admins (id, username, password_hash, role, is_active)
        VALUES (${'admin-1'}, ${INITIAL_ADMIN_EMAIL}, ${passwordHash}, ${'admin'}, TRUE);
      `;
    }

    // Seed default events if empty
    const existingEvents = await sqlClient`SELECT id FROM events LIMIT 1`;
    if (existingEvents.length === 0) {
      for (const evt of defaultSeedEvents) {
        await sqlClient`
          INSERT INTO events (id, title, priority_detail, description, images, date, template, published, created_at, updated_at)
          VALUES (
            ${evt.id},
            ${evt.title},
            ${evt.priorityDetail},
            ${evt.description},
            ${JSON.stringify(evt.images)},
            ${evt.date},
            ${evt.template},
            ${evt.published},
            ${evt.createdAt},
            ${evt.updatedAt}
          );
        `;
      }
    }

    // Seed catalogs if empty
    const existingCatalogs = await sqlClient`SELECT id FROM catalogs LIMIT 1`;
    if (existingCatalogs.length === 0) {
      for (const cat of defaultSeedCatalogs) {
        await sqlClient`
          INSERT INTO catalogs (id, title, subtext, price, category)
          VALUES (
            ${cat.id},
            ${cat.title},
            ${cat.subtext},
            ${cat.price},
            ${cat.category || 'Taxation'}
          );
        `;
      }
    }
  } catch (err) {
    console.error("Neon DB Init Error:", err);
  }
}

let neonInitialized = false;

/**
 * Lazily create/upgrade the Neon schema exactly once per process.
 * Returns false when no DATABASE_URL is configured so callers can fall back
 * to the local JSON store.
 */
async function ensureNeonReady() {
  if (!sqlClient) return false;
  if (!neonInitialized) {
    await initNeonTables();
    neonInitialized = true;
  }
  return true;
}

/** Strip secrets before an admin record ever leaves the server. */
function toPublicAdmin(admin) {
  if (!admin) return null;
  const { passwordHash, password_hash, sessionVersion, session_version, ...rest } = admin;
  return rest;
}

/** Give JSON-store records the same shape as Neon rows. */
function normalizeAdmin(admin) {
  return {
    id: admin.id,
    username: admin.username,
    role: admin.role || 'admin',
    isActive: admin.isActive !== false,
    sessionVersion: Number(admin.sessionVersion || admin.session_version || 0),
    createdAt: admin.createdAt || null,
    updatedAt: admin.updatedAt || admin.createdAt || null,
    lastLoginAt: admin.lastLoginAt || null,
  };
}

function isUniqueViolation(err) {
  return err && (err.code === '23505' || /already exists|duplicate key/i.test(err.message || ''));
}

export const db = {
  async getAdminByUsername(username) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const rows = await sqlClient`
          SELECT id, username, password_hash AS "passwordHash", role,
                 is_active AS "isActive", created_at AS "createdAt",
                 updated_at AS "updatedAt", last_login_at AS "lastLoginAt",
                 session_version AS "sessionVersion"
          FROM admins
          WHERE LOWER(username) = LOWER(${username})
          LIMIT 1
        `;
        return rows[0] || null;
      } catch (err) {
        console.error("Neon Query Error (getAdminByUsername):", err);
      }
    }

    const data = readLocalData();
    const found = data.admins.find((a) => a.username.toLowerCase() === username.toLowerCase());
    return found ? { ...normalizeAdmin(found), passwordHash: found.passwordHash } : null;
  },

  /** All admin accounts, never including password hashes. */
  async listAdmins() {
    if (await ensureNeonReady()) {
      try {
        return await sqlClient`
          SELECT id, username, role, is_active AS "isActive",
                 created_at AS "createdAt", updated_at AS "updatedAt",
                 last_login_at AS "lastLoginAt"
          FROM admins
          ORDER BY created_at ASC
        `;
      } catch (err) {
        console.error("Neon Query Error (listAdmins):", err);
      }
    }

    return readLocalData().admins.map((a) => normalizeAdmin(a));
  },

  async getAdminById(id) {
    if (await ensureNeonReady()) {
      try {
        const rows = await sqlClient`
          SELECT id, username, password_hash AS "passwordHash", role,
                 is_active AS "isActive", created_at AS "createdAt",
                 updated_at AS "updatedAt", last_login_at AS "lastLoginAt",
                 session_version AS "sessionVersion"
          FROM admins
          WHERE id = ${id}
          LIMIT 1
        `;
        return rows[0] || null;
      } catch (err) {
        console.error("Neon Query Error (getAdminById):", err);
      }
    }

    const found = readLocalData().admins.find((a) => a.id === id);
    return found ? { ...normalizeAdmin(found), passwordHash: found.passwordHash } : null;
  },

  /** Number of enabled accounts — guards against locking everyone out. */
  async countActiveAdmins() {
    if (await ensureNeonReady()) {
      try {
        const rows = await sqlClient`SELECT COUNT(*)::int AS count FROM admins WHERE is_active = TRUE`;
        return rows[0].count;
      } catch (err) {
        console.error("Neon Query Error (countActiveAdmins):", err);
      }
    }

    return readLocalData().admins.filter((a) => a.isActive !== false).length;
  },

  /**
   * Create an admin. Throws an error with `.code = 'DUPLICATE_USERNAME'`
   * when the username is already taken.
   */
  async createAdmin({ username, password, role = 'admin' }) {
    const id = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const now = new Date().toISOString();

    if (await ensureNeonReady()) {
      try {
        // Explicit case-insensitive pre-check so the client gets a clean
        // DUPLICATE_USERNAME instead of a raw index violation.
        const clash = await sqlClient`SELECT id FROM admins WHERE LOWER(username) = LOWER(${username}) LIMIT 1`;
        if (clash.length > 0) {
          throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
        }

        const rows = await sqlClient`
          INSERT INTO admins (id, username, password_hash, role, is_active, created_at, updated_at)
          VALUES (${id}, ${username}, ${passwordHash}, ${role}, TRUE, ${now}, ${now})
          RETURNING id, username, role, is_active AS "isActive",
                    created_at AS "createdAt", updated_at AS "updatedAt"
        `;
        return rows[0];
      } catch (err) {
        console.error("Neon Query Error (createAdmin):", err);
        if (isUniqueViolation(err)) {
          throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
        }
        throw err;
      }
    }

    const data = readLocalData();
    if (data.admins.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
    }
    const newAdmin = {
      id, username, passwordHash, role, isActive: true,
      createdAt: now, updatedAt: now, lastLoginAt: null,
    };
    data.admins.push(newAdmin);
    writeLocalData(data);
    return toPublicAdmin(newAdmin);
  },

  /** Partial update. Only re-hashes when a new password is supplied. */
  async updateAdmin(id, patch = {}) {
    const now = new Date().toISOString();

    if (await ensureNeonReady()) {
      try {
        const existingRows = await sqlClient`SELECT * FROM admins WHERE id = ${id} LIMIT 1`;
        if (existingRows.length === 0) return null;
        const existing = existingRows[0];

        if (patch.username !== undefined) {
          const clashRows = await sqlClient`
            SELECT id FROM admins
            WHERE LOWER(username) = LOWER(${patch.username}) AND id <> ${id}
            LIMIT 1
          `;
          if (clashRows.length > 0) {
            throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
          }
        }

        const username = patch.username !== undefined ? patch.username : existing.username;
        const role = patch.role !== undefined ? patch.role : (existing.role || 'admin');
        const isActive = patch.isActive !== undefined ? patch.isActive : existing.is_active;
        const passwordHash =
          patch.password ? bcrypt.hashSync(patch.password, bcrypt.genSaltSync(10)) : existing.password_hash;

        // Rotating credentials revokes every session issued to this account.
        const credentialsChanged =
          (patch.password !== undefined && patch.password !== '') ||
          (patch.username !== undefined && patch.username !== existing.username);
        const sessionVersion =
          Number(existing.session_version || 0) + (credentialsChanged ? 1 : 0);

        const rows = await sqlClient`
          UPDATE admins
          SET username = ${username}, role = ${role}, is_active = ${isActive},
              password_hash = ${passwordHash}, session_version = ${sessionVersion},
              updated_at = ${now}
          WHERE id = ${id}
          RETURNING id, username, role, is_active AS "isActive",
                    created_at AS "createdAt", updated_at AS "updatedAt",
                    last_login_at AS "lastLoginAt", session_version AS "sessionVersion"
        `;
        return rows[0] || null;
      } catch (err) {
        console.error("Neon Query Error (updateAdmin):", err);
        if (isUniqueViolation(err)) {
          throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
        }
        throw err;
      }
    }

    const data = readLocalData();
    const index = data.admins.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = data.admins[index];
    if (patch.username !== undefined) {
      const clash = data.admins.some(
        (a) => a.id !== id && a.username.toLowerCase() === patch.username.toLowerCase()
      );
      if (clash) {
        throw Object.assign(new Error('Username already exists.'), { code: 'DUPLICATE_USERNAME' });
      }
    }

    const credentialsChanged =
      (patch.password !== undefined && patch.password !== '') ||
      (patch.username !== undefined && patch.username !== existing.username);

    data.admins[index] = {
      ...existing,
      username: patch.username !== undefined ? patch.username : existing.username,
      role: patch.role !== undefined ? patch.role : (existing.role || 'admin'),
      isActive: patch.isActive !== undefined ? patch.isActive : existing.isActive !== false,
      passwordHash: patch.password
        ? bcrypt.hashSync(patch.password, bcrypt.genSaltSync(10))
        : existing.passwordHash,
      sessionVersion:
        Number(existing.sessionVersion || existing.session_version || 0) +
        (credentialsChanged ? 1 : 0),
      updatedAt: now,
    };
    writeLocalData(data);
    return normalizeAdmin(data.admins[index]);
  },

  async deleteAdmin(id) {
    if (await ensureNeonReady()) {
      try {
        const rows = await sqlClient`DELETE FROM admins WHERE id = ${id} RETURNING id`;
        return rows.length > 0;
      } catch (err) {
        console.error("Neon Query Error (deleteAdmin):", err);
      }
    }

    const data = readLocalData();
    const index = data.admins.findIndex((a) => a.id === id);
    if (index === -1) return false;
    data.admins.splice(index, 1);
    writeLocalData(data);
    return true;
  },

  /** Best-effort login timestamp; never blocks a successful login. */
  async touchAdminLogin(id) {
    if (await ensureNeonReady()) {
      try {
        await sqlClient`UPDATE admins SET last_login_at = NOW(), updated_at = NOW() WHERE id = ${id}`;
        return;
      } catch (err) {
        console.error("Neon Query Error (touchAdminLogin):", err);
        return;
      }
    }

    const data = readLocalData();
    const admin = data.admins.find((a) => a.id === id);
    if (admin) {
      admin.lastLoginAt = new Date().toISOString();
      admin.updatedAt = admin.lastLoginAt;
      writeLocalData(data);
    }
  },

  /**
   * Invalidate every outstanding session cookie for an admin. Called on logout
   * so a token that was copied out of the browser dies with the session, not
   * eight hours later.
   */
  async bumpAdminSessionVersion(id) {
    // Mirror getAdminById/getAdminByUsername: if Neon is unreachable, keep the
    // JSON store in step so reads and revocations agree with each other.
    if (await ensureNeonReady()) {
      try {
        await sqlClient`UPDATE admins SET session_version = COALESCE(session_version, 0) + 1 WHERE id = ${id}`;
        return true;
      } catch (err) {
        console.error("Neon Query Error (bumpAdminSessionVersion):", err);
      }
    }

    const data = readLocalData();
    const admin = data.admins.find((a) => a.id === id);
    if (!admin) return false;
    admin.sessionVersion = Number(admin.sessionVersion || admin.session_version || 0) + 1;
    writeLocalData(data);
    return true;
  },

  async getAllEvents() {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const rows = await sqlClient`
          SELECT id, title, priority_detail AS "priorityDetail", description, images, date, template, published, created_at AS "createdAt", updated_at AS "updatedAt"
          FROM events
          ORDER BY created_at DESC
        `;
        return rows.map(r => ({
          ...r,
          images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images
        }));
      } catch (err) {
        console.error("Neon Query Error (getAllEvents):", err);
      }
    }

    const data = readLocalData();
    return data.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getPublishedEvents() {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const rows = await sqlClient`
          SELECT id, title, priority_detail AS "priorityDetail", description, images, date, template, published, created_at AS "createdAt", updated_at AS "updatedAt"
          FROM events
          WHERE published = true
          ORDER BY date DESC
        `;
        return rows.map(r => ({
          ...r,
          images: typeof r.images === 'string' ? JSON.parse(r.images) : r.images
        }));
      } catch (err) {
        console.error("Neon Query Error (getPublishedEvents):", err);
      }
    }

    const data = readLocalData();
    return data.events
      .filter(e => e.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async createEvent(eventInput) {
    const now = new Date().toISOString();
    const newEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: eventInput.title,
      priorityDetail: eventInput.priorityDetail,
      description: eventInput.description,
      images: Array.isArray(eventInput.images) ? eventInput.images : [],
      date: eventInput.date || new Date().toISOString().split('T')[0],
      template: eventInput.template || 'template1',
      published: Boolean(eventInput.published),
      createdAt: now,
      updatedAt: now
    };

    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        await sqlClient`
          INSERT INTO events (id, title, priority_detail, description, images, date, template, published, created_at, updated_at)
          VALUES (
            ${newEvent.id},
            ${newEvent.title},
            ${newEvent.priorityDetail},
            ${newEvent.description},
            ${JSON.stringify(newEvent.images)},
            ${newEvent.date},
            ${newEvent.template},
            ${newEvent.published},
            ${newEvent.createdAt},
            ${newEvent.updatedAt}
          );
        `;
        return newEvent;
      } catch (err) {
        console.error("Neon Query Error (createEvent):", err);
      }
    }

    const data = readLocalData();
    data.events.unshift(newEvent);
    writeLocalData(data);
    return newEvent;
  },

  async updateEvent(id, eventInput) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const existingRows = await sqlClient`SELECT * FROM events WHERE id = ${id} LIMIT 1`;
        if (existingRows.length === 0) return null;
        const existing = existingRows[0];

        const updated = {
          title: eventInput.title !== undefined ? eventInput.title : existing.title,
          priorityDetail: eventInput.priorityDetail !== undefined ? eventInput.priorityDetail : existing.priority_detail,
          description: eventInput.description !== undefined ? eventInput.description : existing.description,
          images: Array.isArray(eventInput.images) ? eventInput.images : existing.images,
          date: eventInput.date !== undefined ? eventInput.date : existing.date,
          template: eventInput.template !== undefined ? eventInput.template : existing.template,
          published: eventInput.published !== undefined ? Boolean(eventInput.published) : existing.published,
          updatedAt: new Date().toISOString()
        };

        await sqlClient`
          UPDATE events
          SET title = ${updated.title},
              priority_detail = ${updated.priorityDetail},
              description = ${updated.description},
              images = ${JSON.stringify(updated.images)},
              date = ${updated.date},
              template = ${updated.template},
              published = ${updated.published},
              updated_at = ${updated.updatedAt}
          WHERE id = ${id};
        `;

        return { id, ...updated };
      } catch (err) {
        console.error("Neon Query Error (updateEvent):", err);
      }
    }

    const data = readLocalData();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return null;

    const existing = data.events[index];
    const updated = {
      ...existing,
      title: eventInput.title !== undefined ? eventInput.title : existing.title,
      priorityDetail: eventInput.priorityDetail !== undefined ? eventInput.priorityDetail : existing.priorityDetail,
      description: eventInput.description !== undefined ? eventInput.description : existing.description,
      images: Array.isArray(eventInput.images) ? eventInput.images : existing.images,
      date: eventInput.date !== undefined ? eventInput.date : existing.date,
      template: eventInput.template !== undefined ? eventInput.template : existing.template,
      published: eventInput.published !== undefined ? Boolean(eventInput.published) : existing.published,
      updatedAt: new Date().toISOString()
    };

    data.events[index] = updated;
    writeLocalData(data);
    return updated;
  },

  async deleteEvent(id) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const result = await sqlClient`DELETE FROM events WHERE id = ${id} RETURNING id`;
        return result.length > 0;
      } catch (err) {
        console.error("Neon Query Error (deleteEvent):", err);
      }
    }

    const data = readLocalData();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return false;

    data.events.splice(index, 1);
    writeLocalData(data);
    return true;
  },

  // --- CATALOG METHODS ---

  async getAllCatalogs() {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const rows = await sqlClient`
          SELECT id, title, subtext, price, category, created_at AS "createdAt", updated_at AS "updatedAt"
          FROM catalogs
          ORDER BY created_at ASC
        `;
        return rows;
      } catch (err) {
        console.error("Neon Query Error (getAllCatalogs):", err);
      }
    }

    const data = readLocalData();
    return data.catalogs || defaultSeedCatalogs;
  },

  async createCatalog(catalogInput) {
    const newCatalog = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: catalogInput.title,
      subtext: catalogInput.subtext || '',
      price: catalogInput.price || 'PKR 0',
      category: catalogInput.category || 'Taxation'
    };

    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        await sqlClient`
          INSERT INTO catalogs (id, title, subtext, price, category)
          VALUES (
            ${newCatalog.id},
            ${newCatalog.title},
            ${newCatalog.subtext},
            ${newCatalog.price},
            ${newCatalog.category}
          );
        `;
        return newCatalog;
      } catch (err) {
        console.error("Neon Query Error (createCatalog):", err);
      }
    }

    const data = readLocalData();
    if (!data.catalogs) data.catalogs = [];
    data.catalogs.unshift(newCatalog);
    writeLocalData(data);
    return newCatalog;
  },

  async updateCatalog(id, catalogInput) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const existingRows = await sqlClient`SELECT * FROM catalogs WHERE id = ${id} LIMIT 1`;
        if (existingRows.length === 0) return null;
        const existing = existingRows[0];

        const updated = {
          title: catalogInput.title !== undefined ? catalogInput.title : existing.title,
          subtext: catalogInput.subtext !== undefined ? catalogInput.subtext : existing.subtext,
          price: catalogInput.price !== undefined ? catalogInput.price : existing.price,
          category: catalogInput.category !== undefined ? catalogInput.category : existing.category
        };

        await sqlClient`
          UPDATE catalogs
          SET title = ${updated.title},
              subtext = ${updated.subtext},
              price = ${updated.price},
              category = ${updated.category},
              updated_at = NOW()
          WHERE id = ${id};
        `;

        return { id, ...updated };
      } catch (err) {
        console.error("Neon Query Error (updateCatalog):", err);
      }
    }

    const data = readLocalData();
    if (!data.catalogs) data.catalogs = [...defaultSeedCatalogs];
    const index = data.catalogs.findIndex(c => c.id === id);
    if (index === -1) return null;

    const existing = data.catalogs[index];
    const updated = {
      ...existing,
      title: catalogInput.title !== undefined ? catalogInput.title : existing.title,
      subtext: catalogInput.subtext !== undefined ? catalogInput.subtext : existing.subtext,
      price: catalogInput.price !== undefined ? catalogInput.price : existing.price,
      category: catalogInput.category !== undefined ? catalogInput.category : existing.category
    };

    data.catalogs[index] = updated;
    writeLocalData(data);
    return updated;
  },

  async deleteCatalog(id) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const result = await sqlClient`DELETE FROM catalogs WHERE id = ${id} RETURNING id`;
        return result.length > 0;
      } catch (err) {
        console.error("Neon Query Error (deleteCatalog):", err);
      }
    }

    const data = readLocalData();
    if (!data.catalogs) data.catalogs = [...defaultSeedCatalogs];
    const index = data.catalogs.findIndex(c => c.id === id);
    if (index === -1) return false;

    data.catalogs.splice(index, 1);
    writeLocalData(data);
    return true;
  }
};
