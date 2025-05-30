const asyncHandler = require('express-async-handler');
const Calendar = require('../Model/CalendarModel');
const cloudinary = require('../Config/cloudinary');
const User  = require('../Model/userModel');
const mongoose = require('mongoose');
const Project = require("../Model/projectsModel"); 

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

// const CalendarCreate = asyncHandler(async (req, res) => {
//   let {
//     taskTitle,
//     description,
//     project,
//     taskType,
//     startDate,
//     endDate,
//     color,
//     reminders,
//   } = req.body;

//   let assignTeamMembers = [];

//   // Parse team members from form-data fields
//   for (const key in req.body) {
//     if (key.startsWith("assignTeamMembers[")) {
//       const match = key.match(/assignTeamMembers\[(\d+)\]\.(firstName|lastName)/);
//       if (match) {
//         const index = match[1];
//         const field = match[2];

//         assignTeamMembers[index] = assignTeamMembers[index] || {};
//         assignTeamMembers[index][field] = req.body[key];
//       }
//     }
//   }

//   if (!taskTitle || !startDate || !endDate) {
//     return res.status(400).json({
//       success: false,
//       message: "taskTitle, startDate, and endDate are required",
//     });
//   }

//   // Resolve project ObjectId from name
//   let projectId;
//   if (mongoose.Types.ObjectId.isValid(project)) {
//     projectId = mongoose.Types.ObjectId(project);
//   } else {
//     const foundProject = await Project.findOne({ name: project });
//     if (!foundProject) {
//       return res.status(400).json({ success: false, message: "Project not found" });
//     }
//     projectId = foundProject._id;
//   }

//   // Parse dates
//   startDate = new Date(startDate.trim());
//   endDate = new Date(endDate.trim());

//   // Handle team members by matching firstName + lastName
//   const resolvedTeam = [];
//   for (const member of assignTeamMembers) {
//     if (!member?.firstName || !member?.lastName) continue;

//     const user = await User.findOne({ firstName: member.firstName, lastName: member.lastName });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: User not found: ${member.firstName} ${member.lastName},
//       });
//     }
//     resolvedTeam.push(user._id);
//   }

//   // Handle image uploads (if any)
//   let imageUrls = [];
//   if (req.files && req.files.image) {
//     const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
//     for (const file of files) {
//       const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
//         folder: "calendar_uploads",
//         resource_type: "image",
//       });
//       if (uploadResult.secure_url) {
//         imageUrls.push(uploadResult.secure_url);
//       }
//     }
//   }

//   // Default reminders to string
//   reminders = reminders || "";

//   try {
//     const newCalendar = new Calendar({
//       taskTitle,
//       description,
//       project: projectId,
//       taskType,
//       startDate,
//       endDate,
//       assignTeamMembers: resolvedTeam,
//       image: imageUrls,
//       reminders,
//       color,
//     });

//     await newCalendar.save();

//     // Populate user info
//     const populatedCalendar = await Calendar.findById(newCalendar._id).populate(
//       "assignTeamMembers",
//       "firstName lastName"
//     );

//     const calendar = populatedCalendar.toObject();
//     calendar.assignTeamMembers = calendar.assignTeamMembers.map((member) => ({
//       id: member._id.toString(),
//       firstName: member.firstName,
//       lastName: member.lastName,
//     }));

//     res.status(201).json({
//       success: true,
//       message: "Calendar entry created successfully",
//       calendar,
//     });
//   } catch (error) {
//     console.error("Error creating calendar entry:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while creating the calendar entry",
//       error: error.message,
//     });
//   }
// });


const CalendarCreate = asyncHandler(async (req, res) => {
  let {
    taskTitle,
    description,
    project,
    taskType,
    startDate,
    endDate,
    color,
    reminders,
  } = req.body;

  // Parse team member IDs from form-data
  let assignTeamMembers = req.body["assignTeamMembers[]"];
  if (!assignTeamMembers) {
    assignTeamMembers = [];
  } else if (!Array.isArray(assignTeamMembers)) {
    assignTeamMembers = [assignTeamMembers]; // Ensure it's an array even for single value
  }

  // Validate required fields
  if (!taskTitle || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "taskTitle, startDate, and endDate are required",
    });
  }

  // Resolve project ID
  let projectId;
  if (mongoose.Types.ObjectId.isValid(project)) {
    projectId = mongoose.Types.ObjectId(project);
  } else {
    const foundProject = await Project.findOne({ name: project });
    if (!foundProject) {
      return res.status(400).json({ success: false, message: "Project not found" });
    }
    projectId = foundProject._id;
  }

  // Parse dates
  startDate = new Date(startDate.trim());
  endDate = new Date(endDate.trim());

  // Validate and resolve team members
  const resolvedTeam = [];
  for (const userId of assignTeamMembers) {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: User `not found with ID: ${userId}`,
      });
    }
    resolvedTeam.push(user._id);
  }

  // Handle image uploads (if any)
  let imageUrls = [];
  if (req.files && req.files.image) {
    const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
    for (const file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "calendar_uploads",
        resource_type: "image",
      });
      if (uploadResult.secure_url) {
        imageUrls.push(uploadResult.secure_url);
      }
    }
  }

  reminders = reminders || "";

  try {
    const newCalendar = new Calendar({
      taskTitle,
      description,
      project: projectId,
      taskType,
      startDate,
      endDate,
      assignTeamMembers: resolvedTeam,
      image: imageUrls,
      reminders,
      color,
    });

    await newCalendar.save();

    const populatedCalendar = await Calendar.findById(newCalendar._id).populate(
      "assignTeamMembers",
      "firstName lastName"
    );

    const calendar = populatedCalendar.toObject();
    calendar.assignTeamMembers = calendar.assignTeamMembers.map((member) => ({
      id: member._id.toString(),
      firstName: member.firstName,
      lastName: member.lastName,
    }));

    res.status(201).json({
      success: true,
      message: "Calendar entry created successfully",
      calendar,
    });
  } catch (error) {
    console.error("Error creating calendar entry:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the calendar entry",
      error: error.message,
    });
  }
});



const AllCalendar = async (req, res) => {
  try {
    const allCalendars = await Calendar.find()
      .populate("assignTeamMembers", "firstName lastName");

    if (!allCalendars || allCalendars.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No calendar entries found",
      });
    }

    // Map through the calendars to format assignTeamMembers
    const formattedCalendars = allCalendars.map((entry) => {
      const formattedEntry = entry.toObject();
      formattedEntry.assignTeamMembers = (formattedEntry.assignTeamMembers || []).map((member) => ({
        id: member._id.toString(),
        firstName: member.firstName,
        lastName: member.lastName,
      }));
      return formattedEntry;
    });

    res.status(200).json({
      success: true,
      calendars: formattedCalendars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

    

  //GET SINGLE AllSwms
  //METHOD:GET
  // const AllCalendar = async (req, res) => {
  //   try {
  //     const calendars = await Calendar.find()
  //       .populate('project', '_id name') // Project: ID + name
  //       .populate('assignTeamMembers', '_id name'); // User: ID + name
  
  //     if (!calendars || calendars.length === 0) {
  //       return res.status(404).json({ message: "No calendar entries found" });
  //     }
  
  //     res.status(200).json(calendars);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };
  
  
  
      //GET SINGLE DeleteSwms
  //METHOD:DELETE
  const deleteCalendar = async (req, res) => {
      let deleteCalendarID = req.params.id
      if (deleteCalendar) {
        const deleteCalendar = await Calendar.findByIdAndDelete(deleteCalendarID,req.body);
        res.status(200).json("Delete TimeSheet Successfully")
      } else {
        res.status(400).json({ message: "Not Delete TimeSheet" })
      }
    }
    
  
    //GET SINGLE SwmsUpdate
  //METHOD:PUT
  const UpdateCalendar = asyncHandler(async (req, res) => {
    try {
      const {
        taskTitle,
        description,
        project,
        taskType,
        startDate,
        endDate,
        color,
        reminders,
      } = req.body;
  
      // Parse team member IDs from form-data
      let assignTeamMembers = req.body["assignTeamMembers[]"];
      if (!assignTeamMembers) {
        assignTeamMembers = [];
      } else if (!Array.isArray(assignTeamMembers)) {
        assignTeamMembers = [assignTeamMembers]; // Ensure it's an array even for single value
      }
  
      // Validate required fields
      if (!taskTitle || !startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "taskTitle, startDate, and endDate are required",
        });
      }
  
      // Resolve project ObjectId
      let projectId;
      if (mongoose.Types.ObjectId.isValid(project)) {
        projectId = mongoose.Types.ObjectId(project);
      } else {
        const foundProject = await Project.findOne({ name: project });
        if (!foundProject) {
          return res.status(400).json({ success: false, message: "Project not found" });
        }
        projectId = foundProject._id;
      }
  
      // Parse dates
      const parsedStartDate = new Date(startDate.trim());
      const parsedEndDate = new Date(endDate.trim());
  
      // Validate and resolve team members
      const resolvedTeam = [];
      for (const userId of assignTeamMembers) {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(400).json({
            success: false,
            message: User `not found with ID: ${userId}`,
          });
        }
        resolvedTeam.push(user._id);
      }
  
      // Handle image uploads (if any)
      let imageUrls = [];
      if (req.files && req.files.image) {
        const files = Array.isArray(req.files.image) ? req.files.image : [req.files.image];
        for (const file of files) {
          const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "calendar_uploads",
            resource_type: "image",
          });
          if (uploadResult.secure_url) {
            imageUrls.push(uploadResult.secure_url);
          }
        }
      }
  
      const finalReminders = reminders || "";
  
      // Find calendar entry by ID
      const calendarEntry = await Calendar.findById(req.params.id);
      if (!calendarEntry) {
        return res.status(404).json({
          success: false,
          message: "Calendar entry not found",
        });
      }
  
      // Update fields
      calendarEntry.taskTitle = taskTitle;
      calendarEntry.description = description;
      calendarEntry.project = projectId;
      calendarEntry.taskType = taskType;
      calendarEntry.startDate = parsedStartDate;
      calendarEntry.endDate = parsedEndDate;
      calendarEntry.assignTeamMembers = resolvedTeam;
      calendarEntry.reminders = finalReminders;
      calendarEntry.color = color;
      if (imageUrls.length > 0) {
        calendarEntry.image = imageUrls;
      }
  
      await calendarEntry.save();
  
      // Populate user info
      const populatedCalendar = await Calendar.findById(calendarEntry._id).populate(
        "assignTeamMembers",
        "firstName lastName"
      );
  
      const calendar = populatedCalendar.toObject();
      calendar.assignTeamMembers = calendar.assignTeamMembers.map((member) => ({
        id: member._id.toString(),
        firstName: member.firstName,
        lastName: member.lastName,
      }));
  
      res.status(200).json({
        success: true,
        message: "Calendar entry updated successfully",
        calendar,
      });
    } catch (error) {
      console.error("Error updating calendar:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the calendar entry",
        error: error.message,
      });
    }
  });
  
  
  //METHOD:Single
  //TYPE:PUBLIC
  const SingleCalendar = async (req, res) => {
    try {
      // Find the calendar entry by ID
      const singleCalendar = await Calendar.findById(req.params.id)
        .populate("assignTeamMembers", "firstName lastName"); // Populate firstName and lastName of assigned team members
  
      if (!singleCalendar) {
        return res.status(404).json({ msg: "Calendar entry not found" });
      }
  
      // Map the assigned team members to include firstName and lastName
      const calendar = singleCalendar.toObject();
      calendar.assignTeamMembers = calendar.assignTeamMembers.map((member) => ({
        id: member._id.toString(),
        firstName: member.firstName,
        lastName: member.lastName,
      }));
  
      res.status(200).json(calendar);
    } catch (error) {
      res.status(500).json({ msg: "Can't find calendar entry", error: error.message });
    }
  };
  


  
module.exports = { CalendarCreate,AllCalendar,deleteCalendar,UpdateCalendar,SingleCalendar};