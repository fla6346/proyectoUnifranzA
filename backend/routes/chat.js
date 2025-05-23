import express from 'express';
//import axios from 'axios';

const router = express.Router();

// Middleware para analizar el cuerpo de las solicitudes JSON
router.use(express.json());

// Ruta para enviar un mensaje a Rasa
router.post('/', async (req, res) => {
    const userMessage = req.body.message; // Asegúrate de que el cuerpo de la solicitud contenga un mensaje
    if (!userMessage) {
        return res.status(400).send('El mensaje es requerido');
    }

    try {
        const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
            sender: 'user',
            message: userMessage
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error en la comunicación con Rasa:', error);
        res.status(500).send('Error en la comunicación con Rasa');
    }
});

export default router;
