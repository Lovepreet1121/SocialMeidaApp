// social-media-backend/routes/posts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController'); // Correctly import the postController

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, postController.createPost);

// @route   GET /api/posts
// @desc    Get all posts (for global feed)
// @access  Public
router.get('/', postController.getPosts);

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get('/:id', postController.getPostById);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, postController.deletePost);

// @route   PUT /api/posts/like/:id
// @desc    Like/Clap a post (multiple likes allowed)
// @access  Private
router.put('/like/:id', auth, postController.likePost);

module.exports = router;