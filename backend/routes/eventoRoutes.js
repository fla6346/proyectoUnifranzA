// D:\ProyectA\backend\routes\eventoRoutes.js

import express from 'express'; // <-- CAMBIAR: de require a import
import multer from 'multer';   // <-- CAMBIAR: de require a import
import path from 'path';     // <-- CAMBIAR: de require a import
import eventoController from '../controllers/eventoController.js'; // Esta ya estaba bien si la corregiste antes

const router = express.Router();

// --- Configuración de Multer para la subida de imágenes ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegúrate de que esta ruta exista y sea accesible para Node.js
    // path.join(__dirname, '..', 'uploads') apunta a D:\ProyectA\backend\uploads
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único para evitar colisiones
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// --- Fin de la configuración de Multer ---


// Rutas de eventos (utilizando eventoController)
router.get('/', eventoController.getEventos);
router.get('/:id', eventoController.getEventoById);
// Para la creación, usa el middleware 'upload.single('imagen')' para manejar la imagen
router.post('/', upload.single('imagen'), eventoController.createEvento);
// Para la actualización, también usa el middleware de Multer
router.put('/:id', upload.single('imagen'), eventoController.updateEvento);
router.delete('/:id', eventoController.deleteEvento);

export default router; // <-- CAMBIAR: de module.exports a export default