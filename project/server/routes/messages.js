import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/auth.js';
import pool from '../config/db.js';

const router = express.Router();

// Get conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [conversations] = await connection.query(`
      SELECT 
        c.id,
        GROUP_CONCAT(DISTINCT u.username) as participants,
        m.content as last_message,
        m.created_at as last_message_timestamp,
        COUNT(CASE WHEN m.is_read = 0 AND m.sender_id != ? THEN 1 END) as unread_count
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN messages m ON c.id = m.conversation_id
      WHERE c.id IN (
        SELECT conversation_id 
        FROM conversation_participants 
        WHERE user_id = ?
      )
      GROUP BY c.id
      ORDER BY m.created_at DESC
    `, [req.user.id, req.user.id]);

    connection.release();

    const formattedConversations = conversations.map(conv => ({
      ...conv,
      participants: conv.participants.split(',')
    }));

    res.json(formattedConversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a conversation
router.get('/conversations/:id', auth, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [messages] = await connection.query(`
      SELECT m.*, u.username as sender_username
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `, [req.params.id]);

    connection.release();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/conversations/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const connection = await pool.getConnection();
    const messageId = uuidv4();

    await connection.query(
      'INSERT INTO messages (id, conversation_id, sender_id, content) VALUES (?, ?, ?, ?)',
      [messageId, req.params.id, req.user.id, content]
    );

    connection.release();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;