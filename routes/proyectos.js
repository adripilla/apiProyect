const express = require('express');
const Proyecto = require('../models/Proyecto');
const router = express.Router();

// Crear proyecto
router.post('/', async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const nuevoProyecto = new Proyecto({ nombre, descripcion });
    await nuevoProyecto.save();
    res.status(201).json(nuevoProyecto);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear proyecto' });
  }
});

// Obtener proyectos
router.get('/', async (req, res) => {
  try {
    const proyectos = await Proyecto.find();
    res.json(proyectos);
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener proyectos' });
  }
});

module.exports = router;
