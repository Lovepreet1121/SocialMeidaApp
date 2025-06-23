// social-media-backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; // Ensure this matches your .env

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token'); // Common practice to send token in this header

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user; // Attach user payload (id) to the request object
        next(); // Move to the next middleware/route handler
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};