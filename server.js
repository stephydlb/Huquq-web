import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const SALT_ROUNDS = 10;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all handler: send back index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// Initialize database and create users table if not exists
db.serialize(() => {
  // Drop existing table to ensure correct schema
  db.run("DROP TABLE IF EXISTS users", (err) => {
    if (err) {
      console.error('Drop table error:', err);
    }
  });

  db.run(`CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) {
      console.error('Table creation error:', err);
    }
  });

  // Log the current table schema
  db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) {
      console.error('Schema query error:', err);
    } else {
      console.log('Users table schema:');
      rows.forEach(row => {
        console.log(`  - ${row.name}: ${row.type} (notnull: ${row.notnull}, pk: ${row.pk})`);
      });
    }
  });
});

// POST /register - Register new user
app.post('/register', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (row) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
      const id = uuidv4();

      // Insert new user
      db.run(
        'INSERT INTO users (id, email, name, passwordHash) VALUES (?, ?, ?, ?)',
        [id, email, name, passwordHash],
        function(err) {
          if (err) {
            console.error('INSERT error:', err);
            return res.status(500).json({ error: err.message || 'Failed to register user' });
          }
          res.status(201).json({ message: 'User registered successfully', userId: id });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /login - Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    try {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        res.json({ message: 'Login successful', userId: user.id, name: user.name });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
