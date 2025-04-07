const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true,
  },
  mobile: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github', 'linkedin'],
    default: 'local',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    code: {
      type: String,
    },
    expiry: {
      type: Date,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified or is new
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp.code = otp;
  
  // Set OTP expiry time (5 minutes from now)
  const otpExpiryTime = parseInt(process.env.OTP_EXPIRY) || 300000; // Default 5 min in ms
  this.otp.expiry = new Date(Date.now() + otpExpiryTime);
  
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(otp) {
  return this.otp.code === otp && this.otp.expiry > new Date();
};

// Static method to check if email exists
userSchema.statics.emailExists = async function(email) {
  const user = await this.findOne({ email });
  return !!user;
};

// Static method to check if mobile exists
userSchema.statics.mobileExists = async function(mobile) {
  const user = await this.findOne({ mobile });
  return !!user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 