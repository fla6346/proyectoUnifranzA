import  express from 'express';
const router = express.Router();
import pool from '../config/db.js';
import multer from 'multer';
//import db from '../config/db.js';
// Multer configuration for image uploads


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif)'));
    }
  }
});
app.get('/api/events', (req, res) => {
  try {
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
});

// GET - Obtener un evento específico
app.get('/api/events/:id', (req, res) => {
  try {
    const event = events.find(e => e.id === req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el evento',
      error: error.message
    });
  }
});

// POST - Crear nuevo evento
app.post('/api/events', upload.single('image'), (req, res) => {
  try {
    const { title, description, date, location, organizer } = req.body;

    // Validaciones
    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios: title, description, date, location'
      });
    }

    const newEvent = {
      id: uuidv4(),
      title,
      description,
      date: new Date(date),
      location,
      organizer: organizer || 'Organizador anónimo',
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    events.push(newEvent);

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el evento',
      error: error.message
    });
  }
});

// PUT - Actualizar evento
app.put('/api/events/:id', upload.single('image'), (req, res) => {
  try {
    const eventId = req.params.id;
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const { title, description, date, location, organizer } = req.body;
    const currentEvent = events[eventIndex];

    // Actualizar campos
    events[eventIndex] = {
      ...currentEvent,
      title: title || currentEvent.title,
      description: description || currentEvent.description,
      date: date ? new Date(date) : currentEvent.date,
      location: location || currentEvent.location,
      organizer: organizer || currentEvent.organizer,
      image: req.file ? `/uploads/${req.file.filename}` : currentEvent.image,
      updatedAt: new Date()
    };

    // Eliminar imagen anterior si se subió una nueva
    if (req.file && currentEvent.image) {
      const oldImagePath = path.join(__dirname, currentEvent.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      data: events[eventIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el evento',
      error: error.message
    });
  }
});

// DELETE - Eliminar evento
app.delete('/api/events/:id', (req, res) => {
  try {
    const eventId = req.params.id;
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const eventToDelete = events[eventIndex];

    // Eliminar imagen asociada
    if (eventToDelete.image) {
      const imagePath = path.join(__dirname, eventToDelete.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    events.splice(eventIndex, 1);

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el evento',
      error: error.message
    });
  }
});

// Manejo de errores de multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: error.message
  });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date()
  });
});

export default router;