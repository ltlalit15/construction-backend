const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
   
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the model from the schema
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
