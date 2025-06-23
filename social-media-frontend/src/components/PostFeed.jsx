// social-media-frontend/src/components/PostFeed.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for fetching posts
  const [error, setError] = useState('');     // Error state for fetching posts
  const navigate = useNavigate();

  // Function to fetch all posts from the backend
  const fetchPosts = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError('');     // Clear previous errors
    try {
      const response = await fetch('http://localhost:5000/api/posts'); // Fetch posts from backend
      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 2xx (success)
        setPosts(data); // Update posts state with fetched data
      } else {
        // Handle backend-returned errors
        setError(data.msg || 'Failed to fetch posts.');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Network error while fetching posts. Please try again.'); // Handle network issues
    } finally {
      setLoading(false); // Set loading to false once fetch is complete
    }
  }, []); // Empty dependency array means this function is created once

  // useEffect hook to fetch posts when the component mounts
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Re-run effect if fetchPosts callback changes (unlikely with useCallback here)

  // Handles liking a post
  const handleLike = async (postId) => {
    const token = localStorage.getItem('token'); // Get the JWT token from local storage
    if (!token) {
      alert('Please log in to like a post.'); // Simple alert for unauthenticated likes
      navigate('/login'); // Redirect to login page
      return;
    }

    try {
      // Send a PUT request to the like endpoint
      const response = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token for authentication
        },
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 2xx (success)
        // Update the likesCount for the specific post in the current state
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, likesCount: data.likesCount } : post
          )
        );
      } else {
        alert(data.msg || 'Failed to like post.'); // Display error for liking
      }
    } catch (err) {
      console.error('Error liking post:', err);
      alert('Network error while liking post.'); // Handle network issues
    }
  };

  // Display loading message
  if (loading) {
    return <p className="message">Loading posts...</p>;
  }

  // Display error message if fetching failed
  if (error) {
    return <p className="message error">{error}</p>;
  }

  return (
    <div className="post-feed-container"> {/* Applying the 'post-feed-container' class from App.css */}
      <h2>Global Feed</h2>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>No posts yet. Be the first to create one!</p>
      ) : (
        // Map through posts and render each one
        posts.map((post) => (
          <div key={post._id} className="post-card"> {/* Applying 'post-card' class to each post */}
            <div className="post-header"> {/* Applying 'post-header' class for user info section */}
              <img
                src={post.profilePicture || 'https://via.placeholder.com/48x48/CCCCCC/000000?text=P'} // Default placeholder if no picture
                alt="Profile"
              />
              <div>
                <h4>{post.username || 'Unknown User'}</h4>
                <p>{new Date(post.date).toLocaleString()}</p> {/* Format date for display */}
              </div>
            </div>
            <p className="post-text">{post.text}</p> {/* Applying 'post-text' class for post content */}
            {post.image && ( // Conditionally render image if available
              <img
                src={post.image}
                alt="Post"
                className="post-image" /* Applying 'post-image' class */
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=Image+Load+Error'; }} // Fallback for broken images
              />
            )}
            <div className="post-actions"> {/* Applying 'post-actions' class for like button */}
              <button onClick={() => handleLike(post._id)}>
                ❤️ Like <span>({post.likesCount || 0})</span> {/* Display like count */}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;