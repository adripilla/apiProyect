const express = require('express');
const Miembro = require('../models/Miembro');
const router = express.Router();

// Crear miembro
router.post('/', async (req, res) => {
  const { nombre, habilidades } = req.body;
  try {
    const nuevoMiembro = new Miembro({ nombre, habilidades });
    await nuevoMiembro.save();
    res.status(201).json(nuevoMiembro);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear miembro' });
  }
});

// Obtener miembros
router.get('/', async (req, res) => {
  try {
    const miembros = await Miembro.find();
    res.json(miembros);
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener miembros' });
  }
});

module.exports = router;
