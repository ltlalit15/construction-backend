const mongoose = require('mongoose');

const PlanPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic Plan', 'Standard Plan', 'Enterprise Plan']
  },
  pricePerYear: {
    type: Number,
    required: true
  },
  features: {
    activeProjects: {
      type: mongoose.Schema.Types.Mixed, 
      required: true
    },
    siteEngineers: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    materialReports: {
      type: String,
      required: true
    },
    siteVisitLogs: {
      type: mongoose.Schema.Types.Mixed, 
      required: true
    },
    support: {
      type: String,
      required: true
    },
    dedicatedAccountManager: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});


module.exports = mongoose.model('PlanPackage', PlanPackageSchema);
