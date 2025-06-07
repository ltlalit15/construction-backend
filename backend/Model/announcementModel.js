const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Title is required
  },
  startDate: {
    type: String,

  },

  EndDate: {
    type: String,

  },
  priorityLevel: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,  // Message is required
  },
   status: {type: String},

  image: [],

  // groups: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to User model
  //   required: true,
  //   default: [],
  // }],
  
  // // individuals also refers to User model (User ObjectId)
  // individuals: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User', // Reference to User model
  //   required: true,
  //   default: [],
  // }]
  
}, { timestamps: true });  // Adds createdAt and updatedAt timestamps

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement; 
