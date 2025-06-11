const FormTemplate = require('../Model/formTemplateModel');
const Projects = require('../Model/projectsModel');
const User = require("../Model/userModel");
const asyncHandler = require('express-async-handler');

// Create a new form template
const createFormTemplate = asyncHandler(async (req, res) => {
  const { projectId, formName, description, fields, type, userId } = req.body;

  if (!projectId || !formName || !fields || fields.length === 0) {
    return res.status(400).json({ success: false, message: "Form name and fields are required." });
  }

  try {

    const project = await Projects.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }
    // Fetch user details from the User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Process each field and add the createdBy (userId) to each field
    fields.forEach(field => {
      field.createdBy = userId;  // Add createdBy to each field
      field.projectId = projectId;

      if (field.type === 'select' && field.options) {
        field.options = field.options.map(option => ({
          label: option.label,
          value: option.value
        }));
      }
      field.required = field.required || false;
      field.visible = field.visible || true;
    });

    // Create a new form template
    const newFormTemplate = new FormTemplate({
      projectId,
      formName,
      description,
      type,
      fields
    });

    const savedTemplate = await newFormTemplate.save();
    
    // Populate options properly in the response
    const populatedTemplate = await FormTemplate.findById(savedTemplate._id)
                                               .populate('fields.options');  // Ensure options are included in the response

    res.status(201).json({
      success: true,
      message: "Form template created successfully",
      data: populatedTemplate  // This will now include the populated options
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


// Get all form templates
const getFormTemplates = asyncHandler(async (req, res) => {
  try {
    // Fetch all form templates and populate the 'createdBy' field with 'firstName' and 'lastName'
    const formTemplates = await FormTemplate.find()
      .populate('fields.createdBy', 'firstName lastName')
      .populate('fields.projectId', 'name');  // Populate projectId as a reference to the Projects collection

    res.status(200).json({
      success: true,
      data: formTemplates
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


// Get a single form template by ID
const getFormTemplateById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the form template by ID and populate the 'createdBy' field with 'firstName' and 'lastName'
    const formTemplate = await FormTemplate.findById(id)
      .populate('fields.createdBy', 'firstName lastName')
      .populate('fields.projectId', 'name');  
       

    if (!formTemplate) {
      return res.status(404).json({ success: false, message: "Form template not found" });
    }
    res.status(200).json({
      success: true,
      data: formTemplate
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

// Update a form template by ID
const updateFormTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Extract the form template ID from the URL parameter
  const { projectId, formName, description, fields, type, userId } = req.body;  // Extract the data to update from the body

  if (!projectId, !formName || !fields || fields.length === 0) {
    return res.status(400).json({ success: false, message: "Form name and fields are required." });
  }

  try {
    // Find the form template by ID
    const formTemplate = await FormTemplate.findById(id);

    if (!formTemplate) {
      return res.status(404).json({ success: false, message: "Form template not found" });
    }

      const project = await Projects.findById(projectId);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

    // Fetch user details from the User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Process each field and add the createdBy (userId) to each field
    fields.forEach(field => {
      field.createdBy = userId;  // Add createdBy to each field
      field.projectId = projectId;

      if (field.type === 'select' && field.options) {
        field.options = field.options.map(option => ({
          label: option.label,
          value: option.value
        }));
      }
      field.required = field.required || false;
      field.visible = field.visible || true;
    });

    // Update the fields if provided, otherwise retain the existing ones
    formTemplate.projectId = projectId || formTemplate.projectId;
    formTemplate.formName = formName || formTemplate.formName;
    formTemplate.description = description || formTemplate.description;
    formTemplate.fields = fields || formTemplate.fields;
    formTemplate.type = type || formTemplate.type; 

    // Save the updated form template
    const updatedTemplate = await formTemplate.save();

    // Populate options properly in the response
    const populatedTemplate = await FormTemplate.findById(updatedTemplate._id)
                                               .populate('fields.options');

    // Send back the updated template as the response
    res.status(200).json({
      success: true,
      message: "Form template updated successfully",
      data: populatedTemplate
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




// Delete a form template by ID
const deleteFormTemplate = asyncHandler(async (req, res) => {
  const { id } = req.params;  // Extract form template ID from the URL parameter

  try {
    // Attempt to find and delete the form template by ID
    const deletedTemplate = await FormTemplate.findByIdAndDelete(id); // This deletes the document

    if (!deletedTemplate) {
      return res.status(404).json({ success: false, message: "Form template not found" });
    }

    // Return success message with deleted template data
    res.status(200).json({
      success: true,
      message: "Form template deleted successfully",
     
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


module.exports = {
  createFormTemplate,
  getFormTemplates,
  getFormTemplateById,
  updateFormTemplate,
  deleteFormTemplate
};
