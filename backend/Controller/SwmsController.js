const asyncHandler = require("express-async-handler");
const Swms=require("../Model/SwmsModel")
const User = require("../Model/userModel");

const SwmsCreate = asyncHandler(async (req, res) => {
  const {
    userId,
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
    workActivities,  // Added workActivities field
    hazardIdentification,  // Added hazardIdentification field
    requiredPPE,
    status,
  } = req.body;

  // Ensure all fields are present
  if (
    !userId ||
    !swmsName ||
    !siteAddress ||
    !companyName ||
    !responsiblePersonName ||
    !dateCreated ||
    !companyInformation ||
    !companyInformation.companyName ||
    !companyInformation.address ||
    !companyInformation.contactNumber ||
    !companyInformation.principalContractor.name ||
    !companyInformation.principalContractor.contactPerson ||
    !companyInformation.principalContractor.contactNumber ||
    !workActivities || // Validate workActivities
    !hazardIdentification || // Validate hazardIdentification
    !requiredPPE ||
    !Array.isArray(requiredPPE.predefined) ||
    !status

  ) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

   // Find the user and get the first name and last name
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  // Create new SWMS
  const newSwms = await Swms.create({
    userId,
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
     workActivities,  // Include workActivities
    hazardIdentification,  // Include hazardIdentification
    requiredPPE,
    status,
  });

  res.status(201).json({
    status: true,
    message: "Created SWMS successfully",
    data: newSwms,
  });
});

// GET ALL SWMS
const AllSwms = async (req, res) => {
  try {
    // Populate the userId field to get the user’s id, firstName, and lastName
    const allSwms = await Swms.find()
      .populate('userId', '_id firstName lastName'); // Populate user data with id, firstName, and lastName

    if (!allSwms || allSwms.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No SWMS found",
      });
    }

    // Map through all SWMS and include user details (firstName, lastName)
    const swmsData = allSwms.map(swms => {
      if (swms.userId) {
        return {
          ...swms.toObject(),
          userId: {
            id: swms.userId._id,           // Include _id as 'id'
            firstName: swms.userId.firstName,
            lastName: swms.userId.lastName,
          }
        };
      } else {
        return {
          ...swms.toObject(),
          userId: null,  // Handle case where userId is missing or not populated
        };
      }
    });

    res.status(200).json({
      status: true,
      message: "Fetched SWMS successfully",
      data: swmsData,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// DELETE SWMS
const deleteSwms = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSwms = await Swms.findByIdAndDelete(id);

    if (!deletedSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "SWMS deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting SWMS",
      error: error.message,
    });
  }
};

// UPDATE SWMS
const UpdateSwms = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
    workActivities,
    hazardIdentification,
    requiredPPE,
    status,
  } = req.body;

  // Validate all required fields (same as create)
  if (
    !userId ||
    !swmsName ||
    !siteAddress ||
    !companyName ||
    !responsiblePersonName ||
    !dateCreated ||
    !companyInformation ||
    !companyInformation.companyName ||
    !companyInformation.address ||
    !companyInformation.contactNumber ||
    !companyInformation.principalContractor?.name ||
    !companyInformation.principalContractor?.contactPerson ||
    !companyInformation.principalContractor?.contactNumber ||
    !workActivities ||
    !hazardIdentification ||
    !requiredPPE ||
    !Array.isArray(requiredPPE.predefined) ||
    !status
  ) {
    return res.status(400).json({
      status: false,
      message: "All fields are required",
    });
  }

   // Find the user by ID to get first name and last name
  const user = await User.findById(req.body.userId);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  // Build update object with all fields
  const updateData = {
    userId,
    swmsName,
    siteAddress,
    companyName,
    responsiblePersonName,
    dateCreated,
    companyInformation,
    workActivities,
    hazardIdentification,
    requiredPPE,
    status,
  };

  try {
    const updatedSwms = await Swms.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,  // Make sure mongoose validates update data too
    });

    if (!updatedSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "SWMS updated successfully",
      data: updatedSwms,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
});


// GET SINGLE SWMS
const SingleSwms = async (req, res) => {
  try {
    // Fetch the SWMS document by its ID and populate the userId field with firstName, lastName, and _id
    const singleSwms = await Swms.findById(req.params.id)
      .populate('userId', '_id firstName lastName');  // Populate user data (id, firstName, lastName)

    if (!singleSwms) {
      return res.status(404).json({
        status: false,
        message: "SWMS not found",
      });
    }

    // Return the SWMS with user details
    res.status(200).json({
      status: true,
      message: "Fetched SWMS successfully",
      data: {
        ...singleSwms.toObject(),
        userId: {  // Including the user details
          id: singleSwms.userId._id,  // Add user _id as id
          firstName: singleSwms.userId.firstName,
          lastName: singleSwms.userId.lastName
        }
      },
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching SWMS",
      error: error.message,
    });
  }
};



module.exports = {SwmsCreate,AllSwms,deleteSwms,UpdateSwms,SingleSwms};

