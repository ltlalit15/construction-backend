const asyncHandler = require("express-async-handler");
const plantTool = require("../Model/plantToolModel");
const Category = require("../Model/categoryModel");

// CREATE
const createPlantTool = asyncHandler(async (req, res) => {
  const { toolId, toolName, manufacturer, category, purchaseDate, condition, notes, location } = req.body;

  if (!toolId || !toolName || !manufacturer || !category || !purchaseDate || !condition || !location) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  // Validate category ID
  const cat = await Category.findById(category);
  if (!cat) {
    return res.status(400).json({ success: false, message: "Category not found" });
  }

  const tool = await plantTool.create({
    toolId,
    toolName,
    manufacturer,
    category,
    purchaseDate,
    condition,
    notes,
    location
  });

  res.status(201).json({ success: true, message: "Tool created successfully", tool });
});


// GET ALL with .populate
const getAllPlantTools = asyncHandler(async (req, res) => {
  const tools = await plantTool.find()
    .populate({
      path: "category",
      select: "category",
      model: "Category"
    });

  res.status(200).json({ success: true, tools });
});

// GET ONE with .populate
const getSinglePlantTool = asyncHandler(async (req, res) => {
  const tool = await plantTool.findById(req.params.id)
    .populate({
      path: "category",
      select: "category",
      model: "Category"
    });

  if (!tool) return res.status(404).json({ success: false, message: "Tool not found" });
  res.status(200).json({ success: true, tool });
});


// UPDATE
const updatePlantTool = asyncHandler(async (req, res) => {
  const updateData = req.body;

  // If category is being updated, validate it
  if (updateData.category) {
    const cat = await Category.findById(updateData.category);
    if (!cat) {
      return res.status(400).json({ success: false, message: "Category not found" });
    }
  }

  const updatedTool = await plantTool.findByIdAndUpdate(req.params.id, updateData, { new: true });

  if (!updatedTool) {
    return res.status(404).json({ success: false, message: "Tool not found" });
  }

  res.status(200).json({ success: true, message: "Tool updated successfully", tool: updatedTool });
});


// DELETE
const deletePlantTool = asyncHandler(async (req, res) => {
  const deleted = await plantTool.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: "Tool not found" });
  res.status(200).json({ success: true, message: "Tool deleted successfully" });
});



module.exports = { createPlantTool, getAllPlantTools, getSinglePlantTool, updatePlantTool, deletePlantTool };
