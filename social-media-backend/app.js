// social-media-backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // For cross-origin requests from your frontend
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable parsing JSON request bodies

// Simple root route for testing
app.get('/', (req, res) => {
    res.send('Social Media Backend API is running!');
});

// MongoDB Connection
console.log('Attempting to connect to MongoDB...'); // Just a confirmation message
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully!');
        const PORT = process.env.PORT || 5000; // Use Render's PORT or default to 5000 for local
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if database connection fails
    });