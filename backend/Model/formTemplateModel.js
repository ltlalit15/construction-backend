// models/FormTemplate.js
const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
  label: { type: String, required: true },               
  name: { type: String, required: true },
  type: { type: String, required: true },
   createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  required: { type: Boolean },
  placeholder: { type: String },
  defaultValue: { type: mongoose.Schema.Types.Mixed },
  options: [
    {
      label: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  validation: {
    minLength: { type: Number },
    maxLength: { type: Number },
    pattern: { type: String },
    min: { type: Number },
    max: { type: Number },
  },
  order: { type: Number },
  visible: { type: Boolean },
  // ✅ New Fields
  optionSource: {
    type: String,
    enum: ['worker', 'equipment', 'department', 'custom'],
  },
  page: { type: String },
});

const FormTemplateSchema = new mongoose.Schema({
  projectId: {type: mongoose.Schema.Types.ObjectId, ref: 'Projects'},
  formName: { type: String, required: true },
  description: { type: String },
   type: {type: String},
  fields: [FieldSchema],
}, { timestamps: true });

module.exports = mongoose.model('FormTemplate', FormTemplateSchema);
