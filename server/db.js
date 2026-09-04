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

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

function readData() {
  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);
    
    const initialData = {
      admins: [
        {
          id: "admin-1",
          username: INITIAL_ADMIN_EMAIL,
          passwordHash: passwordHash,
          createdAt: new Date().toISOString()
        }
      ],
      events: defaultSeedEvents
    };
    
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, recreating...", err);
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);
    const fallbackData = {
      admins: [
        {
          id: "admin-1",
          username: INITIAL_ADMIN_EMAIL,
          passwordHash: passwordHash,
          createdAt: new Date().toISOString()
        }
      ],
      events: defaultSeedEvents
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackData, null, 2), 'utf8');
    return fallbackData;
  }
}

function writeData(data) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, DB_FILE);
}

export const db = {
  getAdminByUsername(username) {
    const data = readData();
    return data.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  },

  getAllEvents() {
    const data = readData();
    return data.events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getPublishedEvents() {
    const data = readData();
    return data.events
      .filter(e => e.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  getEventById(id) {
    const data = readData();
    return data.events.find(e => e.id === id);
  },

  createEvent(eventInput) {
    const data = readData();
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

    data.events.unshift(newEvent);
    writeData(data);
    return newEvent;
  },

  updateEvent(id, eventInput) {
    const data = readData();
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
    writeData(data);
    return updated;
  },

  deleteEvent(id) {
    const data = readData();
    const index = data.events.findIndex(e => e.id === id);
    if (index === -1) return false;

    data.events.splice(index, 1);
    writeData(data);
    return true;
  }
};
