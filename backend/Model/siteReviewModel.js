const mongoose = require('mongoose');

const siteReviewSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true
    },
    siteLocation: {
      type: String,
      required: true
    },
    reviewDate: {
      type: Date,
      required: true
    },
    reviewerName: {
      type: String,
      required: true
    },
    complianceStatus: {
      type: String,
      required: true
    },
    checkedItems: {
      safetyEquipment: {
        type: Boolean,
        default: true
      },
      workAreaCleanliness: {
        type: Boolean,
        default: true
      },
      toolCondition: {
        type: Boolean,
        default: true
      }
    },
    image: [],

    recommendations: {
      type: String,
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
      
    },
    approvalStatus: {
      type: String,
      
      
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteReview', siteReviewSchema);
