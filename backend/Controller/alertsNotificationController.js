const asyncHandler = require("express-async-handler");
const SWMS = require("../Model/SwmsModel");
const Induction = require("../Model/InductionModel");
const Incident = require("../Model/IncidentModel");
const SiteEntry = require("../Model/siteEntryModel");
const SiteReview = require("../Model/siteReviewModel");
const Defect = require("../Model/DefectListsModel");
const Announcement = require("../Model/announcementModel");
const RFI = require("../Model/rfiModel");
const ToolboxTalk = require("../Model/toolboxModel");
const Projects = require("../Model/projectsModel");
const Documents = require("../Model/DocumentsModel");
const TasksManagement = require("../Model/TasksManagementModel");

const getRecentAlerts = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000);

    // Fetching the alerts based on different conditions
    const swmsAlerts = await SWMS.find({ status: { $in: ['submitted', 'completed', 'approved', 'rejected'] } });
    const inductionAlerts = await Induction.find({ status: 'pending' });
    const incidentAlerts = await Incident.find({ status: { $in: ['submitted', 'completed'] } });
    const siteEntryAlerts = await SiteEntry.find({ status: 'pending' });
    const siteReviewAlerts = await SiteReview.find({ status: 'submitted' });
    const defectAlerts = await Defect.find({ $or: [{ status: 'closed' }, { createdAt: { $gte: oneDayAgo } }] });
    const announcementAlerts = await Announcement.find({ createdAt: { $gte: oneDayAgo } });
    const rfiAlerts = await RFI.find({ $or: [{ status: 'closed' }, { createdAt: { $gte: oneDayAgo } }] });
    const toolboxTalkAlerts = await ToolboxTalk.find({ createdAt: { $gte: oneDayAgo } });
    const projectAlerts = await Projects.find({
      $or: [
        { assignedTo: { $ne: null } },
        { priority: { $in: ['high', 'medium'] } },
        { status: { $ne: 'completed' } },
        { endDate: { $lt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) } }
      ]
    });
    const documentAlerts = await Documents.find({ createdAt: { $gte: oneDayAgo } });
    const taskManagementAlerts = await TasksManagement.find({
      $or: [{ status: 'completed' }, { createdAt: { $gte: oneDayAgo } }]
    });

    // Combine all the alerts from different models
    const alerts = [
      ...swmsAlerts.map(item => {
        const alertMessage = `SWMS status changed to ${item.status}: ${item.name}`;
        logNotification('SWMS', alertMessage);  // Log Notification for SWMS status change
        return {
          type: 'SWMS',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...inductionAlerts.map(item => {
        const alertMessage = `Induction status pending: ${item.name}`;
        logNotification('Induction', alertMessage);  // Log Notification for Induction status
        return {
          type: 'Induction',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...incidentAlerts.map(item => {
        const alertMessage = `Incident status changed to ${item.status}`;
        logNotification('Incident', alertMessage);  // Log Notification for Incident status
        return {
          type: 'Incident',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...siteEntryAlerts.map(item => {
        const alertMessage = `Site Entry status is pending: ${item.name}`;
        logNotification('SiteEntry', alertMessage);  // Log Notification for Site Entry status
        return {
          type: 'SiteEntry',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...siteReviewAlerts.map(item => {
        const alertMessage = `Site Review status submitted: ${item.name}`;
        logNotification('SiteReview', alertMessage);  // Log Notification for Site Review status
        return {
          type: 'SiteReview',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...defectAlerts.map(item => {
        const alertMessage = `Defect status: ${item.status === 'closed' ? 'Closed' : 'New'}: ${item.name}`;
        logNotification('Defect', alertMessage);  // Log Notification for Defect status
        return {
          type: 'Defect',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...announcementAlerts.map(item => {
        const alertMessage = `New announcement added: ${item.title}`;
        logNotification('Announcement', alertMessage);  // Log Notification for new Announcement
        return {
          type: 'Announcement',
          message: alertMessage,
          timestamp: item.createdAt,
           id: item._id 
        };
      }),
      ...rfiAlerts.map(item => {
        const alertMessage = `RFI status: ${item.status === 'closed' ? 'Closed' : 'New'}: ${item.name}`;
        logNotification('RFI', alertMessage);  // Log Notification for RFI status change
        return {
          type: 'RFI',
          message: alertMessage,
          timestamp: item.createdAt,
           id: item._id 
        };
      }),
      ...toolboxTalkAlerts.map(item => {
        const alertMessage = `New Toolbox Talk added: ${item.title}`;
        logNotification('ToolboxTalk', alertMessage);  // Log Notification for new Toolbox Talk
        return {
          type: 'ToolboxTalk',
          message: alertMessage,
          timestamp: item.createdAt,
           id: item._id 
        };
      }),
      ...projectAlerts.map(item => {
        const alertMessage = `Project due in less than 3 days: ${item.name}`;
        logNotification('Project', alertMessage);  // Log Notification for Project deadline
        return {
          type: 'Project',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      }),
      ...documentAlerts.map(item => {
        const alertMessage = `New document added: ${item.name}`;
        logNotification('Document', alertMessage);  // Log Notification for new document
        return {
          type: 'Document',
          message: alertMessage,
          timestamp: item.createdAt,
           id: item._id 
        };
      }),
      ...taskManagementAlerts.map(item => {
        const alertMessage = `Task completed or new task added: ${item.name}`;
        logNotification('TaskManagement', alertMessage);  // Log Notification for new task or completed task
        return {
          type: 'TaskManagement',
          message: alertMessage,
          timestamp: item.updatedAt,
           id: item._id 
        };
      })
    ];

    // Send the combined alerts response
    res.status(200).json({
      success: true,
      message: "Recent alerts fetched successfully",
      data: alerts
    });
  } catch (error) {
    console.error("Error fetching alerts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts",
      error: error.message
    });
  }
});

// Helper function to log notifications
function logNotification(type, message) {
  console.log(`Notification Log - ${type}: ${message}`);
}

module.exports = { getRecentAlerts };
