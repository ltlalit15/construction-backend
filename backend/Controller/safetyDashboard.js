const asyncHandler = require("express-async-handler");
const Induction = require("../Model/InductionModel");
const SWMS = require("../Model/SwmsModel");
const SiteReview = require("../Model/siteReviewModel");
const Incident = require("../Model/IncidentModel");

const getSafetyDashboardData = asyncHandler(async (req, res) => {
  try {
    const now = new Date();
    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    // ======================= INDUCTION ========================
    const totalInductions = await Induction.countDocuments();
    const inductionsLastDay = await Induction.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const inductionsLastWeek = await Induction.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const inductionsLastMonth = await Induction.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    // ========================== SWMS ==========================
    const totalSWMS = await SWMS.countDocuments();
    const swmsLastDay = await SWMS.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const swmsLastWeek = await SWMS.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const swmsLastMonth = await SWMS.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const swmsHighPriority = await SWMS.countDocuments({ priority: 'high' });

    // ====================== SITE REVIEW =======================
    const totalSiteReviews = await SiteReview.countDocuments();
    const siteReviewLastDay = await SiteReview.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const siteReviewLastWeek = await SiteReview.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const siteReviewLastMonth = await SiteReview.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const siteReviewImmediateAction = await SiteReview.countDocuments({ actionRequired: true });

    // ======================= INCIDENTS ========================
    const totalIncidents = await Incident.countDocuments();
    const incidentLastDay = await Incident.countDocuments({ createdAt: { $gte: oneDayAgo } });
    const incidentLastWeek = await Incident.countDocuments({ createdAt: { $gte: oneWeekAgo } });
    const incidentLastMonth = await Incident.countDocuments({ createdAt: { $gte: oneMonthAgo } });
    const incidentPendingReview = await Incident.countDocuments({ reportStatus: 'pending' });

    // ========== RESPONSE ==========
    res.status(200).json({
      success: true,
      message: "Safety dashboard data fetched successfully",
      data: {
        induction: {
          total: totalInductions,
          lastDay: inductionsLastDay,
          lastWeek: inductionsLastWeek,
          lastMonth: inductionsLastMonth
        },
        swms: {
          total: totalSWMS,
          lastDay: swmsLastDay,
          lastWeek: swmsLastWeek,
          lastMonth: swmsLastMonth,
          highPriority: swmsHighPriority
        },
        siteReview: {
          total: totalSiteReviews,
          lastDay: siteReviewLastDay,
          lastWeek: siteReviewLastWeek,
          lastMonth: siteReviewLastMonth,
          needsImmediateAction: siteReviewImmediateAction
        },
        incident: {
          total: totalIncidents,
          lastDay: incidentLastDay,
          lastWeek: incidentLastWeek,
          lastMonth: incidentLastMonth,
          pendingReview: incidentPendingReview
        }
      }
    });
  } catch (error) {
    console.error("Safety Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch safety dashboard data",
      error: error.message
    });
  }
});

module.exports = { getSafetyDashboardData };
