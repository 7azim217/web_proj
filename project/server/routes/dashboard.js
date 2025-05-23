import express from 'express';
import { auth } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Count total projects
    const [[{ projectCount }]] = await connection.query(`
      SELECT COUNT(*) AS projectCount FROM projects
    `);

    // Count students only
    const [[{ studentCount }]] = await connection.query(`
      SELECT COUNT(*) AS studentCount FROM users WHERE role = 'student'
    `);

    // Count total tasks
    const [[{ taskCount }]] = await connection.query(`
      SELECT COUNT(*) AS taskCount FROM tasks
    `);

    // Count finished projects (progress = 100)
    const [[{ finishedCount }]] = await connection.query(`
      SELECT COUNT(*) AS finishedCount FROM projects WHERE progress = 100
    `);

    connection.release();

    res.json({
      projectCount,
      studentCount,
      taskCount,
      finishedCount
    });
  } catch (err) {
    console.error('Dashboard API error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
