import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import pool from '../config/db.js';


// Create an activity
router.post('/CreateInscripcion', async (req, res) => {
  try {
    const result = await pool.query(
      'INSERT INTO inscripcion (titulo, horaInicio, horaFinalizacion) VALUES ($1, $2, $3) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
//Read
router.get('/inscripcion', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inscripion');
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
      'UPDATE inscripcion (habilitado) VALUES (0) RETURNING *',
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;