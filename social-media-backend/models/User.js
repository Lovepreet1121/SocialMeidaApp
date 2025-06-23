const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: { // Added for display name
    type: String,
  },
  profilePicture: { // Added for profile picture URL
    type: String,
    default: 'https://via.placeholder.com/150', // Default avatar
  },
  bio: { // Added for short bio
    type: String,
    maxlength: 250,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving (ensure this pre-save hook is present)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);