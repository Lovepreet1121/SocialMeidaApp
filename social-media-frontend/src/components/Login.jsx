// social-media-frontend/src/components/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation to signup

// Accept onLoginSuccess as a prop from App.jsx
const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState(''); // For success messages
  const [error, setError] = useState('');     // For error messages
  const navigate = useNavigate();

  const { email, password } = formData;

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
      // Send a POST request to your backend's login endpoint
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json(); // Parse the JSON response from the backend

      if (response.ok) { // Check if the response status is 2xx (success)
        localStorage.setItem('token', data.token); // Store the JWT token in local storage
        setMessage('Login successful!');
        if (onLoginSuccess) {
          onLoginSuccess(); // Call the prop function to inform App.jsx about successful login
        }
        setTimeout(() => navigate('/'), 1000); // Redirect to Home page after 1 second
      } else {
        // Handle backend-returned errors (e.g., invalid credentials)
        setError(data.msg || 'Login failed. Invalid credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Network error during login. Please try again later.'); // Handle network errors
    }
  };

  return (
    <div className="form-container"> {/* Applying the 'form-container' class from App.css */}
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      {/* Display messages/errors with appropriate styling classes */}
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Don't have an account? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>Sign up here</Link>
      </p>
    </div>
  );
};

export default LoginForm;