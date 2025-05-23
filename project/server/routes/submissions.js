import express from 'express';
import multer from 'multer';
import { auth } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db.js';

const router = express.Router();

// Setup file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Submit file for project/task
router.post('/:type/:id', auth, upload.single('file'), async (req, res) => {
  const { type, id } = req.params;
  const { file } = req;

  if (!['project', 'task'].includes(type)) {
    return res.status(400).json({ message: 'Invalid submission type' });
  }

  try {
    const submissionId = uuidv4();
    const connection = await pool.getConnection();

    await connection.query(
      'INSERT INTO submissions (id, user_id, type, item_id, file_path, submitted_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [submissionId, req.user.id, type, id, file.filename]
    );

    connection.release();
    res.status(201).json({ message: 'File submitted successfully' });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Submission failed' });
  }
});

export default router;
