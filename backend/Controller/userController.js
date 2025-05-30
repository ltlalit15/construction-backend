const User  = require('../Model/userModel');


const cloudinary = require('../Config/cloudinary');

cloudinary.config({
  cloud_name: 'dkqcqrrbp',
  api_key: '418838712271323',
  api_secret: 'p12EKWICdyHWx8LcihuWYqIruWQ'
});

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    // 1. Password confirmation check
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    // 2. Upload profile image to Cloudinary if present
    let profileImage = [];

    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'user_profiles',
        resource_type: 'image',
      });
      profileImage = result.secure_url;
    }

    // 3. Dynamically handle permissions from form data
    const permissionKeys = [
      'viewProjectDetails',
      'editProjectInformation',
      'manageTeamMembers',
      'accessFinancialData'
    ];
    
    const permissions = {};
    permissionKeys.forEach(key => {
      permissions[key] = req.body[key] === 'true';
    });

    // 4. Construct user data
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      role: req.body.role,
      department: req.body.department,
      profileImage,
      permissions
    };

    // 5. Save user
    const newUser = await User.create(userData);
    newUser.password = undefined; // Hide password in response

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // 1. Prevent password updates through this route
    // if (req.body.password || req.body.passwordConfirm) {
    //   return res.status(400).json({
    //     status: 'fail',
    //     message: 'This route is not for password updates. Please use /updatePassword.',
    //   });
    // }

    // 2. Upload profile image to Cloudinary if provided
    let profileImage = req.body.profileImage || null; // Default to the current profileImage if no new image

    if (req.files && req.files.image) {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'user_profiles',
        resource_type: 'image',
      });
      profileImage = result.secure_url;
    }

    // 3. Dynamically handle permissions from form data
    if (req.body.viewProjectDetails !== undefined ||
        req.body.editProjectInformation !== undefined ||
        req.body.manageTeamMembers !== undefined ||
        req.body.accessFinancialData !== undefined) {
      
      req.body.permissions = {
        viewProjectDetails: req.body.viewProjectDetails === 'true',
        editProjectInformation: req.body.editProjectInformation === 'true',
        manageTeamMembers: req.body.manageTeamMembers === 'true',
        accessFinancialData: req.body.accessFinancialData === 'true',
      };
    }

    // 4. Merge current profile image if no new one is uploaded and update user data
    const userData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      department: req.body.department,
      profileImage,
      permissions: req.body.permissions || {},
    };

    // 5. Update user in the database
    const user = await User.findByIdAndUpdate(req.params.id, userData, {
      new: true,
      runValidators: true,
    });

    // 6. If no user is found, return a 404 error
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID',
      });
    }

    // 7. Return the updated user data
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that ID'
      });
    }
    
    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


