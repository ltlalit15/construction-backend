const mongoose = require('mongoose');

const inductionSchema = new mongoose.Schema({
 
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  whiteCardNumber: { type: String, required: true },
   projectName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Projects', // Assuming your model is named 'Project'
    required: true
  },

  siteLocation: { type: String, required: true },
  siteSupervisor: { type: String, required: true },
  inductionDate: { type: Date, required: true },
  accessStartTime: { type: String },
  accessEndTime: { type: String },
  inductionValidityPeriod: { type: String, required: true }, // or use type: Number for days/months

  questions: {
    reviewedSiteSafetyPlan: { type: Boolean, default: false },
    agreeToOperatingHours: { type: Boolean, default: false },
    understandEmergencyProcedures: { type: Boolean, default: false },
    fitToWorkToday: { type: Boolean, default: false },
    haveRequiredPPE: { type: Boolean, default: false },
    understandWorkTasks: { type: Boolean, default: false },
  },

  image: [],

}, { timestamps: true });

module.exports = mongoose.model('InductionTemplate', inductionSchema);
