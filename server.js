const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const proyectosRouter = require('./routes/proyectos');
const miembrosRouter = require('./routes/miembros');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parsear JSON
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Usar rutas
app.use('/api/proyectos', proyectosRouter);
app.use('/api/miembros', miembrosRouter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
