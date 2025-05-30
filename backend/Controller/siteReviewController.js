
const SiteReview = require("../Model/siteReviewModel");
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
  });

  
  // Create a new site review
  const createSiteReview = async (req, res) => {
    const {
      siteName,
      siteLocation,
      reviewDate,
      reviewerName,
      complianceStatus,
      checkedItems,
      recommendations,
      assignedTo,
      approvalStatus,
    } = req.body;
  
    try {
      let fileUrl = '';
  
      // Check if an image file is uploaded and handle Cloudinary upload
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
  
        // Upload the image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'site_reviews', // Specify the folder in Cloudinary
          resource_type: 'image', // Specify resource type as image
        });
  
        // Check if the upload was successful and retrieve the URL
        if (uploadResult && uploadResult.secure_url) {
          fileUrl = uploadResult.secure_url;
        } else {
          console.error('Cloudinary upload failed: No URL returned.');
        }
      } else {
        console.log('No image file uploaded.');
      }
  
      // Create a new site review with the provided data and the uploaded image URL (if any)
      const newSiteReview = new SiteReview({
        siteName,
        siteLocation,
        reviewDate,
        reviewerName,
        complianceStatus,
        checkedItems,
        image: fileUrl ? [fileUrl] : [], // Store image URL in array if available
        recommendations,
        assignedTo,
        approvalStatus,
      });
  
      // Save the review in the database
      const savedReview = await newSiteReview.save();
  
      // Respond with a success message and the saved review data
      res.status(201).json({
        success: true,
        message: 'Site review created successfully',
        data: savedReview,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creating site review',
        error: error.message,
      });
    }
  };

  
  const getAllSiteReviews = async (req, res) => {
    try {
      // Fetch all site reviews
      const siteReviews = await SiteReview.find();
  
      // Rearrange the keys to ensure _id is first
      const formattedReviews = siteReviews.map((review) => {
        const { _id, ...rest } = review.toObject(); // Convert Mongoose document to plain object
        return { _id, ...rest }; // Ensure _id is first
      });
  
      // Return success response
      res.status(200).json({
        success: true,
        data: formattedReviews,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching site reviews',
        error: error.message,
      });
    }
  };



  const getSiteReviewById = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
  
    try {
      // Fetch the site review by ID
      const siteReview = await SiteReview.findById(id);
  
      if (!siteReview) {
        return res.status(404).json({
          success: false,
          message: 'Site review not found',
        });
      }
  
      // Rearrange the keys to ensure _id comes first
      const { _id, ...rest } = siteReview.toObject(); // Convert Mongoose document to plain object
      const formattedSiteReview = { _id, ...rest }; // Ensure _id comes first
  
      // Return success response with the formatted site review
      res.status(200).json({
        success: true,
        data: formattedSiteReview,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching site review',
        error: error.message,
      });
    }
  };


  const updateSiteReview = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
    const {
      siteName,
      siteLocation,
      reviewDate,
      reviewerName,
      complianceStatus,
      checkedItems,
      recommendations,
      assignedTo,
      approvalStatus,
    } = req.body;
  
    try {
      // Find the site review by ID
      const siteReview = await SiteReview.findById(id);
  
      if (!siteReview) {
        return res.status(404).json({
          success: false,
          message: 'Site review not found',
        });
      }
  
      // Update the site review fields
      siteReview.siteName = siteName || siteReview.siteName;
      siteReview.siteLocation = siteLocation || siteReview.siteLocation;
      siteReview.reviewDate = reviewDate || siteReview.reviewDate;
      siteReview.reviewerName = reviewerName || siteReview.reviewerName;
      siteReview.complianceStatus = complianceStatus || siteReview.complianceStatus;
      
      // Ensure checkedItems is an object and update
      if (checkedItems && typeof checkedItems === 'object' && !Array.isArray(checkedItems)) {
        siteReview.checkedItems = checkedItems;
      } else if (checkedItems) {
        console.error('Invalid checkedItems format');
      }
  
      siteReview.recommendations = recommendations || siteReview.recommendations;
      siteReview.assignedTo = assignedTo || siteReview.assignedTo;
      siteReview.approvalStatus = approvalStatus || siteReview.approvalStatus;
  
      // Handle file upload if a new image is provided
      if (req.files && req.files.image) {
        const imageFile = req.files.image;
        const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
          folder: 'site_reviews',
          resource_type: 'image',
        });
  
        if (uploadResult && uploadResult.secure_url) {
          siteReview.image = [uploadResult.secure_url]; // Update image URL
        }
      }
  
      // Save the updated site review
      const updatedReview = await siteReview.save();
  
      // Rearrange the keys to ensure _id comes first
      const { _id, ...rest } = updatedReview.toObject(); // Convert Mongoose document to plain object
      const formattedSiteReview = { _id, ...rest }; // Ensure _id comes first
  
      // Return success response with the formatted site review
      res.status(200).json({
        success: true,
        message: 'Site review updated successfully',
        data: formattedSiteReview, // Send _id first
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating site review',
        error: error.message,
      });
    }
  };

  
  const deleteSiteReview = async (req, res) => {
    const { id } = req.params; // Extract the ID from the request params
  
    try {
      // Find and delete the site review by ID
      const siteReview = await SiteReview.findByIdAndDelete(id);
  
      if (!siteReview) {
        return res.status(404).json({
          success: false,
          message: 'Site review not found',
        });
      }
  
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Site review deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting site review',
        error: error.message,
      });
    }
  };
  
  
  
module.exports = {createSiteReview, getAllSiteReviews, getSiteReviewById, updateSiteReview, deleteSiteReview};
