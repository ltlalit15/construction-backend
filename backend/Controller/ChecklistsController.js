const asyncHandler = require("express-async-handler");
const Checklists = require("../Model/ChecklistsModel");
const User = require("../Model/userModel");
const Projects = require("../Model/projectsModel");

const ChecklistsCreate = asyncHandler(async (req, res) => {
  const {
    checklistName,
    project,
    AssignTo,
    date,
    checklistItems,
    status,
    additionalNotes
  } = req.body;

  // Validate required fields
  if (
    !checklistName ||
    !project ||
    !AssignTo ||
    !date ||
    !checklistItems ||
    !status ||
    !additionalNotes
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Parse checklistItems if it's a string (expected format)
  let parsedChecklistItems = [];
  try {
    parsedChecklistItems = JSON.parse(checklistItems);

    // Ensure checklistItems is an array
    if (!Array.isArray(parsedChecklistItems)) {
      return res.status(400).json({ message: "checklistItems must be an array" });
    }
  } catch (err) {
    return res.status(400).json({ message: "Invalid checklistItems format" });
  }

  // Validate User (AssignTo)
  const userExists = await User.findById(AssignTo);
  if (!userExists) {
    return res.status(404).json({ message: "Assigned user not found" });
  }

  // Validate Project
  const projectExists = await Projects.findById(project);
  if (!projectExists) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Create Checklist
  const newChecklist = await Checklists.create({
    checklistName,
    project,
    AssignTo,
    date,
    checklistItems: parsedChecklistItems,
    status,
    additionalNotes,
  });

  res.status(201).json({
    success: true,
    message: "Checklist created successfully",
    checklist: newChecklist,
  });
});


  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllChecklists = async (req, res) => {
    try {
      // Find all checklists and populate the relevant fields from User and Projects
      const allChecklists = await Checklists.find()
        .populate({
          path: 'AssignTo', // This is the User reference in your Checklists schema
          select: 'firstName lastName', // Select only the firstName and lastName fields
        })
        .populate({
          path: 'project', // This is the Projects reference in your Checklists schema
          select: 'name', // Select only the name field from Projects
        });
  
      // Check if checklists were found
      if (!allChecklists || allChecklists.length === 0) {
        res.status(404).json({ message: "Checklists Not Found" });
        return;
      }
  
      // Return the populated checklists
      res.json(allChecklists);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };
  
    
  
  
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteChecklists = async (req, res) => {
      let deleteChecklistsID = req.params.id
      if (deleteChecklists) {
        const deleteChecklists = await Checklists.findByIdAndDelete(deleteChecklistsID, req.body);
        res.status(200).json("Delete Checklists Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateChecklists = asyncHandler(async (req, res) => {
    try {
      const checklistId = req.params.id; // Get the checklist ID from URL params
      const {
        checklistName,
        project,
        AssignTo,
        date,
        checklistItems,
        status,
        additionalNotes
      } = req.body;
  
      // Validate required fields
      if (
        !checklistName ||
        !project ||
        !AssignTo ||
        !date ||
        !checklistItems ||
        !status ||
        !additionalNotes
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Parse checklistItems if it's a string (expected format)
      let parsedChecklistItems = [];
      try {
        parsedChecklistItems = JSON.parse(checklistItems);
  
        // Ensure checklistItems is an array
        if (!Array.isArray(parsedChecklistItems)) {
          return res.status(400).json({ message: "checklistItems must be an array" });
        }
      } catch (err) {
        return res.status(400).json({ message: "Invalid checklistItems format" });
      }
  
      // Validate User (AssignTo)
      const userExists = await User.findById(AssignTo);
      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
  
      // Validate Project
      const projectExists = await Projects.findById(project);
      if (!projectExists) {
        return res.status(404).json({ message: "Project not found" });
      }
  
      // Update Checklist
      const updatedChecklist = await Checklists.findByIdAndUpdate(
        checklistId, 
        {
          checklistName,
          project,
          AssignTo,
          date,
          checklistItems: parsedChecklistItems,
          status,
          additionalNotes,
        },
        { new: true }
      );
  
      if (!updatedChecklist) {
        return res.status(404).json({ message: "Checklist not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Checklist updated successfully",
        checklist: updatedChecklist,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleChecklists = async (req, res) => {
    try {
      // Find a single checklist by its ID and populate the relevant fields from User and Project
      const singleChecklist = await Checklists.findById(req.params.id)
        .populate({
          path: 'AssignTo', // This is the User reference in your Checklists schema
          select: 'firstName lastName', // Select only the firstName and lastName fields
        })
        .populate({
          path: 'project', // This is the Projects reference in your Checklists schema
          select: 'name', // Select only the name field from Projects
        });
  
      // Check if the checklist was found
      if (!singleChecklist) {
        return res.status(404).json({ message: "Checklist Not Found" });
      }
  
      // Return the populated checklist
      res.status(200).json(singleChecklist);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };



  
module.exports = {ChecklistsCreate,AllChecklists,deleteChecklists,UpdateChecklists,SingleChecklists};