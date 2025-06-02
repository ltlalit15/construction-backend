const asyncHandler = require("express-async-handler");
const worker = require('../Model/workerModel');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');
const mongoose = require("mongoose");


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


// Create Worker
const createWorker = asyncHandler(async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      email,
      whiteCardNumber,
      whiteCardExpiry,
      inductionDate,
      complianceStatus,
      accessHours,
      supervisorAssignment,
      workArea,
      accessLevel,
       workeractive,
      workerinactive
    } = req.body;

    let image = [];

    // Upload image to Cloudinary
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "workers",
        resource_type: "image"
      });
      if (uploadResult && uploadResult.secure_url) {
        image.push(uploadResult.secure_url);
      }
    }

    // Validate supervisor ID
    const supervisor = await User.findById(supervisorAssignment);
    if (!supervisor) {
      return res.status(400).json({ success: false, message: "Supervisor not found" });
    }

    // Use lowercase model name
    const newWorker = new worker({
      fullName,
      contactNumber,
      email,
      whiteCardNumber,
      whiteCardExpiry,
      inductionDate,
      complianceStatus,
      accessHours,
      supervisorAssignment,
      workArea,
      accessLevel,
      workeractive,
      workerinactive,

      image
    });

    const savedWorker = await newWorker.save();

    res.status(201).json({
      success: true,
      message: "Worker added successfully",
      data: savedWorker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add worker",
      error: error.message
    });
  }
});


// Get All Workers
const getAllWorkers = asyncHandler(async (req, res) => {
  try {
    const workers = await worker.find()
      .populate("supervisorAssignment", "firstName lastName role")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "All workers fetched", data: workers });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch workers", error: error.message });
  }
});

// Get Worker by ID
const getWorkerById = asyncHandler(async (req, res) => {
  try {
    const foundWorker = await worker.findById(req.params.id)
      .populate("supervisorAssignment", "firstName lastName role");

    if (!foundWorker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    res.status(200).json({ success: true, message: "Worker fetched", data: foundWorker });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch worker", error: error.message });
  }
});


// Update Worker
const updateWorker = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Get ID from params

    const {
      fullName,
      contactNumber,
      email,
      whiteCardNumber,
      whiteCardExpiry,
      inductionDate,
      complianceStatus,
      accessHours,
      supervisorAssignment,
      workArea,
      accessLevel,
       workeractive,
      workerinactive
    } = req.body;

    let image = req.body.image || [];

    // Upload new image if provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "workers",
        resource_type: "image"
      });
      if (uploadResult && uploadResult.secure_url) {
        image = [uploadResult.secure_url];
      }
    }

    // Validate supervisorAssignment
    const supervisor = await User.findById(supervisorAssignment);
    if (!supervisor) {
      return res.status(400).json({ success: false, message: "Supervisor not found" });
    }

    // Update worker record
    const updatedWorker = await worker.findByIdAndUpdate(
      id, // Use param
      {
        fullName,
        contactNumber,
        email,
        whiteCardNumber,
        whiteCardExpiry,
        inductionDate,
        complianceStatus,
        accessHours,
        supervisorAssignment,
        workArea,
        accessLevel,
        workeractive,
        workerinactive,
        image
      },
      { new: true }
    );

    if (!updatedWorker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    res.status(200).json({
      success: true,
      message: "Worker updated successfully",
      data: updatedWorker
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update worker",
      error: error.message
    });
  }
});


// Delete Worker
const deleteWorker = asyncHandler(async (req, res) => {
  try {
    const deleted = await worker.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }
    res.status(200).json({ success: true, message: "Worker deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete worker", error: error.message });
  }
});



module.exports = { createWorker, getAllWorkers, getWorkerById, updateWorker, deleteWorker }
