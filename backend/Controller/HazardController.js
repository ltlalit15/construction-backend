const asyncHandler = require("express-async-handler");

const Hazard=require("../Model/HazardModel")

const Projects = require("../Model/projectsModel");
const TasksManagement = require("../Model/TasksManagementModel");


// CREATE Hazard
const createHazard = asyncHandler(async (req, res) => {
  const { hazardDescription, severityLevel, likelihood, additionalNotes, responsiblePerson, controlVerification, controlMeasure, status, implementationDate  } = req.body;



  // Create a new hazard
  const newHazard = await Hazard.create({
    hazardDescription,
    severityLevel,
    likelihood,
    additionalNotes,
    responsiblePerson,
    controlVerification,
    controlMeasure,
    status,
    implementationDate

  });

  res.status(201).json({
    status: true,
    message: "Hazard created successfully",
    data: newHazard,
  });
});

// GET ALL Hazards
const getAllHazards = async (req, res) => {
  try {
    const hazards = await Hazard.find();

    if (!hazards || hazards.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No hazards found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched hazards successfully",
      data: hazards,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE Hazard
const getSingleHazard = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        status: false,
        message: "Hazard not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Fetched hazard successfully",
      data: hazard,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching hazard",
      error: error.message,
    });
  }
};

// UPDATE Hazard
const updateHazard = async (req, res) => {
  const { id } = req.params;
  const { hazardDescription, severityLevel, likelihood, additionalNotes, responsiblePerson, controlVerification, controlMeasure, status, implementationDate } = req.body;

  try {
    const updatedHazard = await Hazard.findByIdAndUpdate(
      id,
      { hazardDescription, severityLevel, likelihood, additionalNotes, responsiblePerson, controlVerification, controlMeasure, status, implementationDate },
      { new: true } // Return the updated document
    );

    if (!updatedHazard) {
      return res.status(404).json({
        status: false,
        message: "Hazard not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Hazard updated successfully",
      data: updatedHazard,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE Hazard
const deleteHazard = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedHazard = await Hazard.findByIdAndDelete(id);

    if (!deletedHazard) {
      return res.status(404).json({
        status: false,
        message: "Hazard not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Hazard deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting hazard",
      error: error.message,
    });
  }
};

const getAllProjectsWithTasksAndHazards = asyncHandler(async (req, res) => {
  try {
    // Fetch all projects and populate tasks, and hazards for each task
    const projects = await Projects.find() // Query the Projects model
      .populate({
        path: 'tasks', // Populate tasks field in the project
        model: 'TasksManagement', // Refer to the TasksManagement model
        populate: {
          path: 'hazards', // Populate hazards for each task
          model: 'Hazard', // Refer to the Hazard model
        },
      })
      .exec(); // Execute the query

    // Check if projects exist
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No projects found",
      });
    }

    // Send response with the populated project, task, and hazard data
    res.status(200).json({
      status: true,
      message: "Fetched all projects with tasks and hazards successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching all projects with tasks and hazards",
      error: error.message,
    });
  }
});





module.exports = { createHazard, getAllHazards, getSingleHazard, updateHazard, deleteHazard, getAllProjectsWithTasksAndHazards };


