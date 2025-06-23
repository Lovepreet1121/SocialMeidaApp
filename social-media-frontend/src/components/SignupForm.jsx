// social-media-frontend/src/components/SignupForm.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- ADD Link HERE

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const navigate = useNavigate();

  const { username, email, password } = formData;

  // Handles input changes to update form data state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default browser form submission
    setMessage('');     // Clear previous messages
    setError('');       // Clear previous errors

    try {
      // Send a POST request to your backend's signup endpoint
      const response = await fetch('http://localhost:5000/api/auth/register', { // Assuming /api/auth/register as per your backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (response.ok) { // Check if the response status is 2xx (success)
        setMessage(data.msg || 'Signup successful! Please log in.');
        // After successful signup, clear the form or redirect
        setFormData({ username: '', email: '', password: '' }); // Clear form
        setTimeout(() => navigate('/login'), 2000); // Redirect to login page after 2 seconds
      } else {
        // Handle backend-returned errors (e.g., user already exists, validation issues)
        setError(data.msg || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError('Network error during signup. Please try again later.'); // Handle network errors
    }
  };

  return (
    <div className="form-container"> {/* Applying the 'form-container' class from App.css */}
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {/* Display messages/errors with appropriate styling classes */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

export default SignupForm;