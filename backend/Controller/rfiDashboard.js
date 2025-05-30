const RFI = require("../Model/rfiModel");
const User  = require('../Model/userModel');
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });

  const getRfiDashboard = async (req, res) => {
    try {
      // --- 1. Summary Counts ---
      const [total, pending, resolved, overdue] = await Promise.all([
        RFI.countDocuments(),
        RFI.countDocuments({ status: "Pending" }),
        RFI.countDocuments({ status: "Resolved" }),
        RFI.countDocuments({
          due_date: { $lt: new Date() },
          status: { $ne: "Resolved" }
        })
      ]);
  
      // --- 2. RFI List with Filtering & Pagination ---
      const { page = 1, limit = 20, subject = "", startDate, endDate } = req.query;
      const query = {};
  
      if (subject) {
        query.subject = { $regex: subject, $options: "i" };
      }
  
      if (startDate && endDate) {
        query.due_date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
  
      const rfis = await RFI.find(query)
        .populate("assignee", "firstName lastName")
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ due_date: -1 });
  
      // --- 3. Monthly Trends (Submitted & Resolved) ---
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      const trendRaw = await RFI.aggregate([
        { $match: { createdAt: { $gte: startOfYear } } },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, status: "$status" },
            count: { $sum: 1 }
          }
        }
      ]);
  
      const trends = {};
      for (let i = 1; i <= 12; i++) {
        trends[i] = { submitted: 0, resolved: 0 };
      }
  
      trendRaw.forEach(item => {
        const month = item._id.month;
        const status = item._id.status;
        if (status === "Resolved") {
          trends[month].resolved += item.count;
        } else {
          trends[month].submitted += item.count;
        }
      });
  
      // --- 4. Average Resolution Time ---
      const resolvedRFIs = await RFI.find({ status: "Resolved" });
      const totalDays = resolvedRFIs.reduce((sum, rfi) => {
        const created = new Date(rfi.createdAt);
        const updated = new Date(rfi.updatedAt);
        return sum + (updated - created) / (1000 * 60 * 60 * 24); // in days
      }, 0);
  
      const averageResolutionTimeInDays = resolvedRFIs.length
        ? (totalDays / resolvedRFIs.length).toFixed(1)
        : 0;
  
      // --- Final Response ---
      res.status(200).json({
        success: true,
        data: {
          summary: { total, pending, resolved, overdue },
          list: rfis,
          trends,
          resolutionTime: Number(averageResolutionTimeInDays)
        }
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching RFI dashboard",
        error: error.message
      });
    }
  };




module.exports = {getRfiDashboard};
