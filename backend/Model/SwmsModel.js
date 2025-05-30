const mongoose =require("mongoose")
//const Project = require("../Model/projectsModel"); 

const SwmsSchema = new mongoose.Schema(
  {
    swmsName: { type: String, required: true },
    siteAddress: { type: String, required: true },
    companyName: { type: String, required: true },
    responsiblePersonName: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },

    companyInformation: {
      companyName: { type: String, required: true },
      abn: { type: String },
      address: { type: String, required: true },
      contactNumber: { type: String, required: true },
      principalContractor: {
        name: { type: String, required: true },
        contactPerson: { type: String },
        contactNumber: { type: String },
      },
    },
     workActivities: {
      type: [String], // Array of strings
     
      required: true, // Ensure that work activities must be selected
    },
    hazardIdentification: {
      type: [String], // Array of strings
      
      required: true, // Ensure hazard identification must be selected
    },
  

   requiredPPE: {
      predefined: {
        type: [String], // Example: ["Hard Hat", "Safety Footwear"]
        
        required: true,
      },
      custom: {
        type: [String], // Example: ["Face Shield", "Chemical Suit"]
       
        required: false,
      }
    },

    status: { type: String },

  },
  {
    timestamps: true,
  }
);
  

module.exports = mongoose.model('SWMS',SwmsSchema)

