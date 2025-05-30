const SecurityAuditReport = require("../Model/auditModel");
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });



  const createSecurityAuditReport = async (req, res) => {
    const {
      auditDate,
      auditedBy,
      safetyManager,
      location,
      equipmentAssessment, // This will be a stringified array
      safetyManagerSignature,
      generalNotes,
      criticalObservations,
      followUpActions,
      status,
    } = req.body;
  
    try {
      // Parse the equipmentAssessment back to an array of objects
      let parsedEquipmentAssessment = [];
      if (equipmentAssessment) {
        parsedEquipmentAssessment = JSON.parse(equipmentAssessment); // Convert stringified JSON back to an array of objects
      }
  
      let imageUrl = '';
    
      // Handle file upload (if any)
      if (req.files && req.files.image) {
        const file = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'audit_reports',
          resource_type: 'image', // Auto detects file type
        });
        imageUrl = uploadResult.secure_url; // Document URL
      }
    
      const newReport = new SecurityAuditReport({
        auditDate,
        auditedBy,
        safetyManager,
        location,
        equipmentAssessment: parsedEquipmentAssessment, // Now it's an array of objects
        safetyManagerSignature,
        generalNotes,
        criticalObservations,
        followUpActions,
        image: imageUrl ? [imageUrl] : [], // Save image URL if uploaded
        status: status || 'Draft', // Default status
      });
  
      const savedReport = await newReport.save();
    
      res.status(201).json({
        success: true,
        message: 'Security Audit Report created successfully',
        data: savedReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating audit report',
        error: error.message,
      });
    }
  };


  const getAllSecurityAuditReports = async (req, res) => {
    try {
      // Fetch all security audit reports from the database
      const reports = await SecurityAuditReport.find();
  
      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching audit reports',
        error: error.message,
      });
    }
  };


  const getSecurityAuditReportById = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
  
    try {
      // Fetch the security audit report by its ID
      const report = await SecurityAuditReport.findById(id);
  
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Audit report not found',
        });
      }
  
      // Return the report data
      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching audit report',
        error: error.message,
      });
    }
  };


  const updateSecurityAuditReport = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
    const {
      auditDate,
      auditedBy,
      safetyManager,
      location,
      equipmentAssessment,
      safetyManagerSignature,
      generalNotes,
      criticalObservations,
      followUpActions,
      status,
    } = req.body;
  
    try {
      // Find the existing report by its ID
      const report = await SecurityAuditReport.findById(id);
  
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Audit report not found',
        });
      }

      // Parse equipmentAssessment if it's a string
      let parsedEquipmentAssessment = [];
      if (equipmentAssessment) {
        try {
          parsedEquipmentAssessment = JSON.parse(equipmentAssessment); // Convert stringified JSON back to an array of objects
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: 'Invalid equipment assessment format',
          });
        }
      }

      // Update the fields
      report.auditDate = auditDate || report.auditDate;
      report.auditedBy = auditedBy || report.auditedBy;
      report.safetyManager = safetyManager || report.safetyManager;
      report.location = location || report.location;
      report.equipmentAssessment = parsedEquipmentAssessment || report.equipmentAssessment; // Now it's an array of objects
      report.safetyManagerSignature = safetyManagerSignature || report.safetyManagerSignature;
      report.generalNotes = generalNotes || report.generalNotes;
      report.criticalObservations = criticalObservations || report.criticalObservations;
      report.followUpActions = followUpActions || report.followUpActions;
      report.status = status || report.status;
  
      // Handle file upload (if any)
      if (req.files && req.files.image) {
        const file = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'audit_reports',
          resource_type: 'image', // Auto detects file type
        });
        report.image = [uploadResult.secure_url]; // Update image URL
      }
  
      // Save the updated report
      const updatedReport = await report.save();
  
      res.status(200).json({
        success: true,
        message: 'Audit report updated successfully',
        data: updatedReport,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating audit report',
        error: error.message,
      });
    }
};


const deleteSecurityAuditReport = async (req, res) => {
  const { id } = req.params; // Extract the ID from the request params

  try {
    // Find the report by its ID
    const report = await SecurityAuditReport.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Audit report not found',
      });
    }

    // Delete the report
    await SecurityAuditReport.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Audit report deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting audit report',
      error: error.message,
    });
  }
};
   


module.exports = {createSecurityAuditReport, getAllSecurityAuditReports, getSecurityAuditReportById, updateSecurityAuditReport, deleteSecurityAuditReport};





