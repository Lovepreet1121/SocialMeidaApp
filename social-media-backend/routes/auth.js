// social-media-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import the controller

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', authController.signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

module.exports = router; // Export the router instance