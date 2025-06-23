// social-media-backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Secret key for JWT (use a strong, random string in production via .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // CHANGE THIS FOR PRODUCTION

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
exports.signup = async (req, res) => {
    const { username, email, password, profilePicture, bio } = req.body;

    try {
        // Check if user already exists by email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Check if username already exists
        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Create new user instance
        user = new User({
            username,
            email,
            password, // Password will be hashed below
            profilePicture,
            bio
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ message: 'User registered successfully', token });
            }
        );

    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).send('Server error during signup');
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                // Return user details along with token
                res.json({ message: 'Logged in successfully', token, user: { id: user.id, username: user.username, email: user.email, profilePicture: user.profilePicture, bio: user.bio } });
            }
        );

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server error during login');
    }
};

// @route   GET /api/auth
// @desc    Get authenticated user data
// @access  Private (requires auth middleware)
exports.getAuthenticatedUser = async (req, res) => {
    try {
        // req.user.id is populated from the auth middleware
        const user = await User.findById(req.user.id).select('-password'); // -password means return everything except the password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching authenticated user:', err.message);
        res.status(500).send('Server error while fetching user data');
    }
};