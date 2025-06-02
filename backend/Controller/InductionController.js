
const Induction = require("../Model/InductionModel");
const asyncHandler = require("express-async-handler");


const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });

  const createInduction = async (req, res) => {
    const {
      fullName,
      contactNumber,
      emailAddress,
      whiteCardNumber,
      siteLocation,
      siteSupervisor,
      inductionDate,
      accessStartTime,
      accessEndTime,
      status
      //acknowledgements,
    } = req.body;


    let acknowledgements = {};

    // Loop through all keys in req.body and extract those that are under 'acknowledgements' prefix
    for (let key in req.body) {
      if (key.startsWith('acknowledgements[')) {
        const ackKey = key.replace('acknowledgements[', '').replace(']', ''); // Extract the key
        acknowledgements[ackKey] = req.body[key] === 'true'; // Convert to boolean
      }
    }
  
    try {
      let fileUrl = '';
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'uploads', 
          resource_type: 'image',
        });
  
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
        } else {
          console.error('Cloudinary upload failed: No URL returned.');
        }
      } else {
        console.log('No image file uploaded.');
      }
      const newInduction = new Induction({
        fullName,
        contactNumber,
        emailAddress,
        whiteCardNumber,
        siteLocation,
        siteSupervisor,
        inductionDate: new Date(inductionDate),
        accessStartTime,
        accessEndTime,
        acknowledgements,
        status,
        image: fileUrl ? [fileUrl] : [], 
      });
      await newInduction.save();
      res.status(201).json({
        success: true,
        message: 'Induction created successfully',
        induction: newInduction,
      });
    } catch (error) {
      console.error('Error creating induction:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while creating the induction',
        error: error.message,
      });
    }
  };


  const getAllInduction = async (req, res) => {
    try {
      const inductions = await Induction.find(); // Get all induction records
      res.status(200).json({
        success: true,
        message: 'Inductions fetched successfully',
        inductions,
      });
    } catch (error) {
      console.error('Error fetching inductions:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching inductions',
        error: error.message,
      });
    }
  };


  const getInductionById = async (req, res) => {
    const { id } = req.params; // Extract ID from the URL parameters
    try {
      const induction = await Induction.findById(id); // Find induction by ID
  
      if (!induction) {
        return res.status(404).json({
          success: false,
          message: 'Induction not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Induction fetched successfully',
        induction,
      });
    } catch (error) {
      console.error('Error fetching induction:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching the induction',
        error: error.message,
      });
    }
  };


  const updateInduction = async (req, res) => {
    const { id } = req.params; // Extract ID from the URL parameters
    const { 
      fullName, 
      contactNumber, 
      emailAddress, 
      whiteCardNumber, 
      siteLocation, 
      siteSupervisor, 
      inductionDate, 
      accessStartTime,
      accessEndTime,
      workeractive,
      workerinactive

      //acknowledgements 
    } = req.body;

    
    let acknowledgements = {};

    // Loop through all keys in req.body and extract those that are under 'acknowledgements' prefix
    for (let key in req.body) {
      if (key.startsWith('acknowledgements[')) {
        const ackKey = key.replace('acknowledgements[', '').replace(']', ''); // Extract the key
        acknowledgements[ackKey] = req.body[key] === 'true'; // Convert to boolean
      }
    }
  
    try {
      let fileUrl = '';
  
      // Check if an image file is uploaded and handle Cloudinary upload
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
  
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'uploads', // Specify the folder in Cloudinary
          resource_type: 'image',
        });
  
        // Check if the upload was successful and retrieve the URL
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
        } else {
          console.error('Cloudinary upload failed: No URL returned.');
        }
      } else {
        console.log('No new image file uploaded.');
      }
  
      // Update the Induction record
      const updatedInduction = await Induction.findByIdAndUpdate(
        id,
        {
          fullName,
          contactNumber,
          emailAddress,
          whiteCardNumber,
          siteLocation,
          siteSupervisor,
          inductionDate: new Date(inductionDate),
          accessStartTime,
          accessEndTime,

          acknowledgements,
          workeractive,
          workerinactive,
          image: fileUrl ? [fileUrl] : [], // Update image if a new one is uploaded
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedInduction) {
        return res.status(404).json({
          success: false,
          message: 'Induction not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Induction updated successfully',
        induction: updatedInduction,
      });

    } catch (error) {
      console.error('Error updating induction:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while updating the induction',
        error: error.message,
      });
    }
  };
  
    
  const deleteInduction = async (req, res) => {
    const { id } = req.params; // Extract ID from the URL parameters
  
    try {
      const deletedInduction = await Induction.findByIdAndDelete(id); // Delete induction by ID
  
      if (!deletedInduction) {
        return res.status(404).json({
          success: false,
          message: 'Induction not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Induction deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting induction:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while deleting the induction',
        error: error.message,
      });
    }
  };



  const getInductions = async (req, res) => {
    const { search } = req.query; // Optional search query
  
    try {
      const query = search
        ? { $or: [{ fullName: { $regex: search, $options: 'i' } }, { siteLocation: { $regex: search, $options: 'i' } }] }
        : {}; // Search by fullName or siteLocation
  
      const inductions = await Induction.find(query).sort({ inductionDate: -1 }); // Sort by induction date, newest first
  
      res.status(200).json({
        success: true,
        inductions,
      });
    } catch (error) {
      console.error('Error fetching inductions:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching inductions',
        error: error.message,
      });
    }
  };
  
  


module.exports = {createInduction, getAllInduction, getInductionById, updateInduction, deleteInduction, getInductions};
