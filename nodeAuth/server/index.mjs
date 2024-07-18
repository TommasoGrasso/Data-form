import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const dbPromise = open({
  filename: './server/database.sqlite',
  driver: sqlite3.Database,
});

dbPromise.then(async (db) => {
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    fullname TEXT NOT NULL
  )`);
});

// Route per aggiornare i dati dell'utente
app.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, email, fullname } = req.body;
  
  if (!username || !password || !email || !fullname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await dbPromise;
    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.run('UPDATE users SET username = ?, password = ?, email = ?, fullname = ? WHERE id = ?', [
      username,
      password,
      email,
      fullname,
      id,
    ]);
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Route per ottenere i dati dell'utente per il profilo
app.get('/profile/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const db = await dbPromise;
    const user = await db.get('SELECT id, username, email, fullname FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password, email, fullname } = req.body;
  if (!username || !password || !email || !fullname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = await dbPromise;
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    await db.run('INSERT INTO users (username, password, email, fullname) VALUES (?, ?, ?, ?)', [
      username,
      password,
      email,
      fullname,
    ]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }

  try {
    const db = await dbPromise;
    const user = await db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
