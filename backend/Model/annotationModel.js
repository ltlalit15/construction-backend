// models/Annotation.js
const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
   
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
    
  },
}, {
  timestamps: true // createdAt, updatedAt
});


const Annotation = mongoose.model("Annotation", annotationSchema);
module.exports = Annotation;