// models/Induction.js

const mongoose = require('mongoose');

const inductionSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  whiteCardNumber: { type: String, required: true },
  siteLocation: { type: String, required: true },
  siteSupervisor: { type: String, required: true },
  inductionDate: { type: Date, required: true },
  inductionValidityPeriod: { type: String, required: true },
  accessStartTime: { type: String },
  accessEndTime: { type: String },
  acknowledgements: {
    siteSafetyPlan: { type: Boolean },
    complyOperatingHours: { type: Boolean },
    emergencyProcedures: { type: Boolean }
  },
  image: [],


  
}, { timestamps: true });


module.exports = mongoose.model('Induction', inductionSchema);
