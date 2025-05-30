const asyncHandler = require("express-async-handler");
const Documents = require("../Model/DocumentsModel");
const User = require("../Model/userModel");
const cloudinary = require('../Config/cloudinary');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});



const DocumentsCreate = asyncHandler(async (req, res) => {
  const {
    documentName,
    documentType,
    assignTo,
    dueDate,
    status,
    comments
  } = req.body;

  
  // ✅ Check if assignTo user exists
  const user = await User.findById(assignTo);
  if (!user) {
    return res.status(404).json({ message: 'Assigned user not found' });
  }

  // Handle image upload
  let imageUrl = '';
  if (req.files && req.files.image) {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'uploads',  // Folder in Cloudinary where images are stored
        resource_type: 'image'
      });

      // Get the image URL from the Cloudinary response
      imageUrl = result.secure_url; // Secure URL to the uploaded image
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
    }
  }

  // Create new document in database
  const newDocument = await Documents.create({
    documentName,
    documentType,
    assignTo,
    dueDate,
    status,
    comments,
    image: imageUrl,  // Store the image URL in the database
  });

  res.status(201).json({
    success: true,
    message: 'Document created successfully',
    data: newDocument,
  });
});





//GET SINGLE AllProjects
//METHOD:GET
const AllDocuments = async (req, res) => {
  const allDocuments = await Documents.find()
    .populate('assignTo', 'firstName lastName'); // populate assignTo with selected user fields

  if (!allDocuments || allDocuments.length === 0) {
    res.status(404);
    throw new Error("Documents not found");
  }

  res.json(allDocuments);
};




//GET SINGLE DeleteProjects
//METHOD:DELETE
const deleteDocuments = async (req, res) => {
  let deleteDocumentsID = req.params.id
  if (deleteDocuments) {
    const deleteDocuments = await Documents.findByIdAndDelete(deleteDocumentsID, req.body);
    res.status(200).json("Delete Checklists Successfully")
  } else {
    res.status(400).json({ message: "Not Delete project" })
  }
}


//GET SINGLE ProjectsUpdate
//METHOD:PUT
const UpdateDocuments = asyncHandler(async (req, res) => {
  const {
    documentName,
    documentType,
    assignTo,
    dueDate,
    status,
    comments
  } = req.body;

  // Validate required fields
  if (
    !documentName ||
    !documentType ||
    !assignTo ||
    !dueDate ||
    !status ||
    !comments
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if assignTo user exists
  const user = await User.findById(assignTo);
  if (!user) {
    return res.status(404).json({ message: 'Assigned user not found' });
  }

  let imageUrl = '';

  // Handle image upload if a new image is provided
  if (req.files && req.files.image) {
    try {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'uploads',
        resource_type: 'image',
      });

      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: error.message });
    }
  }

  // Prepare update data
  const updateData = {
    documentName,
    documentType,
    assignTo,
    dueDate,
    status,
    comments,
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const updatedDocument = await Documents.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!updatedDocument) {
    return res.status(404).json({ message: 'Document not found' });
  }

  res.status(200).json({
    success: true,
    message: 'Document updated successfully',
    data: updatedDocument,
  });
});


//METHOD:Single
//TYPE:PUBLIC

const SingleDocuments = async (req, res) => {
  try {
    const singleDocument = await Documents.findById(req.params.id)
      .populate('assignTo', 'firstName lastName'); // Only populate specific fields

    if (!singleDocument) {
      return res.status(404).json({ msg: "Document not found" });
    }

    res.status(200).json(singleDocument);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};



module.exports = { DocumentsCreate, AllDocuments, deleteDocuments, UpdateDocuments, SingleDocuments };