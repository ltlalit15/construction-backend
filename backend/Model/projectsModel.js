const mongoose = require("mongoose");

const ProjectsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  Progress: {
    type: String,
    required: true,
  },

   tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TasksManagement', // Reference to TasksManagement model
    }],
}, {
  timestamps: true,
});


module.exports = mongoose.model('Projects', ProjectsSchema);