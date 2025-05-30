const express = require('express');

const routerapi = express.Router()

const authRoutes = require('./Router/authRouter')
const userRoutes = require('./Router/userRouter')

// THEN your routers
// Projects

// Auth 
routerapi.use('/api', authRoutes);
// User
routerapi.use('/api/users', userRoutes);
// projects
routerapi.use('/api/projects', require('./Router/projectsRouter'));
// Diaries
routerapi.use('/api/diaries', require('./Router/DiariesRouter'));
// TimeSheet 
routerapi.use('/api/timesheet', require('./Router/TimeSheetRouter'));
// Swms
routerapi.use('/api/swms', require('./Router/SwmsRouter'));
//ITPs
routerapi.use('/api/itps', require('./Router/ITPsRouter'));
// induction
routerapi.use('/api/induction', require('./Router/inductionRouter'));

routerapi.use('/api/incident', require('./Router/incidentRouter'));

routerapi.use('/api/siteEntry', require('./Router/siteEntryRouter'));

routerapi.use('/api/siteReview', require('./Router/siteReviewRouter'));

routerapi.use('/api/data', require('./Router/dataRouter'));

routerapi.use('/api/audit', require('./Router/auditRouter'));

routerapi.use('/api/safety', require('./Router/safetyRouter'));

routerapi.use('/api/chat', require('./Router/chatRouter'));

routerapi.use('/api/announement', require('./Router/announcementRouter'));

routerapi.use('/api/rfi', require('./Router/rfiRouter'));

routerapi.use('/api/rfiDashboard', require('./Router/rfiDashboardRouter'));

routerapi.use('/api/toolbox', require('./Router/toolboxRouter'));

routerapi.use('/api/annotation', require('./Router/annotationRouter'));

routerapi.use('/api/projects', require('./Router/projectsRouter'));

routerapi.use('/api/category', require('./Router/categoryRouter'));

routerapi.use('/api/clientPortal', require('./Router/clientPortalRouter'));

routerapi.use('/api/reportAnalytics', require('./Router/reportAnalyticsRouter'));

routerapi.use('/api/building', require('./Router/buildingRouter'));

routerapi.use('/api/buildingCategory', require('./Router/buildingCategoryRouter'));


// equipment
routerapi.use('/api/equipment',require('./Router/PlantMachineryEquipmentRouter'))

// Calendar
routerapi.use('/api/calendar', require('./Router/CalendarRouter'));
// defectlists
routerapi.use('/api/defectlists', require('./Router/DefectListsRouter'));
// checklists
routerapi.use('/api/checklists', require('./Router/ChecklistsRouter'));
// documents
routerapi.use('/api/documents', require('./Router/DocumentsRouter'));
// Taskmanagement
routerapi.use('/api/taskmanagement', require('./Router/TasksManagementRouter'));
//Drawings
routerapi.use('/api/drawings', require('./Router/DrawingRegisterRouter'));

routerapi.use('/api/complete', require('./Router/completeRouter'));

routerapi.use('/api/dashboard', require('./Router/dashboardRouter'));

routerapi.use('/api/hazard', require('./Router/HazardRouter'));

routerapi.use('/api/question', require('./Router/questionRouter'));

routerapi.use('/api/ppe', require('./Router/ppeRouter'));

routerapi.use('/api/plantTool', require('./Router/plantToolRouter'));

routerapi.use('/api/plantAuditReport', require('./Router/plantAuditReportRouter'));

routerapi.use('/api/worker', require('./Router/workerRouter'));

routerapi.use('/api/inductionTemplate', require('./Router/inductionTemplateRouter'));

routerapi.use('/api/hazardTemplate', require('./Router/hazardTemplateRouter'));



// <<<<<<< HEAD
// // // Superadmin 
// UserInfo
routerapi.use('/api/userInfo', require('./Router/Superadmin/UserInfoRouter'));
// PlanPackage
routerapi.use("/api/planPackage",require("./Router/Superadmin/PlanPackageRouter"))
// PlanRequest
routerapi.use("/api/planRequest",require("./Router/Superadmin/PlanRequestRouter"))
// superadmin dashboard
routerapi.use('/api/superadmindashboard', require('./Router/superadminDashboardRouter'));



module.exports = routerapi


