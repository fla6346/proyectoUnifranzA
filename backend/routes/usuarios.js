const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Import PostgreSQL pool
const authenticateToken = require('../middleware/auth'); // Import middleware

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
    }

    const token = jwt.sign(
      { id: user.idusuario, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error de login:', error);
    res.status(500).json({ message: 'Error del servidor durante el login' });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT idusuario, nombre, username, habilitado FROM usuarios WHERE idusuario = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Register
router.post('/register', async (req, res) => {
  const { username, password, nombre, habilitado } = req.body;

  try {
    const userCheck = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO usuarios (username, password, nombre, habilitado) VALUES ($1, $2, $3, $4) RETURNING idusuario, username, nombre, habilitado',
      [username, hashedPassword, nombre, habilitado || '1']
    );

    const newUser = result.rows[0];
    const token = jwt.sign(
      { id: newUser.idusuario, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Error de registro:', error);
    res.status(500).json({ message: 'Error del servidor durante el registro' });
  }
});

// Get all users (for UsuariosScreen)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT idusuario, nombre, username, habilitado FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;