const asyncHandler = require("express-async-handler");
const TasksManagement = require("../Model/TasksManagementModel");
const User = require('../Model/userModel');

const TasksManagementCreate = asyncHandler(async (req, res) => {
  try {
    const {
      taskTitle,
      description,
      assignTo,  // This will be userId
      dueDate,
      priority,
      category,
      status
    } = req.body;

    // Check if user exists
    const user = await User.findById(assignTo);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    // Create new task
    const newTask = new TasksManagement({
      taskTitle,
      description,
      assignTo: user._id,  // set the valid userId
      dueDate,
      priority,
      category,
      status,
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: newTask,
    });

  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the task",
      error: error.message,
    });
  }
});

    
  //GET SINGLE AllProjects
  //METHOD:GET
  const AllTasksManagement = asyncHandler(async (req, res) => {
    const allTasks = await TasksManagement.find()
      .populate({
        path: 'assignTo',
        select: '_id firstName lastName'
      });
  
    if (!allTasks || allTasks.length === 0) {
      res.status(404);
      throw new Error('Tasks not found');
    }
  
    res.status(200).json(allTasks);
  });
    
    
  //GET SINGLE DeleteProjects
  //METHOD:DELETE
  const deleteTasksManagement= async (req, res) => {
      let deleteTasksManagementID = req.params.id
      if (deleteTasksManagement) {
        const deleteTasksManagement= await TasksManagement.findByIdAndDelete(deleteTasksManagementID, req.body);
        res.status(200).json("Delete Checklists Successfully")
      } else {
        res.status(400).json({ message: "Not Delete project" })
      }
    }
    
  
    //GET SINGLE ProjectsUpdate
  //METHOD:PUT
  const UpdateTasksManagement = asyncHandler(async (req, res) => {
    try {
      const allowedFields = [
        'taskTitle',
        'description',
        'assignTo',
        'dueDate',
        'priority',
        'category',
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
  
      // If assignTo is updated, validate the user ID
      if (updateData.assignTo) {
        const user = await User.findById(updateData.assignTo);
        if (!user) {
          return res.status(404).json({ message: 'Assigned user not found' });
        }
      }
  
      const updatedTask = await TasksManagement.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
  
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleTasksManagement = asyncHandler(async (req, res) => {
    try {
      const singleTask = await TasksManagement.findById(req.params.id)
        .populate({
          path: 'assignTo',
          select: '_id firstName lastName'   // Only _id, firstName, lastName
        });
  
      if (!singleTask) {
        return res.status(404).json({ msg: "Task not found" });
      }
  
      res.status(200).json(singleTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "An error occurred while fetching the task" });
    }
  });



module.exports = {TasksManagementCreate,AllTasksManagement,deleteTasksManagement,UpdateTasksManagement,SingleTasksManagement};