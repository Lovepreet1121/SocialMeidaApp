const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User profile not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
exports.createUpdateProfile = async (req, res) => {
  const { name, profilePicture, bio } = req.body;

  const profileFields = {};
  if (name) profileFields.name = name;
  if (profilePicture) profileFields.profilePicture = profilePicture;
  if (bio) profileFields.bio = bio;

  try {
    let user = await User.findById(req.user.id);

    if (user) {
      user = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: profileFields },
        { new: true }
      ).select('-password');
      return res.json(user);
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user profile by ID
// @route   GET /api/profile/:userId
// @access  Public
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
};