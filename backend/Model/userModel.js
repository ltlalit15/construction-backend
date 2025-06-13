const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
   
    
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    
    
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  profileImage: [],
  permissions: {
    viewProjectDetails: {
      type: Boolean,
      default: false
    },
    editProjectInformation: {
      type: Boolean,
      default: false
    },
    manageTeamMembers: {
      type: Boolean,
      default: false
    },
    accessFinancialData: {
      type: Boolean,
      default: false
    }
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // ✅ New fields for Forgot Password functionality
  passwordResetToken: String,
  passwordResetExpires: Date
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


// ✅ Create password reset token method
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
