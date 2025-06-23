// social-media-backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // jwt.verify takes the token and the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload to request object
        req.user = decoded.user; // decoded.user should contain { id: user.id }
        next(); // Move to the next middleware/route handler
    } catch (err) {
        // This runs if token is not valid (e.g., expired, malformed)
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = auth;