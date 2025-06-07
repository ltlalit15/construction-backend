const asyncHandler = require("express-async-handler");
const Diaries = require("../Model/DiariesModel");
const Projects = require("../Model/projectsModel");
const mongoose = require("mongoose");



const DiariesCreate = asyncHandler(async (req, res) => {
  const { date, projectName, supervisorName, weather, workPerformed, issuesDelays, status } = req.body;

  if (!date || !projectName || !supervisorName || !weather || !workPerformed || !issuesDelays || !status) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate projectName is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(projectName)) {
    return res.status(400).json({ message: 'Invalid projectName ID' });
  }

  // Check if Project exists
  const projectExists = await Projects.findById(projectName);
  if (!projectExists) {
    return res.status(404).json({ message: 'Project not found' });
  }

  const newDiaries = await Diaries.create({
    date,
    projectName,
    supervisorName,
    weather,
    workPerformed,
    issuesDelays,
    status
  });

  res.status(201).json(newDiaries);
});

  
  
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllDiaries = async (req, res) => {
  try {
    const diaries = await Diaries.find()
      .populate("projectName", "name"); // Populate project name only

    if (!diaries || diaries.length === 0) {
      return res.status(404).json({ message: "No Diaries found" });
    }

    res.status(200).json(diaries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Diaries", error: error.message });
  }
};
    
    
      //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteDiaries = async (req, res) => {
      let deleteDiariesID = req.params.id
      if (deleteDiaries) {
        const deleteDiaries = await Diaries.findByIdAndDelete(deleteDiariesID, req.body);
        res.status(200).json({status: true, message: "Delete Diaries Successfully"});
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
 const UpdateDiaries = async (req, res) => {
  try {
    const allowedFields = [
      'date',
      'projectName',
      'supervisorName',
      'weather',
      'workPerformed',
      'issuesDelays',
      'status'
    ];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'At least one field must be provided for update' });
    }

    // If projectName is in update, validate it
    if (updateData.projectName) {
      if (!mongoose.Types.ObjectId.isValid(updateData.projectName)) {
        return res.status(400).json({ message: 'Invalid projectName ID' });
      }
      const projectExists = await Projects.findById(updateData.projectName);
      if (!projectExists) {
        return res.status(404).json({ message: 'Project not found' });
      }
    }

    const updatedDiary = await Diaries.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedDiary) {
      return res.status(404).json({ message: 'Diary not found' });
    }

    res.status(200).json(updatedDiary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleDiaries = async (req, res) => {
  try {
    const diary = await Diaries.findById(req.params.id)
      .populate("projectName", "name");

    if (!diary) {
      return res.status(404).json({ message: "Diary not found" });
    }

    res.status(200).json(diary);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Diary", error: error.message });
  }
};
  


  module.exports = {DiariesCreate,AllDiaries,deleteDiaries,UpdateDiaries,SingleDiaries};
