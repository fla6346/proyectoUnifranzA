import express from 'express';
import cors from 'cors';
const app = express();
//const multer = require('multer');
import path from 'path';
import eventRoutes from  './routes/events.js';
import authRoutes from './routes/auth.js';
import usuarios from './routes/usuarios.js';
import chatRoutes from './routes/chat.js';
//import auth from './routes/auth.js';
//import db from './config/db.js';
import pool from './config/db.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);


// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/users',usuarios);
app.use('/api/message',chatRoutes);

//app.use('')
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Server Error'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server accessible at http://localhost:${PORT}`);

});