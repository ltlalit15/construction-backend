const asyncHandler = require('express-async-handler');
const FormResponse = require('../Model/formResponseModel');
const FormTemplate = require('../Model/formTemplateModel');
const User = require('../Model/userModel');
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



const createFormResponse = asyncHandler(async (req, res) => {
  const { formId, formName, userId, responses } = req.body;

  // Validate presence
  if (!formName || !responses || Object.keys(responses).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Form name and responses are required."
    });
  }


  // Find FormTemplate by formId
  const formTemplate = await FormTemplate.findById(formId);
  if (!formTemplate) {
    return res.status(404).json({
      success: false,
      message: "Form template not found"
    });
  }

  // Log the responses to debug
  console.log("Received responses:", responses);

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Handle image upload
  let imageUrls = [];
  if (req.files && req.files.image) {
    const imageFiles = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

    for (const file of imageFiles) {
      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "rfis",
        resource_type: "image"
      });
      if (uploaded.secure_url) {
        imageUrls.push(uploaded.secure_url);
      }
    }
  }

  // Ensure responses is an object (parse it if it's a string)
  let parsedResponses;
  if (typeof responses === 'string') {
    try {
      parsedResponses = JSON.parse(responses);  // Try to parse the string to an object
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid responses format"
      });
    }
  } else {
    parsedResponses = responses;  // Keep it as it is if it's already an object
  }

  // Save form response
  try {
    const newFormResponse = new FormResponse({
      formId,
      formName,
      submittedBy: userId,
      responses: parsedResponses,
      image: imageUrls
    });

    const savedResponse = await newFormResponse.save();

    res.status(201).json({
      success: true,
      message: "Form response created successfully",
      data: savedResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});




const getAllFormResponses = asyncHandler(async (req, res) => {
  try {
    const responses = await FormResponse.find()
                                        .populate('submittedBy', 'firstName lastName') // Populate user fields
                                        .populate('formId', 'formName'); // Populate form name from FormTemplate

    res.status(200).json({
      success: true,
      message: "All form responses fetched successfully",
      data: responses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});



const getFormResponseById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const response = await FormResponse.findById(id)
                                       .populate('submittedBy', 'firstName lastName') // Populate user fields
                                       .populate('formId', 'formName'); // Populate form name from FormTemplate

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Form response not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Form response fetched successfully",
      data: response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});




const updateFormResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { formId, formName, userId, responses } = req.body;

  if (!formId || !formName || !responses || Object.keys(responses).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Form ID, form name, and responses are required."
    });
  }

  // Find FormTemplate by formId
  const formTemplate = await FormTemplate.findById(formId);
  if (!formTemplate) {
    return res.status(404).json({
      success: false,
      message: "Form template not found"
    });
  }

  // Fetch user details from the User model using userId passed in the body
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Handle image upload if any
  let imageUrls = [];
  if (req.files && req.files.image) {
    const imageFiles = Array.isArray(req.files.image) ? req.files.image : [req.files.image];

    for (const file of imageFiles) {
      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "rfis",
        resource_type: "image"
      });
      if (uploaded.secure_url) {
        imageUrls.push(uploaded.secure_url);
      }
    }
  }

  // Ensure responses is an object (parse it if it's a string)
  let parsedResponses;
  if (typeof responses === 'string') {
    try {
      parsedResponses = JSON.parse(responses);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid responses format"
      });
    }
  } else {
    parsedResponses = responses;
  }

  // Update the form response
  try {
    const updatedResponse = await FormResponse.findByIdAndUpdate(
      id,
      { formId, formName, submittedBy: userId, responses: parsedResponses, image: imageUrls },
      { new: true }
    );

    if (!updatedResponse) {
      return res.status(404).json({
        success: false,
        message: "Form response not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Form response updated successfully",
      data: updatedResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});




const deleteFormResponse = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Get ID from request parameters

  try {
    const deletedResponse = await FormResponse.findByIdAndDelete(id);

    if (!deletedResponse) {
      return res.status(404).json({
        success: false,
        message: "Form response not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Form response deleted successfully",
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});



module.exports = { createFormResponse, getAllFormResponses, getFormResponseById, updateFormResponse, deleteFormResponse}
