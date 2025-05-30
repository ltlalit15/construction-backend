// const asyncHandler = require('express-async-handler');
// const Incidents = require('../Model/IncidentModel');
// const Tasks = require('../Model/TasksManagementModel');  // Added Tasks model
// const Projects = require('../Model/projectsModel');
// const Documents = require('../Model/DocumentsModel');

// const getDashboardData = asyncHandler(async (req, res) => {
//   try {
//     // Active Incidents (incidents that are 'In Progress' or 'Needs Immediate Action')
//     const activeIncidentsCount = await Incidents.countDocuments({ 
//       status: { $in: ['In Progress', 'Needs Immediate Action'] }
//     });

//     // High priority incidents
//     const highPriorityIncidentsCount = await Incidents.countDocuments({ priority: 'high' });

//     // Safety Incidents needing immediate action
//     const safetyIncidentsCount = await Incidents.countDocuments({ status: 'Needs Immediate Action' });

//     // Open Tasks count
//     const openTasksCount = await Tasks.countDocuments({ status: 'open' });

//     // High priority tasks
//     const highPriorityTasksCount = await Tasks.countDocuments({ priority: 'high' });

//     // Fetch specific project info (example)
//     const projectInfo = await Projects.findOne({ _id: req.params.projectId });

//     // Fetch recent incidents, project deadlines, and document approvals
//     const recentAlerts = {
//       safetyIncidents: await Incidents.find({}).sort({ createdAt: -1 }).limit(3),  // Latest incidents
//       projectDeadline: await Projects.find({}).where('endDate').lt(new Date()).limit(3),  // Projects with passed deadlines
//       documentApprovals: await Documents.find({ status: 'Approved' }).sort({ updatedAt: -1 }).limit(3)  // Recently approved documents
//     };

//     // Safety performance & defect status (example of safety performance and defect status)
//     const safetyPerformance = {
//       defectStatus: '1 defect needs immediate action'
//     };

//     res.status(200).json({
//       success: true,
//       data: {
//         activeIncidentsCount,
//         highPriorityIncidentsCount,
//         safetyIncidentsCount,
//         openTasksCount,  // Added open tasks count
//         highPriorityTasksCount,  // Added high priority tasks count
//         projectInfo,
//         recentAlerts,
//         safetyPerformance,
//       }
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching dashboard data',
//       error: error.message
//     });
//   }
// });


const asyncHandler = require("express-async-handler");
const Projects = require("../Model/projectsModel");
const TasksManagement = require("../Model/TasksManagementModel");
const Incident = require("../Model/IncidentModel");

// Dashboard controller
const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const activeProjects = await Projects.countDocuments({ status: 'In Progress' });
    const thisWeekProjects = await Projects.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }});

    const openTasks = await TasksManagement.countDocuments({ status: 'open' });
    const highPriorityTasks = await TasksManagement.countDocuments({ status: 'open', priority: 'high' });

    const safetyIncidents = await Incident.countDocuments();
    const criticalIncidents = await Incident.countDocuments({ severity: 'high' });

    const monthlyReports = await Incident.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }});
    const pendingReports = await Incident.countDocuments({ reportStatus: 'pending' });

    const project = await Projects.findOne({ status: 'In Progress' }).sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        metrics: {
          activeProjects,
          thisWeekProjects,
          openTasks,
          highPriorityTasks,
          safetyIncidents,
          criticalIncidents,
          monthlyReports,
          pendingReports,
        },
        project
      }
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: err.message
    });
  }
});



module.exports = { getDashboardData };
