const Projects = require('../Model/projectsModel');
const Incident = require('../Model/IncidentModel');
const moment = require('moment');
const asyncHandler = require("express-async-handler"); 

const getReportsAnalytics = async (req, res) => {
    const { projectId } = req.params;  // Get projectId from request params
    const { startDate, endDate } = req.query;  // Get filters from query params
  
    try {
      // Fetch Project Info
      const project = await Projects.findById(projectId);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
  
      // Fetch Incidents for the Last 7 Days
      const last7DaysIncidents = await Incident.find({
        createdAt: { $gte: moment().subtract(7, 'days').toDate() },
        projectId
      }).select('createdAt updatedAt');  // Fetch only timestamps
  
      // Fetch Open Incidents
      const openIncidents = await Incident.find({ projectId, status: { $in: ['pending', 'in-progress'] } });
  
      // Dynamically Calculate Safety Compliance
      const totalIncidents = await Incident.countDocuments({ projectId });
      const highSeverityIncidents = await Incident.countDocuments({ projectId, severityLevel: 'High' });
      const safetyCompliance = totalIncidents === 0 ? 0 : ((totalIncidents - highSeverityIncidents) / totalIncidents) * 100;
  
      // Dynamically Calculate Quality Score
      const tasks = project.tasks || [];
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const totalTasks = tasks.length;
      const qualityScore = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  
      // Calculate Project Progress
      const projectProgress = projectProgressCalculator(project);
  
      // Incident Distribution by Category
      const incidentDistribution = await Incident.aggregate([
        { $match: { projectId } },
        {
          $group: {
            _id: "$category",  // Group by category
            count: { $sum: 1 }
          }
        }
      ]);
  
      // Trend Analysis for Last 6 Months
      const trendAnalysis = await Incident.aggregate([
        { $match: { projectId, createdAt: { $gte: moment().subtract(6, 'months').toDate() } } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalIncidents: { $sum: 1 },
          }
        },
        { $sort: { "_id": 1 } }
      ]);
  
      // Custom Report Generator (by Date Range)
      let customReports = [];
      if (startDate && endDate) {
        customReports = await Incident.find({
          projectId,
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }).select('createdAt updatedAt');  // Fetch only timestamps
      }
  
      // Prepare the Analytics Dashboard Data
      const dashboardData = {
        last7DaysIncidents: last7DaysIncidents,
        openIncidentsCount: openIncidents.length,
        safetyCompliance,
        qualityScore,
        projectProgress,
        incidentDistribution,
        trendAnalysis,
        customReports
      };
  
      res.status(200).json({
        success: true,
        message: 'Reports & Analytics data fetched successfully',
        data: dashboardData
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  };
  
  // Helper function to calculate Project Progress dynamically
  const projectProgressCalculator = (project) => {
    const tasks = project.tasks || [];
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const totalTasks = tasks.length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };
  


module.exports = { getReportsAnalytics };