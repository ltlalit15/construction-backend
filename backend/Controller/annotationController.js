const Annotation = require("../Model/annotationModel");
const asyncHandler = require("express-async-handler");


const createAnnotation = asyncHandler(async (req, res) => {
    const { title, description, author } = req.body;
  
    if (!title || !description || !author) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }
  
    const newAnnotation = new Annotation({ title, description, author });
    await newAnnotation.save();
  
    res.status(201).json({
      success: true,
      message: "Annotation created successfully",
      data: newAnnotation
    });
  });



  // Get all annotations
const getAllAnnotations = asyncHandler(async (req, res) => {
    const annotations = await Annotation.find().sort({ createdAt: -1 });
  
    res.status(200).json({
      success: true,
      message: "All annotations fetched successfully",
      data: annotations
    });
  });


// Get single annotation by ID
const getAnnotationById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const annotation = await Annotation.findById(id);
  
    if (!annotation) {
      return res.status(404).json({
        success: false,
        message: "Annotation not found"
      });
    }
  
    res.status(200).json({
      success: true,
      message: "Annotation fetched successfully",
      data: annotation
    });
});


// Update annotation
const updateAnnotation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, author } = req.body;
  
    const annotation = await Annotation.findById(id);
  
    if (!annotation) {
      return res.status(404).json({
        success: false,
        message: "Annotation not found"
      });
    }
  
    annotation.title = title || annotation.title;
    annotation.description = description || annotation.description;
    annotation.author = author || annotation.author;
  
    const updatedAnnotation = await annotation.save();
  
    res.status(200).json({
      success: true,
      message: "Annotation updated successfully",
      data: updatedAnnotation
    });
});



const deleteAnnotation = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const annotation = await Annotation.findById(id);
  
    if (!annotation) {
      return res.status(404).json({
        success: false,
        message: "Annotation not found" 
      });
    }
  
    await annotation.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "Annotation deleted successfully",
      id
    });
});
  



module.exports = {createAnnotation,getAllAnnotations,getAnnotationById,updateAnnotation,deleteAnnotation};






