import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


// Create an activity
router.post('/CreateAlert', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO alerta (titulo, horaInicio, horaFinalizacion) VALUES ($1, $2, $3) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//Read
router.get('/alert', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alert');
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
      'UPDATE alert (habilitado) VALUES (0) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;