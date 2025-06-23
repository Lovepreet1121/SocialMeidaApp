// social-media-backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // For protected routes, like getting auth user
const { check } = require('express-validator'); // If you are using express-validator

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register', // This is the endpoint the frontend hits
  [
    check('username', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  authController.signup // <--- CORRECTED: Now calls the 'signup' function from authController
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authController.login
);

// @route   GET api/auth
// @desc    Get user by token (authenticated user)
// @access  Private
router.get('/', auth, authController.getAuthenticatedUser);


module.exports = router;