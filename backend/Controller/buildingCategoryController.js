const BuildingCategory = require("../Model/buildingCategoryModel");
const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');



// Create Building Category (POST)
// const addBuildingCategory = async (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({
//       success: false,
//       message: 'Category name is required'
//     });
//   }

//   try {
//     const newBuildingCategory = new BuildingCategory({ name });
//     await newBuildingCategory.save();

//     res.status(201).json({
//       success: true,
//       message: 'Building category added successfully',
//       data: newBuildingCategory
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };


const addBuildingCategory = async (req, res) => {
  const { parentCategoryId, name, subcategories } = req.body;  // Add subcategories here if required

  // Validate that the parent category ID is provided
  if (!parentCategoryId) {
    return res.status(400).json({
      success: false,
      message: 'Parent category ID is required'
    });
  }

  // Validate that subcategories are in the correct format
  if (!Array.isArray(subcategories)) {
    return res.status(400).json({
      success: false,
      message: 'Subcategories should be an array of objects'
    });
  }

  try {
    // Find the existing building category by ID (parent category)
    const parentCategory = await BuildingCategory.findById(parentCategoryId);
    
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: 'Parent category not found'
      });
    }

    // Check if there are duplicate subcategories by name
    const existingSubcategories = parentCategory.subcategories.map(subcategory => subcategory.name);
    const newSubcategories = subcategories.filter(subcategory => !existingSubcategories.includes(subcategory.name));

    // If no new subcategories to add, return a message
    if (newSubcategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No new subcategories to add'
      });
    }

    // Add the new subcategories to the existing category's subcategories
    parentCategory.subcategories.push(...newSubcategories);

    // Save the updated category with new subcategories
    await parentCategory.save();

    res.status(200).json({
      success: true,
      message: 'Subcategories added successfully',
      data: parentCategory
    });
  } catch (error) {
    console.error("Error adding subcategories:", error);  // Logging the error for debugging

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Get All Building Categories (GET)
const getAllBuildingCategories = async (req, res) => {
  try {
    // Fetching categories and populating subcategories with descriptions
    const categories = await BuildingCategory.find()
      .populate('subcategories'); // Populating the subcategories for each category
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No categories found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Building categories fetched successfully',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Get Building Category by ID (GET)
const getBuildingCategoryById = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await BuildingCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Building category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Building category fetched successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update Building Category (PUT)
const updateBuildingCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const category = await BuildingCategory.findByIdAndUpdate(categoryId, { name }, { new: true });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Building category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Building category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


// Delete Building Category (DELETE)
const deleteBuildingCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await BuildingCategory.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Building category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Building category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};


module.exports = {
  addBuildingCategory,
  getAllBuildingCategories,
  getBuildingCategoryById,
  updateBuildingCategory,
  deleteBuildingCategory
};


