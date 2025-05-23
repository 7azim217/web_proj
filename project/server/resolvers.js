import { v4 as uuidv4 } from 'uuid';
import pool from './config/db.js';

const resolvers = {
  Query: {
    users: async (_, __, { user }) => {
      const [rows] = await pool.query(
        `SELECT id, username, role FROM users WHERE id != ?`,
        [user.id]
      );
      return rows;
    },

    projects: async () => {
      const [rows] = await pool.query(`SELECT * FROM projects`);
      return rows;
    },

    tasks: async () => {
      const [rows] = await pool.query(`SELECT * FROM tasks`);
      return rows;
    },

    myChats: async (_, __, { user }) => {
      const [chatRows] = await pool.query(`
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        WHERE cp.user_id = ?
      `, [user.id]);

      const chats = await Promise.all(chatRows.map(async (row) => {
        const [participants] = await pool.query(`
          SELECT u.id, u.username, u.role
          FROM conversation_participants cp
          JOIN users u ON cp.user_id = u.id
          WHERE cp.conversation_id = ?
        `, [row.id]);

        const [messages] = await pool.query(`
          SELECT m.*, u.username FROM messages m
          JOIN users u ON u.id = m.sender_id
          WHERE m.conversation_id = ?
          ORDER BY m.created_at ASC
        `, [row.id]);

        return {
          id: row.id,
          participants,
          messages: messages.map(m => ({
            id: m.id,
            content: m.content,
            timestamp: m.created_at,
            sender: {
              id: m.sender_id,
              username: m.username
            }
          }))
        };
      }));

      return chats;
    },

    chatMessages: async (_, { chatId }, { user }) => {
      const [rows] = await pool.query(`
        SELECT m.*, u.username FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
      `, [chatId]);

      return rows.map(row => ({
        id: row.id,
        content: row.content,
        timestamp: row.created_at,
        sender: {
          id: row.sender_id,
          username: row.username
        }
      }));
    }
  },

  Mutation: {
    // === Project ===
    addProject: async (_, args, { user }) => {
      if (user.role !== 'admin') throw new Error('Only admin can add projects');

      const id = uuidv4();
      await pool.query(
        `INSERT INTO projects (id, title, description, category, progress, start_date, end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, args.title, args.description, args.category, args.progress || 0, args.startDate, args.endDate]
      );

      return { id, ...args, progress: args.progress || 0 };
    },

    deleteProject: async (_, { id }, { user }) => {
      if (user.role !== 'admin') throw new Error('Only admin can delete projects');
      await pool.query(`DELETE FROM projects WHERE id = ?`, [id]);
      return true;
    },

    // === Task ===
    addTask: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      const id = uuidv4();

      await pool.query(
        `INSERT INTO tasks (id, title, description, status, assigned_to, project_id, due_date)
         VALUES (?, ?, ?, 'pending', ?, ?, ?)`,
        [id, args.title, args.description, args.assignedTo, args.projectId, args.dueDate]
      );

      return {
        id,
        ...args,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
    },

    updateTaskStatus: async (_, { id, status }, { user }) => {
      await pool.query(`UPDATE tasks SET status = ? WHERE id = ?`, [status, id]);
      const [rows] = await pool.query(`SELECT * FROM tasks WHERE id = ?`, [id]);
      return rows[0];
    },

    // === Chat ===
    startChat: async (_, { participantId }, { user }) => {
      const [existing] = await pool.query(`
        SELECT c.id FROM conversations c
        JOIN conversation_participants cp1 ON c.id = cp1.conversation_id
        JOIN conversation_participants cp2 ON c.id = cp2.conversation_id
        WHERE cp1.user_id = ? AND cp2.user_id = ?
      `, [user.id, participantId]);

      let chatId;
      if (existing.length > 0) {
        chatId = existing[0].id;
      } else {
        chatId = uuidv4();
        await pool.query(`INSERT INTO conversations (id) VALUES (?)`, [chatId]);
        await pool.query(`
          INSERT INTO conversation_participants (conversation_id, user_id)
          VALUES (?, ?), (?, ?)`,
          [chatId, user.id, chatId, participantId]
        );
      }

      const [participants] = await pool.query(`
        SELECT u.id, u.username, u.role FROM conversation_participants cp
        JOIN users u ON u.id = cp.user_id
        WHERE cp.conversation_id = ?
      `, [chatId]);

      return { id: chatId, participants, messages: [] };
    },

    sendMessage: async (_, { chatId, content }, { user }) => {
      const messageId = uuidv4();

      await pool.query(
        `INSERT INTO messages (id, conversation_id, sender_id, content)
         VALUES (?, ?, ?, ?)`,
        [messageId, chatId, user.id, content]
      );

      const [[sender]] = await pool.query(
        `SELECT username FROM users WHERE id = ?`,
        [user.id]
      );

      return {
        id: messageId,
        content,
        timestamp: new Date().toISOString(),
        sender: {
          id: user.id,
          username: sender.username
        }
      };
    }
  }
};

export default resolvers;
