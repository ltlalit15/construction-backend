const asyncHandler = require("express-async-handler");
const InductionTemplate = require("../Model/inductionTemplateModel");
const Projects = require("../Model/projectsModel");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



const createInductionTemplate = async (req, res) => {
  const {
    fullName,
    contactNumber,
    emailAddress,
    whiteCardNumber,
    projectName,
    siteLocation,
    siteSupervisor,
    inductionDate,
    accessStartTime,
    accessEndTime,
    inductionValidityPeriod,
    questions
  } = req.body;

  try {
     let fileUrl = '';
          if (req.files && req.files.image) {
            const imageFile = req.files.image;
            const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
              folder: 'uploads', 
              resource_type: 'image',
            });
      
            if (uploadResult && uploadResult.secure_url) {
              fileUrl = uploadResult.secure_url;
            } else {
              console.error('Cloudinary upload failed: No URL returned.');
            }
          } else {
            console.log('No image file uploaded.');
          }

    const projectExists = await Projects.findById(projectName);
    if (!projectExists) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    const newInduction = new InductionTemplate({
      fullName,
      contactNumber,
      emailAddress,
      whiteCardNumber,
      projectName,
      siteLocation,
      siteSupervisor,
      inductionDate: new Date(inductionDate),
      accessStartTime,
      accessEndTime,
      inductionValidityPeriod,
      questions: JSON.parse(questions),
      image: fileUrl ? [fileUrl] : [], 
    });

    await newInduction.save();

    res.status(201).json({
      success: true,
      message: 'Induction created successfully',
      induction: newInduction,
    });
  } catch (error) {
    console.error('Error creating induction:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the induction',
      error: error.message,
    });
  }
};

const getAllInductionTemplates = async (req, res) => {
  try {
    const inductions = await InductionTemplate.find().populate('projectName', 'name');
    res.status(200).json({ success: true, data: inductions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch templates', error: error.message });
  }
};



const getInductionTemplateById = async (req, res) => {
  try {
    const induction = await InductionTemplate.findById(req.params.id).populate('projectName', 'name');
    if (!induction) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, data: induction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch template', error: error.message });
  }
};



const updateInductionTemplate = async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      emailAddress,
      whiteCardNumber,
      projectName,
      siteLocation,
      siteSupervisor,
      inductionDate,
      accessStartTime,
      accessEndTime,
      inductionValidityPeriod,
      questions
    } = req.body;

    const id = req.params.id;

    // Check if the project ID is valid
    const projectExists = await Projects.findById(projectName);
    if (!projectExists) {
      return res.status(400).json({ success: false, message: 'Invalid project ID' });
    }

    // Get the existing induction to retain the old image if not replaced
    const existingInduction = await InductionTemplate.findById(id);
    if (!existingInduction) {
      return res.status(404).json({ success: false, message: 'Induction template not found' });
    }

    // Upload new image if provided
    let fileUrl = '';
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: 'uploads',
        resource_type: 'image',
      });

      if (uploadResult && uploadResult.secure_url) {
        fileUrl = uploadResult.secure_url;
      }
    }

    // Build the updated data object
    const updateData = {
      fullName,
      contactNumber,
      emailAddress,
      whiteCardNumber,
      projectName,
      siteLocation,
      siteSupervisor,
      inductionDate: new Date(inductionDate),
      accessStartTime,
      accessEndTime,
      inductionValidityPeriod,
      questions: typeof questions === 'string' ? JSON.parse(questions) : questions,
      image: fileUrl ? [fileUrl] : existingInduction.image,
    };

    // Update the induction template
    const updated = await InductionTemplate.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      induction: updated,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Update failed',
      error: error.message,
    });
  }
};



const deleteInductionTemplate = async (req, res) => {
  try {
    const deleted = await InductionTemplate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Template not found' });
    res.status(200).json({ success: true, message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};







module.exports = { createInductionTemplate, getAllInductionTemplates, getInductionTemplateById, updateInductionTemplate, deleteInductionTemplate };





