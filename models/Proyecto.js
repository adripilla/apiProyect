const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  miembros: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Miembro'
  }]
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);
