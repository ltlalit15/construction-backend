const asyncHandler = require('express-async-handler');
const hazardTemplate = require("../Model/hazardTemplateModel");

// Create new hazard template
const createHazardTemplate = asyncHandler(async (req, res) => {
  const { workactivity, hazards, requiredPPE } = req.body;

  if (!workactivity || !Array.isArray(hazards) || !Array.isArray(requiredPPE)) {
    return res.status(400).json({ success: false, message: 'All fields are required and must be arrays where applicable' });
  }

  const newTemplate = await hazardTemplate.create({ workactivity, hazards, requiredPPE });

  res.status(201).json({
    success: true,
    message: 'Hazard template created successfully',
    data: newTemplate,
  });
});

// Get all hazard templates
const getAllHazardTemplates = asyncHandler(async (req, res) => {
  const templates = await hazardTemplate.find();
  res.status(200).json({ success: true, data: templates });
});

// Get hazard template by id
const getHazardTemplateById = asyncHandler(async (req, res) => {
  const template = await hazardTemplate.findById(req.params.id);
  if (!template) {
    return res.status(404).json({ success: false, message: 'Hazard template not found' });
  }
  res.status(200).json({ success: true, data: template });
});

// Update hazard template
const updateHazardTemplate = asyncHandler(async (req, res) => {
  const { workactivity, hazards, requiredPPE } = req.body;

  const updateData = {};
  if (workactivity !== undefined) updateData.workactivity = workactivity;
  if (hazards !== undefined) {
    if (!Array.isArray(hazards)) return res.status(400).json({ success: false, message: 'Hazards must be an array' });
    updateData.hazards = hazards;
  }
  if (requiredPPE !== undefined) {
    if (!Array.isArray(requiredPPE)) return res.status(400).json({ success: false, message: 'requiredPPE must be an array' });
    updateData.requiredPPE = requiredPPE;
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ success: false, message: 'At least one field required for update' });
  }

  const updatedTemplate = await hazardTemplate.findByIdAndUpdate(req.params.id, updateData, { new: true });

  if (!updatedTemplate) {
    return res.status(404).json({ success: false, message: 'Hazard template not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Hazard template updated successfully',
    data: updatedTemplate,
  });
});


// Delete hazard template
const deleteHazardTemplate = asyncHandler(async (req, res) => {
  const deleted = await hazardTemplate.findByIdAndDelete(req.params.id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Hazard template not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Hazard template deleted successfully',
  });
});


module.exports = { createHazardTemplate, getAllHazardTemplates, getHazardTemplateById, updateHazardTemplate, deleteHazardTemplate };
