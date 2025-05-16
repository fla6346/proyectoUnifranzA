const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const userRoutes=require('./routes/usuarios')
const pool=require('./config/db').default
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/usuarios',userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));