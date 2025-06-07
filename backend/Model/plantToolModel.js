const mongoose = require("mongoose");

const plantToolSchema = new mongoose.Schema({
  toolId: { type: String, required: true, unique: true },
  toolName: { type: String, required: true },
  manufacturer: { type: String, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  purchaseDate: { type: Date, required: true },
  condition: {
    type: String,
    required: true
  },
  notes: { type: String },
  location: { type: String, required: true },
  status: {type: String},
}, { timestamps: true });


module.exports = mongoose.model("plantTool", plantToolSchema);
