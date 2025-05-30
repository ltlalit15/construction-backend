
const SiteEntry = require("../Model/siteEntryModel");
const asyncHandler = require("express-async-handler");


// Create a new site entry
const createSiteEntry = async (req, res) => {
    const { fullName, workerId, phoneNumber, emailAddress, safetyEquipment, siteName, siteSupervisor, inductionDate, siteLocation } = req.body;
  
    try {
      const newSiteEntry = new SiteEntry({
        fullName,
        workerId,
        phoneNumber,
        emailAddress,
        safetyEquipment,
        siteName,
        siteSupervisor,
        inductionDate: new Date(inductionDate),
        siteLocation,
      });
  
      await newSiteEntry.save();
  
      res.status(201).json({
        success: true,
        message: 'Site entry created successfully',
        data: newSiteEntry,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating site entry',
        error: error.message,
      });
    }
  };



  const getAllIncidents = async (req, res) => {
    try {
      const incidents = await Incident.find().sort({ dateTime: -1 });  // Sort by date (newest first)
      res.status(200).json({
        success: true,
        incidents,
      });
    } catch (error) {
      console.error('Error fetching incidents:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching incidents',
        error: error.message,
      });
    }
  };
   


  const getAllSiteEntries = async (req, res) => {
    try {
      // Retrieve all site entries
      const siteEntries = await SiteEntry.find();
      
      // Format the response as per your requirement
      const formattedData = siteEntries.map(entry => ({
        _id: entry._id,
        fullName: entry.fullName,
        workerId: entry.workerId,
        phoneNumber: entry.phoneNumber,
        emailAddress: entry.emailAddress,
        safetyEquipment: entry.safetyEquipment,
        siteName: entry.siteName,
        siteSupervisor: entry.siteSupervisor,
        inductionDate: entry.inductionDate,
        siteLocation: entry.siteLocation,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        __v: entry.__v
      }));
  
      // Respond with the formatted data
      res.status(200).json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching site entries',
        error: error.message
      });
    }
  };



  const getSiteEntryById = async (req, res) => {
    const { id } = req.params;  // Get the site entry ID from the URL
  
    try {
      const siteEntry = await SiteEntry.findById(id);
  
      if (!siteEntry) {
        return res.status(404).json({
          success: false,
          message: 'Site entry not found',
        });
      }
  
      // Return the response in the required format (not an array, just a single object)
      res.status(200).json({
        success: true,
        data: {
          _id: siteEntry._id,
          fullName: siteEntry.fullName,
          workerId: siteEntry.workerId,
          phoneNumber: siteEntry.phoneNumber,
          emailAddress: siteEntry.emailAddress,
          safetyEquipment: siteEntry.safetyEquipment,
          siteName: siteEntry.siteName,
          siteSupervisor: siteEntry.siteSupervisor,
          inductionDate: siteEntry.inductionDate,
          siteLocation: siteEntry.siteLocation,
          createdAt: siteEntry.createdAt,
          updatedAt: siteEntry.updatedAt,
          __v: siteEntry.__v,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching site entry',
        error: error.message,
      });
    }
  };
  
  

  const updateSiteEntry = async (req, res) => {
    const { id } = req.params;
    const {
      fullName,
      workerId,
      phoneNumber,
      emailAddress,
      safetyEquipment,
      siteName,
      siteSupervisor,
      inductionDate,
      siteLocation
    } = req.body;
  
    try {
      const siteEntry = await SiteEntry.findById(id);
  
      if (!siteEntry) {
        return res.status(404).json({
          success: false,
          message: 'Site entry not found',
        });
      }
  
      // Update the site entry with the provided details
      siteEntry.fullName = fullName || siteEntry.fullName;
      siteEntry.workerId = workerId || siteEntry.workerId;
      siteEntry.phoneNumber = phoneNumber || siteEntry.phoneNumber;
      siteEntry.emailAddress = emailAddress || siteEntry.emailAddress;
      siteEntry.safetyEquipment = safetyEquipment || siteEntry.safetyEquipment;
      siteEntry.siteName = siteName || siteEntry.siteName;
      siteEntry.siteSupervisor = siteSupervisor || siteEntry.siteSupervisor;
      siteEntry.inductionDate = inductionDate || siteEntry.inductionDate;
      siteEntry.siteLocation = siteLocation || siteEntry.siteLocation;
  
      // Save the updated site entry
      const updatedSiteEntry = await siteEntry.save();
  
      // Format the response to match your requested structure
      res.status(200).json({
        success: true,
        message: 'Site entry updated successfully',
        data: {
          _id: updatedSiteEntry._id,
          fullName: updatedSiteEntry.fullName,
          workerId: updatedSiteEntry.workerId,
          phoneNumber: updatedSiteEntry.phoneNumber,
          emailAddress: updatedSiteEntry.emailAddress,
          safetyEquipment: updatedSiteEntry.safetyEquipment,
          siteName: updatedSiteEntry.siteName,
          siteSupervisor: updatedSiteEntry.siteSupervisor,
          inductionDate: updatedSiteEntry.inductionDate,
          siteLocation: updatedSiteEntry.siteLocation,
          createdAt: updatedSiteEntry.createdAt,
          updatedAt: updatedSiteEntry.updatedAt,
          __v: updatedSiteEntry.__v
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating site entry',
        error: error.message,
      });
    }
  };


  const deleteSiteEntry = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find and delete the site entry by ID
      const siteEntry = await SiteEntry.findByIdAndDelete(id);
  
      // If site entry is not found, return a 404
      if (!siteEntry) {
        return res.status(404).json({
          success: false,
          message: 'Site entry not found',
        });
      }
  
      // Return success message after deletion
      res.status(200).json({
        success: true,
        message: 'Site entry deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting site entry',
        error: error.message,
      });
    }
  };
  
 
  



module.exports = {createSiteEntry, getAllSiteEntries, getSiteEntryById, updateSiteEntry, deleteSiteEntry};
