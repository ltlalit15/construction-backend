const mongoose = require("mongoose");

const HazardSchema = new mongoose.Schema(
  {
    hazardDescription: { type: String, required: true },
    severityLevel: {
      type: String,
      required: true,
    },
    likelihood: {
      type: String,
     // required: true,
    },
     
    impact: {
      type: String,
      //required: true,
    },

    riskMatrix: {
      type: String,
     // required: true, // e.g., "3 x 2"
    },

    
    additionalNotes: { type: String, required: true },
    responsiblePerson: { type: String, required: true },
    controlVerification: {
      type: String,
           
    },
    controlMeasure: {
      type: String,
      
      required: true,
    },

    status: {type: String},
    implementationDate: {type: String}

  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);


module.exports = mongoose.model("Hazard", HazardSchema);
