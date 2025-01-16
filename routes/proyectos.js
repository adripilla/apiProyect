const express = require('express');
const Proyecto = require('../models/Proyecto');
const Miembro = require('../models/Miembro'); // Asegúrate de importar el modelo de Miembro
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
    const proyectos = await Proyecto.find().populate('miembros');
    res.json(proyectos);
  } catch (err) {
    res.status(400).json({ error: 'Error al obtener proyectos' });
  }
});

// Actualizar miembros de un proyecto (agregar)
router.put('/:id/miembros', async (req, res) => {
  const { id } = req.params;
  const { miembros } = req.body; // Miembros es un array de nombres de miembros
  
  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Buscar los miembros por su nombre (puedes cambiar esto si prefieres algo diferente)
    const miembrosEncontrados = await Miembro.find({ nombre: { $in: miembros } });

    // Asegúrate de que todos los miembros estén en la base de datos
    if (miembrosEncontrados.length !== miembros.length) {
      return res.status(404).json({ error: 'Algunos miembros no fueron encontrados en la base de datos' });
    }

    // Obtener los ObjectIds de los miembros encontrados
    const miembrosIds = miembrosEncontrados.map(miembro => miembro._id);

    // Agregar los miembros al proyecto (sin duplicados)
    proyecto.miembros = [...new Set([...proyecto.miembros, ...miembrosIds])];

    await proyecto.save();
    res.json(proyecto);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar miembros' });
  }
});

module.exports = router;
