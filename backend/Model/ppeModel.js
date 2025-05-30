const mongoose = require("mongoose");

const ppeItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  standard: { type: String, required: true },
  mandatory: { type: Boolean }
});

const ppeTemplateSchema = new mongoose.Schema({
  taskName: { type: String, required: true },
  description: { type: String, required: true },
  requiredPPE: [ppeItemSchema],
  assignedTo: { type: String, required: true },
}, { timestamps: true });


module.exports = mongoose.model("ppe", ppeTemplateSchema);
