const mongoose =require("mongoose")
// const Project = require("../Model/projectsModel"); 
// const User = require("../Model/userModel");
// const Swms=require("../Model/SwmsModel")

const CalendarSchema = new mongoose.Schema({
    taskTitle: { 
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId, // Store ObjectId for project
      ref: 'Projects', // Referencing the Projects collection
      required: true,
    },
    taskType: {
      type: String,
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
    assignTeamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Referencing the User model
        required: true,
      },
    ],
    image: [],
    reminders:
        {
         type: String
    },
    
    color:{
        type: String,
        required: true,
    },
  }, {
    timestamps: true,
  });
  
  
  
module.exports = mongoose.model('Calendar',CalendarSchema);
