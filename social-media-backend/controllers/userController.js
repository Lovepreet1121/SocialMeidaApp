// social-media-backend/controllers/userController.js
const User = require('../models/User'); // Import the User model

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
exports.getMe = async (req, res) => {
    try {
        // req.user.id comes from authMiddleware
        const user = await User.findById(req.user.id).select('-password'); // This use of .select() is correct
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err.message);
        res.status(500).send('Server error fetching profile');
    }
};

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private
exports.updateMe = async (req, res) => {
    const { username, email, profilePicture, bio } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if new username/email already exists for *other* users
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername && existingUsername.id !== user.id) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail && existingEmail.id !== user.id) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // Update fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePicture = profilePicture || user.profilePicture;
        user.bio = bio || user.bio;

        await user.save();

        // >>>>>> FIX STARTS HERE <<<<<<
        // Convert to plain object and remove password before sending response
        const userResponse = user.toObject();
        delete userResponse.password;
        res.json({ message: 'Profile updated successfully', user: userResponse });
        // >>>>>> FIX ENDS HERE <<<<<<

    } catch (err) {
        console.error('Update profile error:', err.message);
        res.status(500).send('Server error updating profile');
    }
};