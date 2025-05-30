const asyncHandler = require('express-async-handler');
const Defect = require('../Model/DefectListsModel');
//const Projects = require("../Model/projectsModel");
const User = require("../Model/userModel");
//const Category = require("../Model/categoryModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const DefectCreate = asyncHandler(async (req, res) => {
  const {
    title,
    trade,
    //project,     // Project ID
    location,
    //category,    // Category ID
    assigned,    // User ID
    priority,
    description,
    status,
    date,
  } = req.body;

  try {
    // Validate assigned user
    const user = await User.findById(assigned);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    // // Validate category
    // const cat = await Category.findById(category);
    // if (!cat) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Category not found",
    //   });
    // }

    // // Validate project
    // const proj = await Projects.findById(project);
    // if (!proj) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Project not found",
    //   });
    // }

    let imageUrls = [];

    // Upload images to Cloudinary
    if (req.files && req.files.image) {
      const files = Array.isArray(req.files.image)
        ? req.files.image
        : [req.files.image];

      for (const file of files) {
        const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: "Defect_uploads",
          resource_type: "image",
        });

        if (uploadResult.secure_url) {
          imageUrls.push(uploadResult.secure_url);
        }
      }
    }

    const newDefect = new Defect({
      title,
      trade,
      //project,
      location,
      //category,
      assigned,
      priority,
      description,
      status,
      date,
      image: imageUrls,
    });

    await newDefect.save();

    res.status(201).json({
      success: true,
      message: "Defect created successfully",
      defect: newDefect,
    });
  } catch (error) {
    console.error("Error creating Defect:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the Defect",
      error: error.message,
    });
  }
});


  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllDefect = async (req, res) => {
    try {
      const allDefects = await Defect.find()
        // .populate({
        //   path: 'project',
        //   select: 'name', // Assuming "title" is the name of the project
        //   model: 'Projects'
        // })
        // .populate({
        //   path: 'category',
        //   select: 'category',
        //   model: 'Category'
        // })
        .populate({
          path: 'assigned',
          select: 'firstName lastName',
          model: 'User'
        });
  
      if (!allDefects || allDefects.length === 0) {
        return res.status(404).json({ success: false, message: "No defects found" });
      }
  
      res.status(200).json({
        success: true,
        defects: allDefects,
      });
  
    } catch (error) {
      console.error("Error fetching defects:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching defects",
        error: error.message,
      });
    }
  };
  
      
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteDefect = async (req, res) => {
      let deleteDefectID = req.params.id
      if (deleteDefect) {
        const deleteDefect = await Defect.findByIdAndDelete(deleteDefectID, req.body);
        res.status(200).json({status: true, message:"Delete Defect Successfully"});
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateDefect = asyncHandler(async (req, res) => {
    const {
      title,
      trade,
     // project,     // Project ID
      location,
      //category,    // Category ID
      assigned,    // User ID
      priority,
      description,
      status,
      date,
    } = req.body;
  
    try {
      // Validate assigned user if provided
      if (assigned) {
        const user = await User.findById(assigned);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "Assigned user not found",
          });
        }
      }
  
      // // Validate category if provided
      // if (category) {
      //   const cat = await Category.findById(category);
      //   if (!cat) {
      //     return res.status(400).json({
      //       success: false,
      //       message: "Category not found",
      //     });
      //   }
      // }
  
      // // Validate project if provided
      // if (project) {
      //   const proj = await Projects.findById(project);
      //   if (!proj) {
      //     return res.status(400).json({
      //       success: false,
      //       message: "Project not found",
      //     });
      //   }
      // }
  
      // Prepare update fields
      const updateFields = {
        title,
        trade,
        //project,
        location,
       // category,
        assigned,
        priority,
        description,
        status,
        date,
      };
  
      // Remove undefined fields
      Object.keys(updateFields).forEach((key) => {
        if (updateFields[key] === undefined) {
          delete updateFields[key];
        }
      });
  
      // Handle image uploads if any
      if (req.files && req.files.image) {
        const imageUrls = [];
        const files = Array.isArray(req.files.image)
          ? req.files.image
          : [req.files.image];
  
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "Defect_uploads",
            resource_type: "image",
          });
  
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
  
        updateFields.image = imageUrls;
      }
  
      // Update defect record
      const updatedDefect = await Defect.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      );
  
      if (!updatedDefect) {
        return res.status(404).json({
          success: false,
          message: "Defect not found",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Defect updated successfully",
        defect: updatedDefect,
      });
    } catch (error) {
      console.error("Error updating Defect:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the Defect",
        error: error.message,
      });
    }
  });
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleDefect = async (req, res) => {
    try {
      const singleDefect = await Defect.findById(req.params.id)
        // .populate({
        //   path: 'project',
        //   select: 'title', // Replace with correct field name for project title
        //   model: 'Projects'
        // })
        // .populate({
        //   path: 'category',
        //   select: 'category',
        //   model: 'Category'
        // })
        .populate({
          path: 'assigned',
          select: 'firstName lastName',
          model: 'User'
        });
  
      if (!singleDefect) {
        return res.status(404).json({ success: false, message: "Defect not found" });
      }
  
      res.status(200).json({
        success: true,
        defect: singleDefect
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error while fetching defect",
        error: error.message,
      });
    }
  };
  



  module.exports = {DefectCreate,AllDefect,deleteDefect,UpdateDefect,SingleDefect};
