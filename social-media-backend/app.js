// social-media-backend/app.js

// 1. Load environment variables first (e.g., MONGO_URL, JWT_SECRET)
require('dotenv').config();

// 2. Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing (CORS)

// 3. Initialize the Express application
const app = express(); // This line declares 'app' and should only appear ONCE!

// 4. Apply middleware
app.use(cors()); // Allows requests from your frontend to this backend
app.use(express.json()); // Parses incoming JSON requests into req.body

// 5. Import and use your API routes
// The path './routes/auth' is relative to this app.js file
const authRoutes = require('./routes/auth'); // <<< IMPORTANT: Re-importing authRoutes!
app.use('/api/auth', authRoutes); // All routes in auth.js will be prefixed with /api/auth
// social-media-backend/app.js (excerpt)

// ... (existing code for authRoutes) ...

// Import User and Post Routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

// Use User and Post Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Simple root route for testing (keep this)
app.get('/', (req, res) => {
    res.send('Social Media Backend API is running!');
});

// ... (rest of your code, MongoDB connection etc.) ...
// 6. Define a simple test route for the root URL
app.get('/', (req, res) => {
    res.send('Social Media Backend API is running!');
});

// 7. Connect to MongoDB and start the server
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('MongoDB connected successfully!');
        // Use the PORT provided by the hosting environment (like Render), or default to 5000
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('Please ensure your MONGO_URL in .env is correct and MongoDB Atlas IP access is configured.');
        process.exit(1); // Exit the process if the database connection fails
    });