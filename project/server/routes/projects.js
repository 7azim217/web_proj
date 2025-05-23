import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth, adminAuth } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [projects] = await connection.query(`
      SELECT p.*, GROUP_CONCAT(ps.user_id) as student_ids
      FROM projects p
      LEFT JOIN project_students ps ON p.id = ps.project_id
      GROUP BY p.id
    `);
    connection.release();

    const formatted = projects.map(p => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      progress: p.progress,
      startDate: p.start_date,
      endDate: p.end_date,
      students: p.student_ids ? p.student_ids.split(',') : []
    }));

    res.json(formatted);
  } catch (error) {
    console.error('GET /api/projects error:', error.message);
    res.status(500).json({ message: error.message });
  }
});
// DELETE project
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE project
router.put('/:id', auth, async (req, res) => {
  const { title, description, category, progress, start_date, end_date } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.query(
      `UPDATE projects 
       SET title = ?, description = ?, category = ?, progress = ?, start_date = ?, end_date = ?
       WHERE id = ?`,
      [title, description, category, progress, start_date, end_date, req.params.id]
    );
    connection.release();
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a project (admin only)
router.post('/', [auth, adminAuth], async (req, res) => {
  const { title, description, category, startDate, endDate, students } = req.body;
  const connection = await pool.getConnection();
  const projectId = uuidv4();

  try {
    await connection.beginTransaction();

    // Insert new project
    await connection.query(
      'INSERT INTO projects (id, title, description, category, start_date, end_date, progress) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [projectId, title, description, category, startDate, endDate, 0]
    );

    // Fetch user IDs from usernames
    const [rows] = await connection.query(
      'SELECT id, username FROM users WHERE username IN (?)',
      [students]
    );

    const foundUsernames = rows.map(u => u.username);
    const missing = students.filter(s => !foundUsernames.includes(s));
    if (missing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ message: `User(s) not found: ${missing.join(', ')}` });
    }

    const studentValues = rows.map(u => [projectId, u.id]);
    await connection.query(
      'INSERT INTO project_students (project_id, user_id) VALUES ?',
      [studentValues]
    );

    await connection.commit();
    res.status(201).json({ message: 'Project created successfully', projectId });
  } catch (error) {
    await connection.rollback();
    console.error('POST /api/projects error:', error.message);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;
