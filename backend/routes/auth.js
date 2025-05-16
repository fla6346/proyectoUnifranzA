const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db').default;

// Login
router.post('/login', async (req, res) => {
  const {userName,contrasenia,habilitado,nombre,apellidoPat,apellidoMat,email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE userName=$1 AND habilitado=0 AND nombre=$2 AND apellidoPat=$3 AND apellidoMat=$4 email = $5', [userName,habilitado,nombre,apellidoPat,apellidoMat,email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(contrasenia, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // For simplicity, return user ID (in production, use JWT)
    res.json({ userId: user.id, message: 'Login successful' });
  } catch (err) {
    console.error('Error in POST /api/auth/login:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;