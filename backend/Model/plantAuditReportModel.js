const mongoose = require("mongoose");

const checklistItemSchema = new mongoose.Schema({
  itemCheck: { type: String, required: true },
  status: { type: String, required: true },
  comments: { type: String },
  
});

const plantAuditReportSchema = new mongoose.Schema({
  plantType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlantMachineryEquipment",
      required: true
    },
  preStartDate: { type: Date, required: true },
  machineId: { type: String, required: true },
  checkedBy: { type: String, required: true },
  odometerReading: { type: String },
  nextServiceDue: { type: Date },
  checklist: [checklistItemSchema],
   status: {type: String},
  image: [],  // Array of image URLs saved under "image"
  operatorSignature: { type: String }, // optional signature data or URL
 
}, { timestamps: true });


module.exports = mongoose.model("PlantAuditReport", plantAuditReportSchema);
