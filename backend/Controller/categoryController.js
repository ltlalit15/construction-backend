const Category = require("../Model/categoryModel");
const asyncHandler = require("express-async-handler");


const addCategory = async (req, res) => {
    const { category } = req.body;
  
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category field is required"
      });
    }
  
    try {
      // Create a new category
      const newCategory = new Category({
        category
      });
  
      // Save to database
      await newCategory.save();
  
      res.status(201).json({
        success: true,
        message: "Category added successfully",
        data: newCategory
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  
  const getAllCategories = async (req, res) => {
    try {
      // Fetch all categories from the database
      const categories = await Category.find();
  
      if (categories.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No categories found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Categories fetched successfully',
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






module.exports = {addCategory,getAllCategories};
