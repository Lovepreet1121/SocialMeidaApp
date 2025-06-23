// social-media-frontend/src/components/CreatePost.jsx

import React, { useState } from 'react';

const CreatePost = ({ onPostCreated }) => {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(''); // State for image URL
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const [loading, setLoading] = useState(false); // Loading state for form submission

  // Handles post submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors
    setLoading(true);   // Set loading to true during submission

    const token = localStorage.getItem('token'); // Get the JWT token from local storage
    if (!token) {
      setError('Please log in to create a post.');
      setLoading(false);
      return;
    }

    if (!postText.trim() && !postImage.trim()) { // Post must have text or an image
      setError('Post cannot be empty. Please add text or an image URL.');
      setLoading(false);
      return;
    }

    try {
      // Send a POST request to your backend's post creation endpoint
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token for authentication
        },
        body: JSON.stringify({ text: postText, image: postImage }), // Send post data
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 2xx (success)
        setMessage('Post created successfully!');
        setPostText(''); // Clear text input field
        setPostImage(''); // Clear image URL field
        if (onPostCreated) {
          onPostCreated(data); // Call the prop function to inform parent (App.jsx)
        }
      } else {
        // Handle backend-returned errors
        setError(data.msg || 'Failed to create post.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Network error while creating post. Please try again.'); // Handle network issues
    } finally {
      setLoading(false); // Set loading to false once submission is complete
    }
  };

  return (
    <div className="create-post-container"> {/* Applying the 'create-post-container' class from App.css */}
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind? Share your thoughts!"
            rows="4"
            // The 'required' attribute can be handled by the JS validation now to allow image-only posts
          ></textarea>
        </div>
        <div>
          <input
            type="text"
            value={postImage}
            onChange={(e) => setPostImage(e.target.value)}
            placeholder="Image URL (optional)"
          />
        </div>
        <button type="submit" disabled={loading}> {/* Disable button while loading */}
          {loading ? 'Posting...' : 'Post'} {/* Change button text based on loading state */}
        </button>
      </form>
      {/* Display messages/errors with appropriate styling classes */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default CreatePost;