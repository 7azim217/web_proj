import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ✅ GET /api/users/students – return all student users
router.get('/students', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query(
      'SELECT id, username FROM users WHERE role = "student"'
    );
    connection.release();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/users/signup – register a user
router.post('/signup', async (req, res) => {
  const { username, password, role, universityId } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const connection = await pool.getConnection();

    // Check for duplicate username
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await connection.query(
      'INSERT INTO users (id, username, password, role, university_id) VALUES (?, ?, ?, ?, ?)',
      [userId, username, hashedPassword, role, universityId || null]
    );

    const token = jwt.sign({ id: userId, username, role }, JWT_SECRET, {
      expiresIn: '7d'
    });

    connection.release();
    res.status(201).json({
      message: 'User created successfully',
      user: { id: userId, username, role, universityId },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ POST /api/users/login – authenticate user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        universityId: user.university_id
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
