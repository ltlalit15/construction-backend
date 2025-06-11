const mongoose = require("mongoose");

const formResponseSchema = new mongoose.Schema({
  projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},
  formId: {type: mongoose.Schema.Types.ObjectId, ref: 'FormTemplate'},
  formName: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to User
 responses: { type: Map, required: true},
  image: [String], // Array of image URLs
}, { timestamps: true });


module.exports = mongoose.model("FormResponse", formResponseSchema);
