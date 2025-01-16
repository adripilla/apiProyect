const express = require('express');
const bodyParser = require('body-parser');
const Proyecto = require('../models/Proyecto');
const Miembro = require('../models/Miembro'); // Asegúrate de importar el modelo de Miembro
const router = express.Router();

// Middleware para parsear JSON
router.use(bodyParser.json());

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

// Obtener proyectos con manejo de proyectos sin miembros
router.get('/', async (req, res) => {
  try {
    // Obtener todos los proyectos sin hacer populate aún
    const proyectos = await Proyecto.find();

    // Verificar si la lista de proyectos está vacía
    if (proyectos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron proyectos' });
    }

    // Realizar populate solo si el proyecto tiene miembros
    for (let proyecto of proyectos) {
      if (proyecto.miembros && proyecto.miembros.length > 0) {
        // Usar populate directamente
        await proyecto.populate('miembros'); // Sin el uso de execPopulate
      } else {
        proyecto.miembros = []; // Asegurarse de que 'miembros' esté vacío si no hay miembros
      }
    }

    // Enviar los proyectos con o sin miembros
    res.json(proyectos);
  } catch (err) {
    console.error("Error al obtener proyectos:", err);
    res.status(400).json({ error: 'Error al obtener proyectos' });
  }
});


router.put('/:id/miembros', async (req, res) => {
  const { id } = req.params;
  const { miembros } = req.body; // Miembros es un array de IDs de miembros

  try {
    // Buscar el proyecto por ID
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Buscar los miembros por sus IDs
    const miembrosEncontrados = await Miembro.find({ '_id': { $in: miembros } });

    // Asegúrate de que todos los miembros estén en la base de datos
    if (miembrosEncontrados.length !== miembros.length) {
      return res.status(404).json({ error: 'Algunos miembros no fueron encontrados en la base de datos' });
    }

    // Agregar los miembros al proyecto (sin duplicados)
    proyecto.miembros = [...new Set([...proyecto.miembros, ...miembros])];

    await proyecto.save();
    res.json(proyecto);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar miembros' });
  }
});

module.exports = router;
