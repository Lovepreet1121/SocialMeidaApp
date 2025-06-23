const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: { // Reference to the User who created the post
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: { // The main content of the post
    type: String,
    required: true,
  },
  image: { // Optional: URL for an image if it's an image post
    type: String,
  },
  username: { // Store username for easier display without populating
    type: String,
  },
  profilePicture: { // Store profile picture URL for easier display
    type: String,
  },
  likesCount: { // Storing total number of likes/claps as per assignment
    type: Number,
    default: 0,
  },
  comments: [ // Array of comments (can expand later)
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', PostSchema);