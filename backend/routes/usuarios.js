import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
       console.log('JWT verification error:', err.message);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Verified user:', user);
    req.user = user;
    next();
  });
};

// Get users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT idusuario, "userName" FROM usuario');
    console.log('Users fetched:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in GET /api/users:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;