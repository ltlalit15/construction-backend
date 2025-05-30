
const Incident = require("../Model/IncidentModel");
const SWMS=require("../Model/SwmsModel");
const ITPs = require('../Model/ITPsModel');
const RFI = require('../Model/rfiModel');


const asyncHandler = require("express-async-handler");


const getLastThreeData = async (req, res) => {
    try {
      // Fetch the last 3 SWMS records
      const last3SWMS = await SWMS.find().sort({ createdAt: -1 }).limit(3);
      console.log('Last 3 SWMS:', last3SWMS); // Debug log
  
      // Fetch the last 3 Incident records
      const last3Incidents = await Incident.find().sort({ createdAt: -1 }).limit(3);
      console.log('Last 3 Incidents:', last3Incidents); // Debug log
  
      // Fetch the last 3 ITPs records
      const last3ITPs = await ITPs.find().sort({ createdAt: -1 }).limit(3);
      console.log('Last 3 ITPs:', last3ITPs); // Debug log

      // Fetch the last 3 RFI records
      const last3RFI = await RFI.find().sort({ createdAt: -1 }).limit(3); // Fetching the latest 3 RFI records
      console.log('Last 3 RFIs:', last3RFI); // Debug log
  
      // Combine all the data into a single response object
      const combinedData = {
        swms: last3SWMS,
        incidents: last3Incidents,
        itps: last3ITPs,
        rfis: last3RFI, // Add the RFI data
      };
  
      // Send the response
      res.status(200).json({
        success: true,
        data: combinedData,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the data',
        error: error.message,
      });
    }
  };
  



module.exports = {getLastThreeData};
  
