const asyncHandler = require('express-async-handler');
const ppe = require("../Model/ppeModel");

// CREATE PPE Template
const createPpeTemplate = asyncHandler(async (req, res) => {
  const { taskName, description, requiredPPE, assignedTo, status } = req.body;

  if (!taskName || !description || !assignedTo || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newTemplate = await ppe.create({
    taskName,
    description,
    requiredPPE,
    assignedTo
  });

  res.status(201).json(newTemplate);
});

// GET All Templates
const getAllPpeTemplates = asyncHandler(async (req, res) => {
  const templates = await ppe.find();
  if (!templates) {
    res.status(404);
    throw new Error("No templates found");
  }
  res.status(200).json(templates);
});


// GET Single Template
const getSinglePpeTemplate = asyncHandler(async (req, res) => {
  const template = await ppe.findById(req.params.id);
  if (!template) {
    res.status(404).json({ message: "Template not found" });
  } else {
    res.status(200).json(template);
  }
});


// UPDATE Template
const updatePpeTemplate = asyncHandler(async (req, res) => {
  const allowedFields = ['taskName', 'description', 'requiredPPE', 'assignedTo'];
  const updateData = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });


  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No fields provided to update" });
  }

  const updatedTemplate = await ppe.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!updatedTemplate) {
    return res.status(404).json({ message: "Template not found" });
  }

  res.status(200).json(updatedTemplate);
});


// DELETE Template
const deletePpeTemplate = asyncHandler(async (req, res) => {
  const deleted = await ppe.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ status: "false", message: "Template not found" });
  }
  res.status(200).json({ status: "true", message: "Deleted successfully" });
});


module.exports = {
  createPpeTemplate,
  getAllPpeTemplates,
  getSinglePpeTemplate,
  updatePpeTemplate,
  deletePpeTemplate,
};


