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

const getDashboardData = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ========== ACTIVE PROJECTS ==========
    const activeProjects = await Projects.countDocuments({ status: /in progress/i });
    const lastDayActiveProjects = await Projects.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneDayAgo },
    });
    const lastWeekActiveProjects = await Projects.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneWeekAgo },
    });
    const lastMonthActiveProjects = await Projects.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneMonthAgo },
    });

    // ========== OVERDUE PROJECTS (NOT COMPLETED) ==========
    const overdueProjects = await Projects.find({
      endDate: { $lt: now },
      status: { $not: /^Completed$/i },
    });

    // ========== OPEN TASKS ==========
    const openTasks = await TasksManagement.countDocuments({ status: /in progress/i });
    const tasksLastDay = await TasksManagement.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneDayAgo },
    });
    const tasksLastWeek = await TasksManagement.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneWeekAgo },
    });
    const tasksLastMonth = await TasksManagement.countDocuments({
      status: /in progress/i,
      createdAt: { $gte: oneMonthAgo },
    });

    const highPriorityTasks = await TasksManagement.countDocuments({
      status: /in progress/i,
      priority: 'high',
    });

    // ========== INCIDENTS ==========
    const totalIncidents = await Incident.countDocuments();
    const criticalIncidents = await Incident.countDocuments({ severity: 'high' });
    const incidentsLastDay = await Incident.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const incidentsLastWeek = await Incident.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const incidentsLastMonth = await Incident.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    const monthlyReports = await Incident.countDocuments({ createdAt: { $gte: startOfMonth } });
    const pendingReports = await Incident.countDocuments({ reportStatus: 'pending' });

    // ========== LATEST ACTIVE PROJECT ==========
    const latestProject = await Projects.findOne({ status: /in progress/i }).sort({ startDate: -1 });

    // ========== RESPONSE ==========
    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        metrics: {
          activeProjects,
          lastDayActiveProjects,
          lastWeekActiveProjects,
          lastMonthActiveProjects,

          overdueProjectsCount: overdueProjects.length,

          openTasks,
          tasksLastDay,
          tasksLastWeek,
          tasksLastMonth,

          highPriorityTasks,

          totalIncidents,
          criticalIncidents,
          incidentsLastDay,
          incidentsLastWeek,
          incidentsLastMonth,

          monthlyReports,
          pendingReports
        },
        project: latestProject,
        overdueProjectsList: overdueProjects // full list if needed in frontend
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
