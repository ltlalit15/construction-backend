const asyncHandler = require('express-async-handler');
const PlantMachineryEquipment = require('../Model/PlantMachineryEquipmentModel');


const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const EquipmentCreate = asyncHandler(async (req, res) => {
    let {
        equipmentID,
        name,
        type,
        location,
        purchaseDate,
        purchaseCost,
        description,
    } = req.body; 
  
    try {
      let imageUrls = [];
      // Handle image uploads
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "PlantMachinery_uploads",
            resource_type: "image",
          });
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
      // Create and save PlantMachinery record
      const newPlantMachinery = new PlantMachineryEquipment({
        equipmentID,
        name,
        type,
        location,
        purchaseDate,
        purchaseCost,
        description,
        image:imageUrls,
      });
  
      await newPlantMachinery.save();
  
      res.status(201).json({
        success: true,
        message: "PlantMachinery created successfully",
        PlantMachinery: newPlantMachinery,
      });
    } catch (error) {
      console.error("Error creating PlantMachinery:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the PlantMachinery",
        error: error.message,
      });
    }
  });
   

//GET SINGLE AllPlantMachinerys
//METHOD:GET
const AllEquipment = async (req, res) => {
    const AllEquipment = await PlantMachineryEquipment.find()
    if (AllEquipment === null) {
        res.status(404)
        throw new Error("Categories Not Found")
    }
    res.json(AllEquipment)
}


//GET SINGLE DeletePPlantMachinerys
//METHOD:DELETE
const deleteEquipment = async (req, res) => {
    let deleteEquipmentID = req.params.id
    if (deleteEquipment) {
        const deleteEquipment = await PlantMachineryEquipment.findByIdAndDelete(deleteEquipmentID, req.body);
        res.status(200).json("Delete PlantMachinerys Successfully")
    } else {
        res.status(400).json({ message: "Not Delete PlantMachinerys" })
    }
}


//GET SINGLE PlantMachinerysUpdate
//METHOD:PUT
const UpdateEquipment = asyncHandler(async (req, res) => {
    try {
      console.log('Incoming request body:', req.body);
      console.log('Incoming request params:', req.params); 
      const allowedFields = [
        'equipmentID',
        'name',
        'type',
        'location',
        'purchaseDate',
        'purchaseCost',
        'description',
      ];
  
      const updateData = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          if (field === 'InspectionItems') {
            try {
              updateData[field] = typeof req.body[field] === 'string'
                ? JSON.parse(req.body[field])
                : req.body[field];
            } catch (err) {
              return res.status(400).json({
                message: 'Invalid JSON format in InspectionItems',
              });
            }
          } else {
            updateData[field] = req.body[field];
          }
        }
      });
  
      console.log('Update data:', updateData); 
  
      // Handle image update
      let imageUrls = [];
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'PlantMachinery_uploads',
            resource_type: 'image',
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
        updateData.image = imageUrls; // Set the uploaded image URLs
      }
  
      console.log('Updated data with images:', updateData); // Log data with images
  
      // Ensure at least one field is provided for the update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          message: 'At least one field must be provided for update',
        });
      }
  
      // Find and update the record
      const updatedPlantMachinery = await PlantMachineryEquipment.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      console.log('Updated PlantMachinery:', updatedPlantMachinery); // Log the updated document
  
      if (!updatedPlantMachinery) {
        return res.status(404).json({ message: 'PlantMachinery record not found' });
      }
  
      res.status(200).json({
        success: true,
        message: 'PlantMachinery updated successfully',
        PlantMachinery: updatedPlantMachinery,
      });
  
    } catch (error) {
      console.error('Error updating PlantMachinery:', error);
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  });


//METHOD:Single
//TYPE:PUBLIC
const SingleEquipment = async (req, res) => {
    try {
        const SingleEquipment = await PlantMachineryEquipment.findById(req.params.id);
        res.status(200).json(SingleEquipment)
    } catch (error) {
        res.status(404).json({ msg: "Can t Find Projects" })
    }
}



module.exports = { EquipmentCreate, AllEquipment, deleteEquipment, UpdateEquipment, SingleEquipment };