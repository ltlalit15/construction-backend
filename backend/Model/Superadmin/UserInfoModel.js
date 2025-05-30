const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SuperadminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    default: 'superadmin'
  },
  image: [],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

SuperadminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

SuperadminSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

SuperadminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Superadmin = mongoose.model('Superadmin', SuperadminSchema);





module.exports = Superadmin;
