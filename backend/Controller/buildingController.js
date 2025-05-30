const Building = require('../Model/buildingModel');
const BuildingCategory = require('../Model/buildingCategoryModel');
const asyncHandler = require("express-async-handler");



const addBuilding = async (req, res) => {
    const { name, description, CategoryId } = req.body; // changed buildingCategory to CategoryId

    if (!name || !description || !CategoryId) {
      return res.status(400).json({ success: false, message: "Name, description, and building category are required" });
    }

    try {
      // Check if the building category exists by ID
      const category = await BuildingCategory.findById(CategoryId); // using CategoryId now
      if (!category) {
        return res.status(404).json({ success: false, message: "Building category not found" });
      }

      // Create and save the new building
      const newBuilding = new Building({
        name,
        description,
        CategoryId  // Assign the category reference (ID)
      });

      // Save the new building to the database
      await newBuilding.save();

      // Populate the CategoryId field with the actual category data (category name, etc.)
      const populatedBuilding = await Building.findById(newBuilding._id)
                                                .populate('CategoryId', 'name');  // Populate only 'name' of the category

      res.status(201).json({
        success: true,
        message: "Building added successfully",
        data: populatedBuilding  // This will now include the full category data
      });
    } catch (error) {
      console.error(error); // Log the error for better debugging
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
};
  

// Get All Buildings (GET)
const getAllBuildings = async (req, res) => {
    try {
      const buildings = await Building.find().populate('CategoryId', 'name');  // Populate CategoryId with category name
      if (buildings.length === 0) {
        return res.status(404).json({ success: false, message: "No buildings found" });
      }
  
      res.status(200).json({
        success: true,
        message: 'Buildings fetched successfully',
        data: buildings
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
  
  // Get Building by ID (GET)
  const getBuildingById = async (req, res) => {
    const { buildingId } = req.params;
  
    try {
      const building = await Building.findById(buildingId).populate('CategoryId', 'name');  // Populate category name
      if (!building) {
        return res.status(404).json({ success: false, message: 'Building not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Building fetched successfully',
        data: building
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


  // Update Building (PATCH)
  const updateBuilding = async (req, res) => {
    const { buildingId } = req.params;
    const { name, description, CategoryId } = req.body;  // Changed buildingCategory to CategoryId
  
    try {
      // Check if the building category exists
      if (CategoryId) {
        const category = await BuildingCategory.findById(CategoryId);
        if (!category) {
          return res.status(404).json({ success: false, message: "Building category not found" });
        }
      }
  
      // Update the building data
      const updatedBuilding = await Building.findByIdAndUpdate(buildingId, { name, description, CategoryId }, { new: true });
  
      if (!updatedBuilding) {
        return res.status(404).json({ success: false, message: 'Building not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Building updated successfully',
        data: updatedBuilding
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



  // Delete Building (DELETE)
  const deleteBuilding = async (req, res) => {
    const { buildingId } = req.params;
  
    try {
      const deletedBuilding = await Building.findByIdAndDelete(buildingId);
      if (!deletedBuilding) {
        return res.status(404).json({ success: false, message: 'Building not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'Building deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
  


module.exports = {addBuilding, getAllBuildings, getBuildingById, updateBuilding, deleteBuilding};