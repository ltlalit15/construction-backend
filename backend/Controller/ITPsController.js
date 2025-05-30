const asyncHandler = require('express-async-handler');
const ITPs = require('../Model/ITPsModel');
const Category = require('../Model/categoryModel');
const User = require("../Model/userModel");

const Induction = require("../Model/InductionModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const ITPcCreate = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    taskStage,
    folderLocation,
    folderName,
    description,
    stepDescription,
    qualityStatus,
    reviewerAssignment,
    reviewerComments
  } = req.body;

  try {
    // Validate reviewer (User)
    const reviewerExists = await User.findById(reviewerAssignment);
    if (!reviewerExists) {
      return res.status(404).json({
        success: false,
        message: "Reviewer not found",
      });
    }

    // Validate category (Category)
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let imageUrls = [];

    // Handle image upload
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

    // Create new ITP record
    const newITP = new ITPs({
      title,
      category,
      taskStage,
      folderLocation,
      folder: {
        folderName,
        description,
      },
      stepDescription,
      qualityStatus,
      reviewerAssignment,
      reviewerComments,
      image: imageUrls,
    });

    await newITP.save();

    res.status(201).json({
      success: true,
      message: "ITP created successfully",
      itp: newITP,
    });

  } catch (error) {
    console.error("Error creating ITP:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the ITP",
      error: error.message,
    });
  }
});

//GET SINGLE AllITPs
//METHOD:GET
const AllITPc = async (req, res) => {
  try {
    const allITPs = await ITPs.find()
      .populate('reviewerAssignment', '_id, firstName lastName')
      .populate('category', 'category');

    res.status(200).json({
      success: true,
      data: allITPs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ITPs",
      error: error.message,
    });
  }
};



const getITPs = async (req, res) => {
  try {
    // Fetching only 10 records
    const allITPs = await ITPs.find().limit(10);

    if (!allITPs.length) {
      return res.status(404).json({
        success: false,
        message: "No ITPs found"
      });
    }

    // Respond with the data
    res.status(200).json({
      success: true,
      message: "Fetched 10 ITP records successfully",
      data: allITPs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



//GET SINGLE DeletePITPs
//METHOD:DELETE
const deleteITPc = async (req, res) => {
    let deleteITPcID = req.params.id
    if (deleteITPc) {
        const deleteITPc = await ITPs.findByIdAndDelete(deleteITPcID, req.body);
        res.status(200).json("Delete ITPs Successfully")
    } else {
        res.status(400).json({ message: "Not Delete ITPs" })
    }
}


//GET SINGLE ITPsUpdate
//METHOD:PUT
const UpdateITPc = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    title,
    category,
    taskStage,
    folderLocation,
    folderName,
    description,
    stepDescription,
    qualityStatus,
    reviewerAssignment,
    reviewerComments
  } = req.body;

  try {
    // Check ITP exists
    const existingITP = await ITPs.findById(id);
    if (!existingITP) {
      return res.status(404).json({
        success: false,
        message: "ITP not found",
      });
    }

    // Validate reviewer
    const reviewerExists = await User.findById(reviewerAssignment);
    if (!reviewerExists) {
      return res.status(404).json({
        success: false,
        message: "Reviewer not found",
      });
    }

    // Validate category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle new image upload (if provided)
    let imageUrls = existingITP.image; // preserve existing images unless overwritten
    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image];

      imageUrls = [];
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

    // Update fields
    existingITP.title = title;
    existingITP.category = category;
    existingITP.taskStage = taskStage;
    existingITP.folderLocation = folderLocation;
    existingITP.folder = { folderName, description };
    existingITP.stepDescription = stepDescription;
    existingITP.qualityStatus = qualityStatus;
    existingITP.reviewerAssignment = reviewerAssignment;
    existingITP.reviewerComments = reviewerComments;
    existingITP.image = imageUrls;

    await existingITP.save();

    res.status(200).json({
      success: true,
      message: "ITP updated successfully",
      itp: existingITP,
    });
  } catch (error) {
    console.error("Error updating ITP:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the ITP",
      error: error.message,
    });
  }
});


//METHOD:Single
//TYPE:PUBLIC

const SingleITPc = async (req, res) => {
  try {
    const { id } = req.params;

    const itp = await ITPs.findById(id)
      .populate('reviewerAssignment', '_id firstName lastName')
      .populate('category', 'category');

    if (!itp) {
      return res.status(404).json({
        success: false,
        message: "ITP not found",
      });
    }

    res.status(200).json({
      success: true,
      data: itp,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ITP by ID",
      error: error.message,
    });
  }
};



module.exports = { ITPcCreate, AllITPc, getITPs, deleteITPc, UpdateITPc, SingleITPc };
