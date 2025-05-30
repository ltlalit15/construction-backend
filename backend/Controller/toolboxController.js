const ToolboxTalk = require("../Model/toolboxModel");
const User  = require('../Model/userModel');
const asyncHandler = require("express-async-handler");

const cloudinary = require('../Config/cloudinary');


cloudinary.config({
    cloud_name: 'dkqcqrrbp',
    api_key: '418838712271323',
    api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});


const mongoose = require('mongoose');

const createToolboxTalk = async (req, res) => {
  try {
    const { title, date, time, presenter, participants, description, status } = req.body;

    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "toolbox-talks",
        resource_type: "image",
      });

      if (uploadResult && uploadResult.secure_url) {
        imageUrl = uploadResult.secure_url;
      }
    }

    // Validate presenter ID
    if (!mongoose.Types.ObjectId.isValid(presenter)) {
      return res.status(400).json({
        success: false,
        message: "Invalid presenter ID",
      });
    }
    const presenterUser = await User.findById(presenter);
    if (!presenterUser) {
      return res.status(400).json({
        success: false,
        message: "Presenter not found",
      });
    }

    // Validate participant IDs
    let participantIds = [];

    function isValidObjectId(id) {
      return mongoose.Types.ObjectId.isValid(id);
    }

    if (Array.isArray(participants)) {
      participantIds = participants.filter(isValidObjectId);
    } else if (typeof participants === "string") {
      participantIds = participants
        .split(",")
        .map(id => id.trim())
        .filter(isValidObjectId);
    }

    if (participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid participant IDs provided",
      });
    }

    const matchedUsers = await User.find({ _id: { $in: participantIds } });

    if (matchedUsers.length !== participantIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more participant IDs are invalid",
      });
    }

    // Save Toolbox Talk
    const talk = new ToolboxTalk({
      title,
      date,
      time,
      presenter,
      participants: participantIds,
      description,
      status,
      image: imageUrl,
    });

    const savedTalk = await talk.save();

    res.status(201).json({
      success: true,
      message: "Toolbox Talk created successfully",
      data: savedTalk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Toolbox Talk",
      error: error.message,
    });
  }
};


const getAllToolboxTalks = async (req, res) => {
  try {
    const talks = await ToolboxTalk.find()
      .populate("participants", "_id firstName lastName")
      .populate("presenter", "_id firstName lastName");

    res.status(200).json({ success: true, data: talks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch Toolbox Talks",
      error: error.message,
    });
  }
};


const getToolboxTalkById = async (req, res) => {
  try {
    const talk = await ToolboxTalk.findById(req.params.id)
      .populate("participants", "firstName lastName")
      .populate("presenter", "firstName lastName");

    if (!talk) {
      return res.status(404).json({ success: false, message: "Toolbox Talk not found" });
    }

    res.status(200).json({ success: true, data: talk });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch Toolbox Talk", error: error.message });
  }
};


const updateToolboxTalk = async (req, res) => {
  try {
    const { title, date, time, presenter, participants, description, status } = req.body;

    let imageUrl = "";

    // Handle Cloudinary image upload
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadResult = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        folder: "toolbox-talks",
        resource_type: "image",
      });

      if (uploadResult?.secure_url) {
        imageUrl = uploadResult.secure_url;
      }
    }

    // Validate presenter
    const presenterUser = await User.findById(presenter);
    if (!presenterUser) {
      return res.status(400).json({
        success: false,
        message: "Presenter not found",
      });
    }

    // Handle participant IDs (comma-separated string or array)
    let participantIds = [];

    if (Array.isArray(participants)) {
      participantIds = participants;
    } else if (typeof participants === "string") {
      participantIds = participants.split(",").map(id => id.trim());
    }

    const matchedUsers = await User.find({ _id: { $in: participantIds } });

    if (matchedUsers.length !== participantIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more participant IDs are invalid",
      });
    }

    // Update Toolbox Talk
    const updatedTalk = await ToolboxTalk.findByIdAndUpdate(
      req.params.id,
      {
        title,
        date,
        time,
        presenter,
        participants: participantIds,
        description,
        status,
        ...(imageUrl && { image: imageUrl }),
      },
      { new: true }
    );

    if (!updatedTalk) {
      return res.status(404).json({
        success: false,
        message: "Toolbox Talk not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Toolbox Talk updated successfully",
      data: updatedTalk,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update Toolbox Talk",
      error: error.message,
    });
  }
};



const deleteToolboxTalk = async (req, res) => {
  try {
    const deletedTalk = await ToolboxTalk.findByIdAndDelete(req.params.id);

    if (!deletedTalk) {
      return res.status(404).json({ success: false, message: "Toolbox Talk not found" });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete Toolbox Talk", error: error.message });
  }
};



module.exports = { createToolboxTalk, getAllToolboxTalks, getToolboxTalkById, updateToolboxTalk, deleteToolboxTalk };
