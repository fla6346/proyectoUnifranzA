import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const pool = new Pool({
  user: process.env.PG_USER || 'postgres',
  host: process.env.PG_HOST || 'localhost',
  database: process.env.PG_DATABASE || 'bddgestion_eventoUFT',
  password: process.env.PG_PASSWORD || '1236346',
  port: process.env.PG_PORT || 5432,
});

// Test the connection
pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

export default pool;