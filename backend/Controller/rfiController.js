const RFI = require("../Model/rfiModel");
const User  = require('../Model/userModel');
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });



  // CREATE RFI
  const createRFI = async (req, res) => {
    const { userId, subject, priority, due_date, assignee, department, description, status } = req.body;
    let imageUrl = "";
  
    try {
      // Handle Cloudinary image upload if image is provided
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
  
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: "rfis",
          resource_type: "image",
        });
  
        if (uploadResult && uploadResult.secure_url) {
          imageUrl = uploadResult.secure_url;
        }
      }
  
      // Find the user by firstName
      const user = await User.findOne({ _id: assignee });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Assignee user not found",
        });
      }
  
      // Create and save the new RFI
      const newRFI = new RFI({
        userId,  
        subject,
        priority,
        due_date,
        assignee: user._id,
        department,
        description,
        status,
        image: imageUrl,
      });
  
      const savedRFI = await newRFI.save();
  
      res.status(201).json({
        success: true,
        message: "RFI created successfully",
        data: savedRFI,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating RFI",
        error: error.message,
      });
    }
  };


  // const getAllRFIs = async (req, res) => {
  //   try {
  //     const rfiList = await RFI.find()
  //       .limit(15)
  //       .sort({ createdAt: -1 }) // latest first, optional
  
  //     res.status(200).json({
  //       success: true,
  //       data: rfiList,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error fetching RFIs",
  //       error: error.message,
  //     });
  //   }
  // };


 const getAllRFIs = async (req, res) => {
  try {
    const rfiList = await RFI.find()
      .limit(15)
      .sort({ createdAt: -1 })  // Sort by creation date (latest first)
      .populate("userId", "_id firstName lastName")  // Populate userId with _id, firstName, lastName
      .populate("assignee", "_id firstName lastName"); // Populate assignee with _id, firstName, lastName

    const formattedRFIList = rfiList.map(rfi => {
      const assigneeData = rfi.assignee
        ? {
            _id: rfi.assignee._id,
            firstName: rfi.assignee.firstName,
            lastName: rfi.assignee.lastName,
          }
        : null;  // Change empty string to null if assignee is not present

      return {
        ...rfi._doc,  // Spread the RFI document
        assignee: assigneeData,  // Add the formatted assignee data
      };
    });

    res.status(200).json({
      success: true,
      data: formattedRFIList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching RFIs",
      error: error.message,
    });
  }
};


  


  const getRFIById = async (req, res) => {
  try {
    // Populate both userId and assignee fields with _id, firstName, and lastName from the User model
    const rfi = await RFI.findById(req.params.id)
      .populate('userId', '_id firstName lastName')  // Populate userId with _id, firstName, lastName
      .populate('assignee', '_id firstName lastName');  // Populate assignee with _id, firstName, lastName

    if (!rfi) {
      return res.status(404).json({
        success: false,
        message: "RFI not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rfi,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching RFI",
      error: error.message,
    });
  }
};

  

  const updateRFI = async (req, res) => {
    const { userId, subject, priority, due_date, assignee, department, description, status } = req.body;
    let imageUrl;
  
    try {
      // Check if new image is provided
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
  
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: "rfis",
          resource_type: "image",
        });
  
        if (uploadResult && uploadResult.secure_url) {
          imageUrl = uploadResult.secure_url;
        }
      }
  
      // Find assignee user by firstName
      const user = await User.findOne({ _id: assignee });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Assignee user not found",
        });
      }
  
      // Build update object
      const updateData = {
        userId,
        subject,
        priority,
        due_date,
        assignee: user._id,
        department,
        description,
        status,
      };
  
      if (imageUrl) {
        updateData.image = imageUrl;
      }
  
      // Update the RFI
      const updatedRFI = await RFI.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!updatedRFI) {
        return res.status(404).json({
          success: false,
          message: "RFI not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "RFI updated successfully",
        data: updatedRFI,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating RFI",
        error: error.message,
      });
    }
  };

  

  const deleteRFI = async (req, res) => {
    try {
      const deletedRFI = await RFI.findByIdAndDelete(req.params.id);
  
      if (!deletedRFI) {
        return res.status(404).json({
          success: false,
          message: "RFI not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "RFI deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting RFI",
        error: error.message,
      });
    }
  };



  
  



module.exports = {createRFI, getAllRFIs, getRFIById, updateRFI, deleteRFI};
