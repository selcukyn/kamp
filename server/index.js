import { createServer } from 'http';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';
import { seedUsers, seedDepartments, seedEvents, seedIpConfig } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'db.json');
const PORT = process.env.PORT || 4000;

const defaultState = () => ({
  users: [...seedUsers],
  departments: [...seedDepartments],
  events: [...seedEvents],
  ipConfig: { ...seedIpConfig },
  notifications: [],
  logs: []
});

function ensureDataFile() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    const initial = defaultState();
    writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

function loadData() {
  ensureDataFile();
  try {
    const raw = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read data file, resetting...', err);
    const fallback = defaultState();
    writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function saveData(data) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve(null);
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const state = loadData();

  try {
    // Bootstrap all data at once
    if (path === '/api/bootstrap' && req.method === 'GET') {
      return sendJson(res, 200, state);
    }

    // Users
    if (path === '/api/users' && req.method === 'POST') {
      const body = await parseBody(req);
      const newUser = { id: randomUUID(), ...body };
      state.users.push(newUser);
      saveData(state);
      return sendJson(res, 201, newUser);
    }

    if (path.startsWith('/api/users/') && req.method === 'DELETE') {
      const id = path.split('/').pop();
      state.users = state.users.filter(u => u.id !== id);
      state.events = state.events.map(ev => ev.assigneeId === id ? { ...ev, assigneeId: undefined } : ev);
      saveData(state);
      return sendJson(res, 200, { ok: true });
    }

    // Departments
    if (path === '/api/departments' && req.method === 'POST') {
      const body = await parseBody(req);
      const newDept = { id: randomUUID(), ...body };
      state.departments.push(newDept);
      saveData(state);
      return sendJson(res, 201, newDept);
    }

    if (path.startsWith('/api/departments/') && req.method === 'DELETE') {
      const id = path.split('/').pop();
      state.departments = state.departments.filter(d => d.id !== id);
      state.events = state.events.map(ev => ev.departmentId === id ? { ...ev, departmentId: undefined } : ev);
      saveData(state);
      return sendJson(res, 200, { ok: true });
    }

    // IP Config
    if (path === '/api/ip-config' && req.method === 'PUT') {
      const body = await parseBody(req);
      state.ipConfig = body;
      saveData(state);
      return sendJson(res, 200, state.ipConfig);
    }

    // Events
    if (path === '/api/events' && req.method === 'POST') {
      const body = await parseBody(req);
      const newEvent = { id: randomUUID(), ...body };
      state.events.push(newEvent);

      let notification = null;
      let log = null;
      if (body.assigneeId) {
        const user = state.users.find(u => u.id === body.assigneeId);
        if (user) {
          notification = {
            id: randomUUID(),
            title: 'Görev Ataması Yapıldı',
            message: `${user.name} kişisine "${body.title}" görevi atandı.`,
            date: new Date().toISOString(),
            isRead: false,
            type: 'email'
          };
          state.notifications.unshift(notification);
          log = {
            id: randomUUID(),
            message: `${body.title} kampanyası için ${user.name} kişisine görev ataması yapıldı (ID: ${newEvent.id})`,
            timestamp: new Date().toISOString()
          };
          state.logs.unshift(log);
        }
      }

      saveData(state);
      return sendJson(res, 201, { event: newEvent, notification, log });
    }

    if (path.startsWith('/api/events/') && req.method === 'DELETE') {
      const id = path.split('/').pop();
      state.events = state.events.filter(ev => ev.id !== id);
      saveData(state);
      return sendJson(res, 200, { ok: true });
    }

    if (path === '/api/events' && req.method === 'DELETE') {
      state.events = [];
      saveData(state);
      return sendJson(res, 200, { ok: true });
    }

    // Notifications and Logs
    if (path === '/api/notifications' && req.method === 'GET') {
      return sendJson(res, 200, state.notifications);
    }

    if (path === '/api/logs' && req.method === 'GET') {
      return sendJson(res, 200, state.logs);
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('Request error', err);
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
