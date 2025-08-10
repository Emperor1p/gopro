const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? 'https://gopro-2.onrender.com' : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://gopro-2.onrender.com' : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
// Serve React production build
app.use(express.static(path.join(__dirname, '../build')));

// Database setup (use Render Disk path)
const dbPath = process.env.NODE_ENV === 'production' ? '/opt/render/project/src/database/database.sqlite' : './database.sqlite';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS recordings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      filename TEXT NOT NULL,
      duration INTEGER,
      size INTEGER,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS camera_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      mode TEXT DEFAULT 'video',
      resolution TEXT DEFAULT '1080p',
      fps INTEGER DEFAULT 30,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)`,
      ['Admin User', 'admin@gopro.com', defaultPassword]);
  });
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.NODE_ENV === 'production' ? '/opt/render/project/src/uploads/recordings' : 'uploads/recordings';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalName));
  }
});

const upload = multer({ storage });

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword], function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error creating user' });
          }

          const token = jwt.sign(
            { id: this.lastID, email, name },
            JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: this.lastID, name, email }
          });
        });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Camera control routes
app.post('/api/camera/connect', authenticateToken, (req, res) => {
  setTimeout(() => {
    io.emit('camera_status', {
      connected: true,
      battery: 85,
      storage: 45,
      mode: 'video',
      resolution: '1080p',
      fps: 30
    });
    res.json({ message: 'Camera connected successfully' });
  }, 1000);
});

app.post('/api/camera/disconnect', authenticateToken, (req, res) => {
  io.emit('camera_status', { connected: false });
  res.json({ message: 'Camera disconnected' });
});

app.post('/api/camera/record/start', authenticateToken, (req, res) => {
  const recordingId = Date.now();
  io.emit('recording_started', {
    id: recordingId,
    title: `Recording ${new Date().toLocaleString()}`,
    status: 'recording',
    createdAt: new Date().toISOString()
  });
  res.json({ message: 'Recording started', recordingId });
});

app.post('/api/camera/record/stop', authenticateToken, (req, res) => {
  io.emit('recording_stopped', Date.now());
  res.json({ message: 'Recording stopped' });
});

app.post('/api/camera/stream/start', authenticateToken, (req, res) => {
  const streamUrl = process.env.NODE_ENV === 'production' ? 'https://gopro-2.onrender.com/stream' : 'http://localhost:5000/stream';
  io.emit('stream_url', streamUrl);
  res.json({ message: 'Streaming started', streamUrl });
});

app.post('/api/camera/stream/stop', authenticateToken, (req, res) => {
  io.emit('stream_url', null);
  res.json({ message: 'Streaming stopped' });
});

app.put('/api/camera/settings', authenticateToken, (req, res) => {
  const { mode, resolution, fps } = req.body;
  io.emit('camera_status', { mode, resolution, fps });
  res.json({ message: 'Settings updated' });
});

// Recordings routes
app.get('/api/recordings', authenticateToken, (req, res) => {
  db.all('SELECT * FROM recordings WHERE user_id = ? ORDER BY created_at DESC', 
    [req.user.id], (err, recordings) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ recordings });
    });
});

app.post('/api/recordings', authenticateToken, upload.single('video'), (req, res) => {
  const { title, duration, size } = req.body;
  const filename = req.file ? req.file.filename : '';

  db.run('INSERT INTO recordings (title, filename, duration, size, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, filename, duration, size, req.user.id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error saving recording' });
      }
      res.status(201).json({ message: 'Recording saved', id: this.lastID });
    });
});

app.delete('/api/recordings/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM recordings WHERE id = ? AND user_id = ?', 
    [id, req.user.id], function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Recording not found' });
      }
      res.json({ message: 'Recording deleted' });
    });
});

// Portfolio enhancement: GitHub stats route
app.get('/api/github-stats', async (req, res) => {
  try {
    const response = await fetch('https://api.github.com/repos/Emperor1p/gopro');
    const data = await response.json();
    res.json({
      stars: data.stargazers_count || 0,
      forks: data.forks_count || 0,
      lastUpdated: data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'N/A'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching GitHub stats' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('camera_status_update', (status) => {
    socket.broadcast.emit('camera_status', status);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});

module.exports = app;