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
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "http://localhost:3001", "https://content.googleapis.com", "https://accounts.google.com", "https://www.googleapis.com", "https://goldprice.org"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
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
    role TEXT NOT NULL DEFAULT 'client',
    representative_id TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (representative_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Table creation error:', err);
    }
  });

  db.run(`CREATE TABLE payments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Payments table creation error:', err);
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
  const { email, name, password, role, representativeId } = req.body;

  if (!email || !name || !password || !role) {
    return res.status(400).json({ error: 'Email, name, password, and role are required' });
  }

  if (!['client', 'representative'].includes(role)) {
    return res.status(400).json({ error: 'Role must be client or representative' });
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
        'INSERT INTO users (id, email, name, passwordHash, role, representative_id) VALUES (?, ?, ?, ?, ?, ?)',
        [id, email, name, passwordHash, role, representativeId || null],
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
        res.json({ message: 'Login successful', userId: user.id, name: user.name, role: user.role });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
});

// GET /representatives - Get list of representatives
app.get('/representatives', (req, res) => {
  db.all("SELECT id, name, email FROM users WHERE role = 'representative'", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST /set-representative - Set representative for client
app.post('/set-representative', (req, res) => {
  const { userId, representativeId } = req.body;

  if (!userId || !representativeId) {
    return res.status(400).json({ error: 'userId and representativeId are required' });
  }

  // Check if representative exists and is representative
  db.get("SELECT id FROM users WHERE id = ? AND role = 'representative'", [representativeId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(400).json({ error: 'Invalid representative' });
    }

    // Update user's representative_id
    db.run("UPDATE users SET representative_id = ? WHERE id = ?", [representativeId, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Representative set successfully' });
    });
  });
});

// POST /submit-payment - Submit a payment
app.post('/submit-payment', (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ error: 'userId and amount are required' });
  }

  const id = uuidv4();

  db.run("INSERT INTO payments (id, user_id, amount, description) VALUES (?, ?, ?, ?)", [id, userId, amount, description], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Payment submitted successfully', paymentId: id });
  });
});

// GET /client-payments/:repId - Get payments for clients of a representative
app.get('/client-payments/:repId', (req, res) => {
  const repId = req.params.repId;

  db.all(`SELECT p.*, u.name as client_name, u.email as client_email FROM payments p JOIN users u ON p.user_id = u.id WHERE u.representative_id = ?`, [repId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// GET /client-payments/:repId/:clientId - Get payments for a specific client
app.get('/client-payments/:repId/:clientId', (req, res) => {
  const repId = req.params.repId;
  const clientId = req.params.clientId;

  db.all(`SELECT p.* FROM payments p JOIN users u ON p.user_id = u.id WHERE u.representative_id = ? AND u.id = ?`, [repId, clientId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST /contact - Send message to representative
app.post('/contact', (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  // For simplicity, just log the message (in real app, store in DB)
  console.log(`Message from user ${userId}: ${message}`);
  res.json({ message: 'Message sent successfully' });
});

// GET /my-clients - Get clients for a representative
app.get('/my-clients', (req, res) => {
  const repId = req.query.repId;

  if (!repId) {
    return res.status(400).json({ error: 'repId is required' });
  }

  db.all("SELECT id, name, email FROM users WHERE representative_id = ?", [repId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

// POST /add-client - Add a new client for a representative
app.post('/add-client', async (req, res) => {
  const { repId, name, email } = req.body;

  if (!repId || !name || !email) {
    return res.status(400).json({ error: 'repId, name, and email are required' });
  }

  try {
    // Check if rep exists and is representative
    db.get("SELECT id FROM users WHERE id = ? AND role = 'representative'", [repId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(400).json({ error: 'Invalid representative' });
      }

      // Check if client already exists
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (existing) {
          return res.status(409).json({ error: 'Client already exists' });
        }

        // Generate a default password
        const tempPassword = 'temp123';
        bcrypt.hash(tempPassword, SALT_ROUNDS, (err, passwordHash) => {
          if (err) {
            return res.status(500).json({ error: 'Password hash error' });
          }

          const id = uuidv4();
          db.run(
            'INSERT INTO users (id, email, name, passwordHash, role, representative_id) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, name, passwordHash, 'client', repId],
            function(err) {
              if (err) {
                return res.status(500).json({ error: 'Failed to add client' });
              }
              res.status(201).json({ id, name, email });
            }
          );
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /user/:id - Get user info
app.get('/user/:id', (req, res) => {
  const id = req.params.id;

  db.get("SELECT id, email, name, role, representative_id FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
