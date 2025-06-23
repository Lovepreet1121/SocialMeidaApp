// social-media-backend/routes/post.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController'); // Import the controller
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (requires token)
router.post('/', authMiddleware, postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts (global feed)
// @access  Public (or Private depending on your design choice)
router.get('/', postController.getPosts); // No authMiddleware for public feed

// @route   PUT /api/posts/like/:id
// @desc    Increment likes on a post
// @access  Private (requires token)
router.put('/like/:id', authMiddleware, postController.likePost);

module.exports = router;