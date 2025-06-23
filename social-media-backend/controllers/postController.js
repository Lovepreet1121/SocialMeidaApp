// social-media-backend/controllers/postController.js
const Post = require('../models/Post'); // Import Post model
const User = require('../models/User'); // Import User model (for population)

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
exports.createPost = async (req, res) => {
    const { content, imageUrl } = req.body;

    try {
        // Check if at least one of content or imageUrl is provided
        if (!content && !imageUrl) {
            return res.status(400).json({ message: 'Post must contain either content or an image URL' });
        }

        const newPost = new Post({
            userId: req.user.id, // User ID comes from authMiddleware
            content,
            imageUrl
        });

        const post = await newPost.save();
        res.status(201).json({ message: 'Post created successfully', post });

    } catch (err) {
        console.error('Create post error:', err.message);
        res.status(500).send('Server error creating post');
    }
};

// @route   GET /api/posts
// @desc    Get all posts (global feed)
// @access  Public (or Private if you want to restrict feed)
exports.getPosts = async (req, res) => {
    try {
        // Fetch posts, sort by creation date (newest first) and populate user info
        const posts = await Post.find()
            .populate('userId', 'username profilePicture') // Get username and profilePicture from User model
            .sort({ createdAt: -1 }); // Newest posts first

        res.json(posts);
    } catch (err) {
        console.error('Get posts error:', err.message);
        res.status(500).send('Server error fetching posts');
    }
};

// @route   PUT /api/posts/like/:id
// @desc    Increment likes on a post
// @access  Private
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment likes count
        post.likes += 1; // Allows multiple likes from same user as per assignment

        await post.save();
        res.json({ message: 'Post liked successfully', likes: post.likes });

    } catch (err) {
        console.error('Like post error:', err.message);
        res.status(500).send('Server error liking post');
    }
};

// Optional: Delete Post
// exports.deletePost = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: 'Post not found' });
//         // Ensure user owns post
//         if (post.userId.toString() !== req.user.id) {
//             return res.status(401).json({ message: 'User not authorized' });
//         }
//         await post.remove();
//         res.json({ message: 'Post removed' });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// };