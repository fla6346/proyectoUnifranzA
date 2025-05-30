// src/controllers/eventoController.js
import pool from '../config/db.js'; // O tu modelo Sequelize/TypeORM
//
// Obtener todos los eventos
export async function getEventos(req, res) {
  try {
    const result = await pool('SELECT * FROM public.evento ORDER BY fecha_evento ASC, hora_evento ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
}

// Obtener un evento por ID
export async function getEventoById(req, res) {
  const { id } = req.params;
  try {
    const result = await pool('SELECT * FROM public.evento WHERE idevento = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el evento' });
  }
}

// Crear un nuevo evento
export async function createEvento(req, res) {
  const {
    nombre_evento,
    lugar_evento,
    fecha_evento,
    hora_evento,
    id_tipo_evento,
    id_servicio,
    id_actividad,
    id_ambiente,
    id_objetivo,
  } = req.body;
const url_imagen = req.file ? `/uploads/${req.file.filename}` : null; 
  try {
    const result = await pool(
      `INSERT INTO public.evento (
        nombreevento,
        lugarevento,
        fechaevento,
        horaevento,
        idtipoevento,
        idservicio,
        idactividad,
        idambiente,
        idobjetivo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        nombre_evento,
        lugar_evento,
        fecha_evento,
        hora_evento,
        id_tipo_evento,
        id_servicio,
        id_actividad,
        id_ambiente,
        id_objetivo,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el evento' });
  }
}

// Actualizar un evento
export async function updateEvento(req, res) {
  const { id } = req.params;
  const {
    nombre_evento,
    lugar_evento,
    fecha_evento,
    hora_evento,
    id_tipo_evento,
    id_servicio,
    id_actividad,
    id_ambiente,
    id_objetivo,
  } = req.body;

  try {
    const result = await pool(
      `UPDATE public.evento SET
        nombreevento = $1,
        lugarevento = $2,
        fechaevento = $3,
        horaevento = $4,
        idtipoevento = $5,
        idservicio = $6,
        idactividad = $7,
        idambiente = $8,
        idobjetivo = $9
      WHERE idevento = $10 RETURNING *`,
      [
        nombre_evento,
        lugar_evento,
        fecha_evento,
        hora_evento,
        id_tipo_evento,
        id_servicio,
        id_actividad,
        id_ambiente,
        id_objetivo,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado para actualizar' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el evento' });
  }
}

// Eliminar un evento
export async function deleteEvento(req, res) {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM public.evento WHERE idevento = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado para eliminar' });
    }
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el evento' });
  }
}

export default{getEventos,getEventoById,createEvento,updateEvento,deleteEvento};