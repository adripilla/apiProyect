const mongoose = require('mongoose');

const MiembroSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  habilidades: [{
    type: String
  }]
});

module.exports = mongoose.model('Miembro', MiembroSchema);
