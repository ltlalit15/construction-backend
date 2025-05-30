const mongoose = require("mongoose");

const ITPsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: { // ✅ Stores category ID
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  taskStage: { // ✅ Formerly Task Type or Stage
    type: String,
    required: true,
  },
  folderLocation: {
    type: String,
    required: true,
  },
  folder: {
    folderName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    }
  },
  stepDescription: {
    type: String,
    required: true,
  },
  qualityStatus: {
    type: String,
    required: true,
  },

  reviewerAssignment: { // ✅ Reviewer assignment (User ID)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  reviewerComments: {
    type: String,
    required: true,
  },

  
  image: [],
}, {
  timestamps: true,
});

const ITPs = mongoose.model('ITPs', ITPsSchema);
module.exports = ITPs;


