const User = require("../Model/userModel");
const Projects = require("../Model/projectsModel");

const asyncHandler = require("express-async-handler");

const getSuperAdminDashboard = async (req, res) => {
    try {
      // 1. Ongoing projects (status: 'Ongoing')
      const ongoingProjects = await Projects.countDocuments({ status: "Ongoing" });
  
      // 2. Completed projects (status: 'Completed')
      const completedProjects = await Projects.countDocuments({ status: "Completed" });
  
      // 3. Total users
      const totalUsers = await User.countDocuments();
  
      // 4. Total revenue (sum of all project.budget or revenue)
      const revenueAggregation = await Projects.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } }
      ]);
  
      const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
  
      res.status(200).json({
        success: true,
        data: {
          ongoingProjects,
          completedProjects,
          totalUsers,
          totalRevenue,
        }
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching dashboard data",
        error: error.message,
      });
    }
  };

  

module.exports = {getSuperAdminDashboard};