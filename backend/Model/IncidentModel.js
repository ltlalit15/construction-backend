const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  incidentType: { type: String, required: true },  // Type of incident (e.g., Accident, Fire, etc.)
  dateTime: { type: Date, required: true },  // Date and time of the incident
  location: { type: String, required: true },  // Incident location
  description: { type: String, required: true },  // Description of the incident
  severityLevel: { type: String, required: true },  // Severity level
  witnesses: [{ type: String }],  // List of witnesses
  immediateActions: { type: String, required: true },  // Immediate actions taken
  image: [],  // Array of file URLs (for evidence files uploaded)
  

  // Injury Specific
  injuredPersonName: { type: String },
  injuredPersonJobTitle: { type: String },
  injuryNature: { type: String },
  affectedBodyParts: { type: String },

  // Property Damage Specific
  damagedProperty: { type: String },
  damageDetails: { type: String },

  // Environmental Incident Specific
  environmentalImpact: { type: String },

  // Fire Incident Specific
  fireCause: { type: String },
  fireDamage: { type: String },

  title: { type: String},

  ReportedBy: {type: String},

  status: {type: String}




}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
