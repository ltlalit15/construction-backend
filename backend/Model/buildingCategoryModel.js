const mongoose = require('mongoose');

const buildingCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
    
  },

  subcategories: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      name: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  
}, {
  timestamps: true
});


const BuildingCategory = mongoose.model('BuildingCategory', buildingCategorySchema);
module.exports = BuildingCategory;



