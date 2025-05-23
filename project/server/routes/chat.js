import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const chatMatrix = {}; // In-memory chat: { userId: [ { id, senderId, content, timestamp } ] }

// GET all chats (for current user)
router.get('/', auth, (req, res) => {
  const userId = req.user.id;
  const chats = Object.entries(chatMatrix)
    .filter(([uid]) => uid === userId || uid === 'admin')
    .map(([uid]) => ({
      id: uid,
      messages: chatMatrix[uid]
    }));
  res.json(chats);
});

// GET messages for a specific chat (user ↔ admin)
router.get('/:userId/messages', auth, (req, res) => {
  const { userId } = req.params;
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin && req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const messages = chatMatrix[userId] || [];
  res.json(messages);
});

// POST message to a user (admin or student)
router.post('/:userId', auth, (req, res) => {
  const { userId } = req.params;
  const { content } = req.body;

  if (!content) return res.status(400).json({ message: 'Content required' });

  const senderId = req.user.id;
  const message = {
    id: uuidv4(),
    senderId,
    senderUsername: req.user.username,
    content,
    timestamp: new Date().toISOString(),
  };

  if (!chatMatrix[userId]) {
    chatMatrix[userId] = [];
  }
  chatMatrix[userId].push(message);

  res.status(201).json({ message: 'Sent', data: message });
});

export default router;
