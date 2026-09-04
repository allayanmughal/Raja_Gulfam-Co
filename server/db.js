import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
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
    const { neon } = await import('@neondatabase/serverless');
    sqlClient = neon(process.env.DATABASE_URL);
  } catch (err) {
    console.warn("Neon DB package not available or initialization failed. Falling back to local/in-memory storage.", err);
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
    events: [...defaultSeedEvents]
  };
}

function readLocalData() {
  if (memoryStore) return memoryStore;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      memoryStore = JSON.parse(raw);
      return memoryStore;
    } catch (err) {
      console.error("Error reading database file, resetting...", err);
    }
  }

  memoryStore = getInitialData();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    // Ignore file write error on read-only serverless filesystems
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
    // Ephemeral serverless fallback
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

    // Seed admin if not present
    const existingAdmins = await sqlClient`SELECT id FROM admins LIMIT 1`;
    if (existingAdmins.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);
      await sqlClient`
        INSERT INTO admins (id, username, password_hash)
        VALUES (${'admin-1'}, ${INITIAL_ADMIN_EMAIL}, ${passwordHash});
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
  } catch (err) {
    console.error("Neon DB Init Error:", err);
  }
}

let neonInitialized = false;

export const db = {
  async getAdminByUsername(username) {
    if (sqlClient) {
      if (!neonInitialized) {
        await initNeonTables();
        neonInitialized = true;
      }
      try {
        const rows = await sqlClient`
          SELECT id, username, password_hash AS "passwordHash", created_at AS "createdAt"
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
    return data.admins.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
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
  }
};
