const asyncHandler = require('express-async-handler');
const User  = require('../Model/userModel');
const DrawingRegister = require('../Model/DrawingRegisterModel');
const mongoose = require("mongoose");


const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const DrawingRegisterCreate = asyncHandler(async (req, res) => {
  let {
    documentTitle,
    documentType,
    folder,
    assignedTo, // This should be a user ObjectId
    comments,
    status
  } = req.body;

  try {
    // Check if assignedTo is a valid ObjectId
    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignedTo user ID",
      });
    }

    let imageUrls = [];

    // Handle image uploads
    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image];

      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "itp_uploads",
          resource_type: "image",
        });

        if (uploadResult.secure_url) {
          imageUrls.push(uploadResult.secure_url);
        }
      }
    }

    // Create and save Drawing Register record
    const newDrawingRegister = new DrawingRegister({
      documentTitle,
      documentType,
      folder,
      assignedTo,  // Ensure assignedTo is a valid ObjectId
      comments,
      status,
      image: imageUrls,
    });

    await newDrawingRegister.save();

    res.status(201).json({
      success: true,
      message: "Drawing Register created successfully",
      drawingRegister: newDrawingRegister,
    });
  } catch (error) {
    console.error("Error creating Drawing Register:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Drawing Register",
      error: error.message,
    });
  }
});
  
    
    //GET SINGLE AllProjects
    //METHOD:GET
    
    const AllDrawingRegister = asyncHandler(async (req, res) => {
      try {
        const drawingRegisters = await DrawingRegister.find()
          .populate('assignedTo', 'firstName lastName'); // Populate user info
    
        res.status(200).json({
          success: true,
          drawingRegisters,
        });
      } catch (error) {
        console.error("Error fetching drawing registers:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch drawing registers",
          error: error.message,
        });
      }
    });
    
       
    //GET SINGLE DeleteProjects
    //METHOD:DELETE
    const deleteDrawingRegister = async (req, res) => {
        let deleteDrawingRegisterID = req.params.id
        if (deleteDrawingRegister) {
          const deleteDefect = await DrawingRegister.findByIdAndDelete(deleteDrawingRegisterID, req.body);
          res.status(200).json("Delete Defect Successfully")
        } else {
          res.status(400).json({ message: "Not Delete project" })
        }
      }
      
    
      //GET SINGLE ProjectsUpdate
    //METHOD:PUT
    const UpdateDrawingRegister = asyncHandler(async (req, res) => {
      try {
        const allowedFields = [
          'documentTitle',
          'documentType',
          'folder',
          'assignedTo',
          'comments',
          'status'
        ];
    
        const updateData = {};
    
        // Ensure the provided fields are valid and not undefined
        allowedFields.forEach((field) => {
          if (req.body[field] !== undefined) {
            if (field === 'assignedTo') {
              // Check if assignedTo is a valid ObjectId
              if (req.body[field] && !mongoose.Types.ObjectId.isValid(req.body[field])) {
                return res.status(400).json({
                  success: false,
                  message: "Invalid assignedTo user ID",
                });
              }
            }
    
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
    
        // Handle image update (same as in create function)
        let imageUrls = [];
        if (req.files && req.files.image) {
          const files = Array.isArray(req.files.image)
            ? req.files.image
            : [req.files.image];
    
          for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: 'itp_uploads',
              resource_type: 'image',
            });
    
            if (uploadResult.secure_url) {
              imageUrls.push(uploadResult.secure_url);
            }
          }
          updateData.image = imageUrls;  // Include updated images
        }
    
        // Require at least one field to update
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({
            success: false,
            message: 'At least one field must be provided for update',
          });
        }
    
        // Find and update the Drawing Register
        const updatedDrawingRegister = await DrawingRegister.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true } // Return the updated document
        ).populate('assignedTo', 'firstName lastName'); // Populate assignedTo with user info
    
        if (!updatedDrawingRegister) {
          return res.status(404).json({
            success: false,
            message: 'Drawing Register not found',
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'Drawing Register updated successfully',
          drawingRegister: updatedDrawingRegister,
        });

      } catch (error) {
        console.error('Error updating Drawing Register:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    });
    
    
    //METHOD:Single
    //TYPE:PUBLIC
    const SingleDrawingRegister = async (req, res) => {
      try {
        // Find the Drawing Register by ID and populate the assignedTo field
        const singleDrawingRegister = await DrawingRegister.findById(req.params.id)
          .populate('assignedTo', 'firstName lastName'); // Populate assignedTo with firstName and lastName
    
        if (!singleDrawingRegister) {
          return res.status(404).json({
            success: false,
            message: "Drawing Register not found",
          });
        }
    
        // Return the Drawing Register with populated assignedTo fields
        res.status(200).json({
          success: true,
          drawingRegister: singleDrawingRegister,
        });
      } catch (error) {
        console.error("Error fetching Drawing Register:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch Drawing Register",
          error: error.message,
        });
      }
    };
    
  
  


  module.exports = {DrawingRegisterCreate,AllDrawingRegister,deleteDrawingRegister,UpdateDrawingRegister,SingleDrawingRegister}