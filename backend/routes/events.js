import  express from 'express';
const router = express.Router();
import pool from '../config/db.js';
import multer from 'multer';
//import db from '../config/db.js';
// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM evento');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an event
router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, category, event_date } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      'INSERT INTO events (title, description, category, event_date, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, category, event_date, image_path]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;