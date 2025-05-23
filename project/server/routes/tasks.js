import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Get tasks assigned to the user (or all if admin)
router.get('/', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [tasks] = await connection.query(
      'SELECT t.*, u.username AS assignedTo FROM tasks t JOIN users u ON t.assigned_to = u.id WHERE t.assigned_to = ? OR ? = "admin"',
      [req.user.id, req.user.role]
    );
    connection.release();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;
    const connection = await pool.getConnection();
    const taskId = uuidv4();

    // 🔍 Get user ID from username
    const [[userResult]] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      [assignedTo]
    );

    if (!userResult) {
      connection.release();
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const assignedUserId = userResult.id;

    await connection.query(
      'INSERT INTO tasks (id, title, description, assigned_to, project_id, due_date) VALUES (?, ?, ?, ?, ?, ?)',
      [taskId, title, description, assignedUserId, projectId, dueDate]
    );

    connection.release();
    res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate, status } = req.body;
    const connection = await pool.getConnection();

    // 🔍 Get user ID from username
    const [[userResult]] = await connection.query(
      'SELECT id FROM users WHERE username = ?',
      [assignedTo]
    );

    if (!userResult) {
      connection.release();
      return res.status(400).json({ message: 'Assigned user not found' });
    }

    const assignedUserId = userResult.id;

    await connection.query(
      `UPDATE tasks SET title = ?, description = ?, assigned_to = ?, project_id = ?, due_date = ?, status = ?
       WHERE id = ?`,
      [title, description, assignedUserId, projectId, dueDate, status, req.params.id]
    );

    connection.release();
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE tasks SET status = ? WHERE id = ? AND (assigned_to = ? OR ? = "admin")',
      [status, req.params.id, req.user.id, req.user.role]
    );

    connection.release();
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    connection.release();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
