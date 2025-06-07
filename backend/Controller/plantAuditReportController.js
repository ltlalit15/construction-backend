const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary").v2;
const plantAuditReport = require("../Model/plantAuditReportModel");
const PlantMachineryEquipment = require("../Model/PlantMachineryEquipmentModel");

// Cloudinary config
cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// CREATE audit report
const createPlantAuditReport = asyncHandler(async (req, res) => {
  try {
    const {
      plantType,
      preStartDate,
      machineId,
      checkedBy,
      odometerReading,
      nextServiceDue,
      checklist,
      operatorSignature,
      status
    } = req.body;

    // Validate plantType ID exists
    const plantExists = await PlantMachineryEquipment.findById(plantType);  // or PlantType.findById(plantType)
    if (!plantExists) {
      return res.status(400).json({ success: false, message: "Invalid plantType ID" });
    }

    let checklistItems = [];
    if (checklist) {
      checklistItems = typeof checklist === 'string' ? JSON.parse(checklist) : checklist;
    }

    // Upload **all** checklist photos to a single array
    let imageUrls = [];

    if (req.files) {
      // Collect all files named checklist_0_photo, checklist_1_photo, ...
      for (const key in req.files) {
        const files = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "rfis",
            resource_type: "image"
          });
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
    }

    const newReport = await plantAuditReport.create({
      plantType,
      preStartDate,
      machineId,
      checkedBy,
      odometerReading,
      nextServiceDue,
      checklist: checklistItems,
      image: imageUrls,       // <--- assign all images here
      operatorSignature,
      status
      
    });

    res.status(201).json({
      success: true,
      message: "Audit report created successfully",
      report: newReport
    });

  } catch (error) {
    console.error("Error creating audit report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


// GET ALL audit reports with plantType populated
const getAllPlantAuditReports = asyncHandler(async (req, res) => {
  const reports = await plantAuditReport.find()
    .populate({
      path: "plantType",
      select: "name",  // Only include 'name' field of PlantMachineryEquipment in response
    });

  res.status(200).json({ success: true, reports });
});

// GET single audit report with plantType populated
const getSinglePlantAuditReport = asyncHandler(async (req, res) => {
  const report = await plantAuditReport.findById(req.params.id)
    .populate({
      path: "plantType",
      select: "name",  // Include 'name' field
    });

  if (!report) {
    return res.status(404).json({ success: false, message: "Report not found" });
  }
  res.status(200).json({ success: true, report });
});


// UPDATE audit report
const updatePlantAuditReport = asyncHandler(async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If plantType is being updated, validate it
    if (updateData.plantType) {
      const plantExists = await PlantMachineryEquipment.findById(updateData.plantType);
      if (!plantExists) {
        return res.status(400).json({ success: false, message: "Invalid plantType ID" });
      }
    }

    // Parse checklist if provided as string
    if (updateData.checklist) {
      updateData.checklist = typeof updateData.checklist === "string" 
        ? JSON.parse(updateData.checklist) 
        : updateData.checklist;
    }

    // Handle image uploads (replace entire image array if new images uploaded)
    if (req.files && Object.keys(req.files).length > 0) {
      let imageUrls = [];
      for (const key in req.files) {
        const files = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "rfis",
            resource_type: "image"
          });
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
      updateData.image = imageUrls;
    }


    // Update the document
    const updatedReport = await plantAuditReport.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ success: false, message: "Audit report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Audit report updated successfully",
      report: updatedReport
    });

  } catch (error) {
    console.error("Error updating audit report:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});


// DELETE audit report
const deletePlantAuditReport = asyncHandler(async (req, res) => {
  const deleted = await plantAuditReport.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: "Report not found" });
  res.status(200).json({ success: true, message: "Audit report deleted successfully" });
});


module.exports = { createPlantAuditReport, getAllPlantAuditReports, getSinglePlantAuditReport, updatePlantAuditReport, deletePlantAuditReport };
