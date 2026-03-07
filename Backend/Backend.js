const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the frontend directory (one level up from backend)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Initialize SQLite database
const db = new sqlite3.Database('authchain.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    // Create table for storing all events
    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        user_address TEXT NOT NULL,
        username TEXT,
        timestamp TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  }
});

// API endpoint to log registration
app.post('/api/register', (req, res) => {
  const { userAddress, username } = req.body;
  const timestamp = new Date().toISOString();

  // Log to terminal
  console.log('--- New Registration Event ---');
  console.log(`User Address: ${userAddress}`);
  console.log(`Username: ${username}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('-----------------------------');

  // Log to file
  const logEntry = `[${timestamp}] [REGISTER] User Address: ${userAddress}, Username: ${username}\n`;
  fs.appendFile('authchain_logs.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err.message);
    }
  });

  // Store in database
  db.run(
    'INSERT INTO events (event_type, user_address, username, timestamp) VALUES (?, ?, ?, ?)',
    ['register', userAddress, username, timestamp],
    (err) => {
      if (err) {
        console.error('Error logging registration to database:', err.message);
        res.status(500).json({ error: 'Failed to log registration' });
      } else {
        res.json({ message: 'Registration logged successfully' });
      }
    }
  );
});

// API endpoint to log login
app.post('/api/login', (req, res) => {
  const { userAddress } = req.body;
  const timestamp = new Date().toISOString();

  // Log to terminal
  console.log('--- New Login Event ---');
  console.log(`User Address: ${userAddress}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('-----------------------');

  // Log to file
  const logEntry = `[${timestamp}] [LOGIN] User Address: ${userAddress}\n`;
  fs.appendFile('authchain_logs.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err.message);
    }
  });

  // Store in database
  db.run(
    'INSERT INTO events (event_type, user_address, username, timestamp) VALUES (?, ?, ?, ?)',
    ['login', userAddress, null, timestamp],
    (err) => {
      if (err) {
        console.error('Error logging login to database:', err.message);
        res.status(500).json({ error: 'Failed to log login' });
      } else {
        res.json({ message: 'Login logged successfully' });
      }
    }
  );
});

// API endpoint to log password reset
app.post('/api/resetPassword', (req, res) => {
  const { userAddress } = req.body;
  const timestamp = new Date().toISOString();

  // Log to terminal
  console.log('--- New Password Reset Event ---');
  console.log(`User Address: ${userAddress}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('--------------------------------');

  // Log to file
  const logEntry = `[${timestamp}] [RESET_PASSWORD] User Address: ${userAddress}\n`;
  fs.appendFile('authchain_logs.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err.message);
    }
  });

  // Store in database
  db.run(
    'INSERT INTO events (event_type, user_address, username, timestamp) VALUES (?, ?, ?, ?)',
    ['resetPassword', userAddress, null, timestamp],
    (err) => {
      if (err) {
        console.error('Error logging password reset to database:', err.message);
        res.status(500).json({ error: 'Failed to log password reset' });
      } else {
        res.json({ message: 'Password reset logged successfully' });
      }
    }
  );
});

// API endpoint to log account deactivation
app.post('/api/deactivate', (req, res) => {
  const { userAddress } = req.body;
  const timestamp = new Date().toISOString();

  // Log to terminal
  console.log('--- New Deactivation Event ---');
  console.log(`User Address: ${userAddress}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log('-----------------------------');

  // Log to file
  const logEntry = `[${timestamp}] [DEACTIVATE] User Address: ${userAddress}\n`;
  fs.appendFile('authchain_logs.txt', logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err.message);
    }
  });

  // Store in database
  db.run(
    'INSERT INTO events (event_type, user_address, username, timestamp) VALUES (?, ?, ?, ?)',
    ['deactivate', userAddress, null, timestamp],
    (err) => {
      if (err) {
        console.error('Error logging deactivation to database:', err.message);
        res.status(500).json({ error: 'Failed to log deactivation' });
      } else {
        res.json({ message: 'Deactivation logged successfully' });
      }
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});