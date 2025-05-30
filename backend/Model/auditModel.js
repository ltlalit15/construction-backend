const mongoose = require('mongoose');


const equipmentSchema = new mongoose.Schema({
  equipment: { type: String, required: true },
  status: { type: String, required: true }, 
  lastTestingDate: { type: Date, required: true },
  nextTestingDue: { type: Date, required: true },
  comments: { type: String, required: false },
});

// Main Schema for Security Audit Report
const securityAuditReportSchema = new mongoose.Schema(
  {
    auditDate: { type: Date, required: true }, 
    auditedBy: { type: String, required: true }, 
    safetyManager: { type: String, required: true }, 
    location: { type: String, required: true }, 
    image: [], 
    equipmentAssessment: [equipmentSchema], 
    safetyManagerSignature: { type: String, required: false }, 
    status: { type: String }, 
    generalNotes: { type: String, required: false },
    criticalObservations: { type: String, required: false }, 
    followUpActions: { type: String, required: false }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model('SecurityAuditReport', securityAuditReportSchema);
