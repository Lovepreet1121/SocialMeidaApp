// social-media-backend/routes/profile.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController'); // Correctly import the profileController

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, profileController.getMe);

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, profileController.createUpdateProfile);

// @route   GET /api/profile/:userId
// @desc    Get user profile by ID
// @access  Public
router.get('/:userId', profileController.getProfileById);

module.exports = router;