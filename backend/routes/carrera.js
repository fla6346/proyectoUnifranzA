import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


// Create an activity
router.post('/createCarrera', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO carrera (titulo, horaInicio, horaFinalizacion) VALUES ($1, $2, $3) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//Read
router.get('/carrera', async (req, res) => {
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
router.post('/delete', async (req, res) => {
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

export default router;