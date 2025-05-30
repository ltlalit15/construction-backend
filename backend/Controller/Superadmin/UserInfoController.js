const Superadmin = require('../../Model/Superadmin/UserInfoModel');
const cloudinary = require('../../Config/cloudinary');
const asyncHandler = require('express-async-handler');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

const createSuperadmin = async (req, res) => {
  try {
    // Validate password confirmation
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    let imageUrl = [];  // Changed name to imageUrl

    // Log the uploaded files to see if the image is in the request
    console.log('Uploaded Files:', req.files);  // Check if req.files is populated

    // Check if an image file is uploaded
    if (req.files && req.files.profileImage) {
      const imageFile = req.files.profileImage;  // Get the uploaded image file
      console.log('Uploaded Image File:', imageFile);  // Log the file object

      // Log the file details
      console.log('File Temp Path:', imageFile.tempFilePath);
      console.log('File Name:', imageFile.name);

      // Upload the image to Cloudinary using the buffer directly
      const uploadResult = await cloudinary.uploader.upload(
        imageFile.tempFilePath, // Use tempFilePath for Cloudinary upload
        {
          folder: 'superadmin_profiles',
          resource_type: 'image', // Specify that the resource is an image
        }
      );

      // Log the Cloudinary upload result
      console.log('Cloudinary Upload Result:', uploadResult);  // Check if the upload was successful

      // Check if the upload was successful and get the secure URL
      if (uploadResult && uploadResult.secure_url) {
        imageUrl.push(uploadResult.secure_url);  // Save the secure URL in the imageUrl array
      } else {
        console.error('Cloudinary upload failed: No URL returned.');
      }
    } else {
      console.log('No image file uploaded.');
    }

    // Log the imageUrl before saving to DB
    console.log('Image URL to save:', imageUrl);

    // Create a new superadmin in the database
    const newSuperadmin = await Superadmin.create({
      firstName: req.body.firstName,
      email: req.body.email,
      password: req.body.password,
      image: imageUrl,  // Save the Cloudinary image URL in image
      role: 'superadmin',
      isAdmin: true,
    });

    // Remove the password from the response for security
    newSuperadmin.password = undefined;

    // Return the success response
    res.status(201).json({
      status: 'success',
      data: {
        superadmin: newSuperadmin,
      },
    });
  } catch (err) {
    // Handle errors and send failure response
    console.error('Error:', err);  // Log the error
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};


    
    //GET SINGLE AllSuperadmin
    //METHOD:GET
    const AllSuperadmin = async (req, res) => {
      try {
        const allSuperadmins = await Superadmin.find();
    
        if (!allSuperadmins || allSuperadmins.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Superadmins not found",
          });
        } 
        res.json({
          success: true,
          data: allSuperadmins,
        });
      } catch (error) {
        console.error("Error fetching superadmins:", error);
        res.status(500).json({
          success: false,
          message: "Failed to fetch superadmins",
          error: error.message,
        });
      }
    };
    
    
        //GET SINGLE DeleteProjects
    //METHOD:DELETE
    const deleteSuperadmin = async (req, res) => {
        let deleteSuperadminID = req.params.id
        if (deleteSuperadmin) {
          const deleteDefect = await Superadmin.findByIdAndDelete(deleteSuperadminID, req.body);
          res.status(200).json("Delete Defect Successfully")
        } else {
          res.status(400).json({ message: "Not Delete project" })
        }
      }
      
    
      //GET SINGLE ProjectsUpdate
    //METHOD:PUT
    const UpdateSuperadmin = asyncHandler(async (req, res) => {
      try {
        // Prepare the data to update
        const updateData = {
          firstName: req.body.firstName,
          email: req.body.email,
          password: req.body.password,
          role: 'superadmin',
          isAdmin: true,
        };
    
        // Log the uploaded files for debugging
        console.log('Uploaded Files:', req.files); 
    
        // Check if the image file is uploaded
        if (req.files && req.files.profileImage) {
          const imageFile = req.files.profileImage;  // Get the uploaded image file
          console.log('Uploaded Image File:', imageFile);  // Log the file object
    
          // Log the file details
          console.log('File Temp Path:', imageFile.tempFilePath);
          console.log('File Name:', imageFile.name);
    
          // Upload the image to Cloudinary
          const uploadResult = await cloudinary.uploader.upload(
            imageFile.tempFilePath, // Use tempFilePath for Cloudinary upload
            {
              folder: 'superadmin_profiles',  // Store in Cloudinary's folder
              resource_type: 'image',         // Specify that the resource is an image
            }
          );
    
          // Log the Cloudinary upload result
          console.log('Cloudinary Upload Result:', uploadResult);
    
          // Check if the upload was successful and save the secure URL
          if (uploadResult && uploadResult.secure_url) {
            updateData.profileImage = uploadResult.secure_url; // Save the Cloudinary image URL in profileImage
          } else {
            console.error('Cloudinary upload failed: No URL returned.');
          }
        } else {
          console.log('No image file uploaded.');
        }
    
        // Update the Superadmin data in the database
        const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
    
        // Check if the superadmin was found and updated
        if (!updatedSuperadmin) {
          return res.status(404).json({
            success: false,
            message: 'Superadmin not found',
          });
        }
    
        // Return success response
        res.status(200).json({
          success: true,
          message: 'Superadmin updated successfully',
          superadmin: updatedSuperadmin,
        });
      } catch (error) {
        // Handle any errors during the update process
        console.error('Error updating Superadmin:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    });
        
    
    //METHOD:Single
    //TYPE:PUBLIC
 
    const SingleSuperadmin = async (req, res) => {
        try {
            const SingleSuperadmin = await Superadmin.findById(req.params.id);
            res.status(200).json(SingleSuperadmin)
        } catch (error) {
          console.error("Error fetching Drawing Register:", error);
          res.status(500).json({
            success: false,
            message: "Failed to fetch Drawing Register",
            error: error.message,
        })
    }}
      

    // Superasdmin Setting Chang 
    const SuperasdminSettingChang = asyncHandler(async (req, res) => {
      try {
        const updateData = {
          firstName: req.body.firstName,
          // email: req.body.email,  // Email update disable kar diya
          password: req.body.password,
          role: 'Superadmin',
          isAdmin: true,
        };
    
        if (req.files && req.files.image) {
          const files = Array.isArray(req.files.image)
            ? req.files.image
            : [req.files.image];
    
          const imageUrls = [];
    
          for (const file of files) {
            const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
              folder: 'itp_uploads',
              resource_type: 'image',
            });
    
            if (uploadResult.secure_url) {
              imageUrls.push(uploadResult.secure_url);
            }
          }
    
          updateData.profileImage = imageUrls[0];
        }
    
        const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true }
        );
    
        if (!updatedSuperadmin) {
          return res.status(404).json({
            success: false,
            message: 'Superadmin not found',
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'Superadmin updated successfully',
          superadmin: updatedSuperadmin,
        });
      } catch (error) {
        console.error('Error updating Superadmin:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: error.message,
        });
      }
    });
    

  module.exports = {createSuperadmin,AllSuperadmin,deleteSuperadmin,UpdateSuperadmin,SingleSuperadmin,SuperasdminSettingChang};
    