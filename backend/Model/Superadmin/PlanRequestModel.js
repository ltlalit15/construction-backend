const mongoose = require('mongoose');

const planRequestSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true,
    enum: ['Basic Plan', 'Standard Plan', 'Enterprise Plan'] // Optional, if plans are fixed
  },
  activeProjects: {
    type: Number,
    required: true
  },
  siteEngineers: {
    type: Number,
    required: true
  },
  dailySiteVisits: {
    type: Number,
    required: true
  },
  reports: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true // Example: '1 Year', '6 Months'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlanRequest', planRequestSchema);
