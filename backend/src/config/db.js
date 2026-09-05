import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? join('/tmp', 'flavorly') : join(__dirname, '..', 'data');
const DB_FILE = join(DATA_DIR, 'db.json');

try {
  mkdirSync(DATA_DIR, { recursive: true });
} catch (err) {
  console.warn('[db] could not create data dir (ephemeral mode):', err.message);
}

function emptyDb() {
  return { users: [], recipes: [], _meta: { seededAt: null } };
}

let db = emptyDb();

function load() {
  if (existsSync(DB_FILE)) {
    try {
      db = JSON.parse(readFileSync(DB_FILE, 'utf8'));
      if (!Array.isArray(db.users)) db.users = [];
      if (!Array.isArray(db.recipes)) db.recipes = [];
    } catch {
      db = emptyDb();
    }
  }
}

function save() {
  try {
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.warn('[db] write skipped (ephemeral filesystem):', err.message);
  }
}

export const DataStore = {
  load,
  save,
  get db() {
    return db;
  },
  nextId(collection) {
    const rows = db[collection] || [];
    if (rows.length === 0) return 1;
    return Math.max(...rows.map((r) => Number(r.id))) + 1;
  },
  find(collection, predicate) {
    return (db[collection] || []).filter(predicate);
  },
  findOne(collection, predicate) {
    return (db[collection] || []).find(predicate) || null;
  },
  insert(collection, row) {
    db[collection] = db[collection] || [];
    db[collection].push(row);
    save();
    return row;
  },
  update(collection, predicate, changes) {
    const row = this.findOne(collection, predicate);
    if (!row) return null;
    Object.assign(row, changes);
    save();
    return row;
  },
  remove(collection, predicate) {
    const before = (db[collection] || []).length;
    db[collection] = (db[collection] || []).filter((r) => !predicate(r));
    const removed = before - db[collection].length;
    if (removed > 0) save();
    return removed;
  },
};