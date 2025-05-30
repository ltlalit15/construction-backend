// const Projects = require('../Model/projectsModel');
// const RFI = require('../Model/rfiModel');
// const SafetyEquipmentAssignment = require('../Model/safetyModel');
// const TasksManagement = require('../Model/TasksManagementModel');
// const Documents = require('../Model/DocumentsModel');
// const asyncHandler = require("express-async-handler");
const mongoose =require("mongoose");

// const getClientDashboard = asyncHandler(async (req, res) => {
//   const { projectId } = req.params;

//   // Validate the projectId format
//   if (!mongoose.Types.ObjectId.isValid(projectId)) {
//     return res.status(400).json({ success: false, message: "Invalid Project ID format" });
//   }

//   try {
//     const project = await Projects.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ success: false, message: "Project not found" });
//     }

//     const [rfis, safetyReports, tasks, documents] = await Promise.all([
//       RFI.find({ projectId, status: "Pending" }),
//       SafetyEquipmentAssignment.find({ projectId, status: "Pending" }),
//       TasksManagement.find({ projectId }),
//       Documents.find({ projectId })
//     ]);

//     const inProgressSites = project?.sites?.filter(site => site.status === "In Progress").length || 0;

//     // Calculate Pending Tasks once
//     const pendingTasks = tasks.filter(task => task.status === "Pending");
//     const pendingTaskCount = pendingTasks.length;

//     const dashboard = {
//       project: {
//         name: project?.title || "",
//         activeSites: project?.sites?.length || 0,
//         inProgressSites
//       },
//       complianceStatus: {
//         safety: project?.safetyCompliance || "N/A",
//         quality: project?.qualityCompliance || "N/A"
//       },
//       pendingApprovals: {
//         rfis: rfis.length,
//         safetyReports: safetyReports.length,
//         taskApprovals: pendingTaskCount
//       },
//       recentActivity: project?.activityLog?.slice(-3).reverse() || [],
//       documents: documents.map(doc => doc.name),
//       tasksAndApprovals: {
//         assignedTasks: tasks.map(task => ({
//           title: task.title,
//           due: task.dueDate,
//           status: task.status
//         }))
//       },
//       reportsAndDocuments: {
//         downloadableReports: documents.filter(d => d.type === "report").map(d => d.name),
//         documentViewer: documents.filter(d => d.type === "view").map(d => d.name),
//         versionControl: documents.filter(d => d.version).map(d => ({
//           name: d.name,
//           date: new Date(d.updatedAt).toLocaleDateString('en-GB')  // User-friendly date format
//         }))
//       }
//     };

//     res.status(200).json({ success: true, data: dashboard });
//   } catch (error) {
//     // In development, you might want to include the stack trace
//     const errorMessage = process.env.NODE_ENV === 'development' ? error.stack : error.message;
//     res.status(500).json({
//       success: false,
//       message: "Error fetching client dashboard",
//       error: errorMessage
//     });
//   }
// });


const asyncHandler = require("express-async-handler");
const Projects = require("../Model/projectsModel");
const Tasks = require("../Model/TasksManagementModel");
const Documents = require("../Model/DocumentsModel");
const RFI = require("../Model/rfiModel");

const getClientPortalData = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const activeSites = await Projects.countDocuments({ status: "Active" });
    const inProgressSites = await Projects.countDocuments({ status: "In Progress" });

    const complianceStatus = {
      safety: 98,   // Static or calculated value
      quality: 95   // Static or calculated value
    };

    const pendingApprovalsCount = await Tasks.countDocuments({
      projectId,
      type: "approval",
      status: "pending"
    });

    const rfisCount = await RFI.countDocuments({ projectId });

    const documents = await Documents.find({ projectId }).select("fileName fileUrl");

    const tasks = await Tasks.find({ projectId }).select("taskName dueDate status");

    res.status(200).json({
      success: true,
      message: "Client portal data fetched successfully",
      data: {
        projectName: project.projectName,
        activeSites,
        inProgressSites,
        complianceStatus,
        pendingApprovalsCount,
        rfisCount,
        documents,
        tasks
      }
    });
  } catch (error) {
    console.error("Client portal error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch client portal data",
      error: error.message
    });
  }
});


module.exports = {
  getClientPortalData   
};



