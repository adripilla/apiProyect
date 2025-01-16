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

// Obtener todos los miembros
router.get('/', async (req, res) => {
  try {
    const miembros = await Miembro.find();
    res.json(miembros);
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener miembros' });
  }
});

// Obtener un miembro por ID
router.get('/:id', async (req, res) => {
  try {
    const miembro = await Miembro.findById(req.params.id); // Buscar miembro por ID
    if (!miembro) {
      return res.status(404).json({ error: 'Miembro no encontrado' });
    }
    res.json(miembro); // Retornar el miembro encontrado
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener miembro' });
  }
});

module.exports = router;
