const Projects = require('../Model/projectsModel');
const User = require("../Model/userModel");
const asyncHandler = require("express-async-handler");

const ProjectsCreate = asyncHandler(async (req, res) => {

  const { name, assignedTo, startDate, endDate, status, priority, Progress, description } = req.body;

  if (!name || !assignedTo || !startDate || !endDate || !status || !priority || !Progress || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ Check if the assigned user exists
  const user = await User.findById(assignedTo);
  if (!user) {
    return res.status(404).json({ message: 'Assigned user not found' });
  }


  const newProject = await Projects.create({
    name,
    assignedTo,
    startDate,
    endDate,
    status,
    priority,
    Progress,
    description
  });

  res.status(201).json(newProject);
});


//GET SINGLE AllProjects
//METHOD:GET
const Allprojects = async (req, res) => {
  try {
    const allProjects = await Projects.find().populate('assignedTo', 'firstName lastName');

    if (!allProjects || allProjects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }

    const modifiedProjects = allProjects.map(project => {
      const user = project.assignedTo;
      return {
        ...project.toObject(),
        assignedTo: user ? {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName
        } : null
      };
    });

    res.json(modifiedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//GET SINGLE DeleteProjects
//METHOD:DELETE
const deleteprojects = async (req, res) => {
  let deleteprojectsID = req.params.id
  if (deleteprojects) {
    const deleteprojects = await Projects.findByIdAndDelete(deleteprojectsID, req.body);
    res.status(200).json("Delete Projects Successfully")
  } else {
    res.status(400).json({ message: "Not Delete project" })
  }
}


//GET SINGLE ProjectsUpdate
//METHOD:PUT
const projectsUpdate = asyncHandler(async (req, res) => {
  const {
    name,
    assignedTo,
    startDate,
    endDate,
    status,
    priority,
    Progress,
    description
  } = req.body;

  // ✅ Validate required fields
  if (
    !name ||
    !assignedTo ||
    !startDate ||
    !endDate ||
    !status ||
    !priority ||
    !Progress ||
    !description
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ Check if the assigned user exists
  const user = await User.findById(assignedTo);
  if (!user) {
    return res.status(404).json({ message: 'Assigned user not found' });
  }

  // ✅ Prepare update data
  const updateData = {
    name,
    assignedTo,
    startDate,
    endDate,
    status,
    priority,
    Progress,
    description
  };

  // ✅ Update the project
  const updatedProject = await Projects.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!updatedProject) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Project updated successfully',
    data: updatedProject
  });
});



//METHOD:Single
//TYPE:PUBLIC
// const projectsSingle=async(req,res)=>{
//     try {
//         const projectsSingle= await Projects.findById(req.params.id);
//         res.status(200).json(projectsSingle)
//     } catch (error) {
//         res.status(404).json({msg:"Can t Find Projects"} )
//     }
// }


// METHOD: GET
// ROUTE: /api/projects/assigned/:id
// DESC: Get 10 projects assigned to a specific user


const projectsSingle = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Projects.findById(projectId)
      .populate('assignedTo', 'firstName lastName');

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const user = project.assignedTo;
    const modifiedProject = {
      ...project.toObject(),
      assignedTo: user ? {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName
      } : null
    };

    res.status(200).json(modifiedProject);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// METHOD: GET
// ROUTE: /api/projects/by-user/:id
const getProjectsByUser = async (req, res) => {
  try {
    const assignedUserId = req.params.id;

    const projects = await Projects.find({ assignedTo: assignedUserId })
      .sort({ createdAt: -1 }) // latest first
      .limit(10);

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user" });
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




module.exports = { ProjectsCreate, Allprojects, deleteprojects, projectsUpdate, projectsSingle, getProjectsByUser };