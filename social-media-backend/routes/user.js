// social-media-backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import the controller
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private (requires token)
router.get('/me', authMiddleware, userController.getMe);

// @route   PUT /api/users/me
// @desc    Update current user's profile
// @access  Private (requires token)
router.put('/me', authMiddleware, userController.updateMe);

// Future: Get any user's public profile (e.g., /api/users/:userId)
// router.get('/:userId', userController.getUserProfile);

module.exports = router;