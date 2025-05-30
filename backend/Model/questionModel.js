const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },        
  required: { type: Boolean }, 
  triggerPending: { type: Boolean },
  inputType: { type: String },
          
}, { timestamps: true }); 


module.exports = mongoose.model('Question', questionSchema);



