const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model
        required: true
    },
    content: {
        type: String,
        required: function() { return !this.imageUrl; } // Required if imageUrl is not present
    },
    imageUrl: {
        type: String, // URL to image if post has an image
        required: function() { return !this.content; } // Required if content is not present
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add a pre-save hook to ensure at least one of content or imageUrl is present
postSchema.pre('validate', function(next) {
    if (!this.content && !this.imageUrl) {
        this.invalidate('content', 'Either content or imageUrl is required.');
        this.invalidate('imageUrl', 'Either content or imageUrl is required.');
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);