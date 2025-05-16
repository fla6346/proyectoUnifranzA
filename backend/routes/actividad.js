const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db').default;


// Create an activity
router.post('/api/CreateActivity', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO actividad (titulo, horaInicio, horaFinalizacion) VALUES ($1, $2, $3) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//Read
router.get('/api/activity', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM actividad');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//update activity********


//delete 
router.post('/api/delete', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE events (habilitado) VALUES (0) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;