const mongoose = require('mongoose');

// Updated Building Schema with Category reference
const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // CategoryId: { // Category Reference
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'BuildingCategory',
  //   required: true  // Set to false if you want to make this optional
  // }
}, {
  timestamps: true
});

const Building = mongoose.model('Building', buildingSchema);
module.exports = Building;
