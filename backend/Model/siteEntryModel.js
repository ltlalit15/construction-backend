const mongoose = require('mongoose');

const siteEntrySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  workerId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emailAddress: { type: String, required: true },
  safetyEquipment: {
    helmet: { type: Boolean, required: true },
    safetyBoots: { type: Boolean, required: true },
    hiVisVest: { type: Boolean, required: true },
    safetyGlasses: { type: Boolean, required: true },
    gloves: { type: Boolean, required: true },
  },
  siteName: { type: String, required: true },
  siteSupervisor: { type: String, required: true },
  inductionDate: { type: Date, required: true },
  siteLocation: { type: String, required: true },
}, { timestamps: true });



module.exports = mongoose.model('SiteEntry', siteEntrySchema);
