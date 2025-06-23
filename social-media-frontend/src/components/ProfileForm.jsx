// social-media-frontend/src/components/ProfileForm.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    profilePicture: '', // URL for the profile picture
    bio: '',
  });
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const navigate = useNavigate();

  const { name, profilePicture, bio } = formData;

  // Function to fetch the current user's profile data
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(''); // Clear previous errors
    const token = localStorage.getItem('token'); // Get the JWT token from local storage

    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      navigate('/login'); // Redirect to login if no token is found
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/profile/me', {
        headers: {
          'x-auth-token': token, // Send the token in the request headers for authentication
        },
      });
      const data = await response.json(); // Parse the JSON response

      if (response.ok) {
        // Set form data with fetched profile details, or empty strings if data is null/undefined
        setFormData({
          name: data.name || '',
          profilePicture: data.profilePicture || '',
          bio: data.bio || '',
        });
      } else {
        // Handle cases where profile is not found (404) or other fetch errors
        setError(data.msg || 'Failed to fetch profile.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Network error while fetching profile. Please try again.'); // Handle network issues
    } finally {
      setLoading(false); // Set loading to false once fetch is complete
    }
  }, [navigate]); // navigate is a dependency of this useCallback hook

  // useEffect to call fetchProfile when the component mounts or fetchProfile changes
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handles input changes to update form data state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission to update profile
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default browser form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors

    const token = localStorage.getItem('token'); // Get the JWT token
    if (!token) {
      setError('Please log in to update your profile.');
      navigate('/login');
      return;
    }

    try {
      // Send a POST request to update the profile
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST', // Use POST or PUT based on your backend API design for update
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token for authentication
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 2xx (success)
        setMessage('Profile updated successfully!');
      } else {
        // Handle backend-returned errors
        setError(data.msg || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Network error while updating profile. Please try again.'); // Handle network issues
    }
  };

  // Display loading message while fetching profile data
  if (loading) {
    return <p className="message">Loading profile...</p>;
  }

  return (
    <div className="form-container"> {/* Applying the 'form-container' class from App.css */}
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="profilePicture">Profile Picture URL:</label>
          <input
            type="text"
            id="profilePicture"
            name="profilePicture"
            value={profilePicture}
            onChange={handleChange}
            placeholder="e.g., https://example.com/your-image.jpg"
          />
          {/* Display a preview of the profile picture if a URL is provided */}
          {profilePicture && (
            <img
              src={profilePicture}
              alt="Profile Preview"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px', display: 'block', margin: '10px auto' }}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/100x100?text=Invalid+Image'; }} // Fallback for broken images
            />
          )}
        </div>
        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us a little about yourself (max 250 characters)"
          ></textarea>
        </div>
        <button type="submit">Update Profile</button>
      </form>
      {/* Display messages/errors with appropriate styling classes */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ProfileForm;