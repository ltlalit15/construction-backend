const Annotation = require("../Model/annotationModel");
const Announcement = require("../Model/announcementModel");
const SecurityAuditReport = require("../Model/auditModel");
const BuildingCategory = require("../Model/buildingCategoryModel");
const Building = require("../Model/buildingModel");
const Calendar = require("../Model/CalendarModel");
const Category = require("../Model/categoryModel");
const Chat = require("../Model/chatModel");
const Checklists = require("../Model/ChecklistsModel");
const Dashboard = require("../Model/DashboardModel");
const Defect = require("../Model/DefectListsModel");
const Diaries = require("../Model/DiariesModel");
const Documents = require("../Model/DocumentsModel");
const DrawingRegister = require("../Model/DrawingRegisterModel");
const Incident = require("../Model/IncidentModel");
const Induction = require("../Model/InductionModel");
const ITPs = require("../Model/ITPsModel");
const PlantMachineryEquipment = require("../Model/PlantMachineryEquipmentModel");
const plantTool = require("../Model/plantToolModel");
const Projects = require("../Model/projectsModel");
const RFI = require("../Model/rfiModel");
const SafetyEquipmentAssignment = require("../Model/safetyModel");
const SiteEntry = require("../Model/siteEntryModel");
const SiteReview = require("../Model/siteReviewModel");
const SWMS = require("../Model/SwmsModel");
const TasksManagement = require("../Model/TasksManagementModel");
const TimeSheet = require("../Model/TimeSheetModel");
const ToolboxTalk = require("../Model/toolboxModel");

const getAllData = async (req, res) => {
  const { userId } = req.params;

  try {
    const annotations = await Annotation.find({ author: userId });
    const announcements = await Announcement.find();
    const securityAuditReports = await SecurityAuditReport.find({ auditedBy: userId });
    const buildingCategories = await BuildingCategory.find();
    const buildings = await Building.find();
    const calendars = await Calendar.find({ assignTeamMembers: userId });
    const categories = await Category.find();
    const chats = await Chat.find({ users: userId });
    const checklists = await Checklists.find({ AssignTo: userId });
    const dashboards = await Dashboard.find();
    const defects = await Defect.find({ assigned: userId });
    const diaries = await Diaries.find();
    const documents = await Documents.find({ assignTo: userId });
    const drawingRegisters = await DrawingRegister.find({ assignedTo: userId });
    const incidents = await Incident.find();
    const inductions = await Induction.find({ emailAddress: userId });
    const itps = await ITPs.find({ Inspector: userId });
    const plantMachineryEquipments = await PlantMachineryEquipment.find();
    const plantTools = await plantTool.find();
    const projects = await Projects.find({ assignedTo: userId });
    const rfis = await RFI.find({ assignee: userId });
    const safetyEquipmentAssignments = await SafetyEquipmentAssignment.find({ assignedTo: userId });
    const siteEntries = await SiteEntry.find({ emailAddress: userId });
    const siteReviews = await SiteReview.find({ assignedTo: userId });
    const swms = await SWMS.find({ project: { $in: await Projects.find({ assignedTo: userId }).distinct('_id') } });
    const tasksManagement = await TasksManagement.find({ assignTo: userId });
    const timeSheets = await TimeSheet.find({ worker: userId });
    const toolboxTalks = await ToolboxTalk.find({ presenter: userId });

    res.status(200).json({
      success: true,
      data: {
        annotations,
        announcements,
        securityAuditReports,
        buildingCategories,
        buildings,
        calendars,
        categories,
        chats,
        checklists,
        dashboards,
        defects,
        diaries,
        documents,
        drawingRegisters,
        incidents,
        inductions,
        itps,
        plantMachineryEquipments,
        plantTools,
        projects,
        rfis,
        safetyEquipmentAssignments,
        siteEntries,
        siteReviews,
        swms,
        tasksManagement,
        timeSheets,
        toolboxTalks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all data',
      error: error.message,
    });
  }
};

module.exports = { getAllData };
