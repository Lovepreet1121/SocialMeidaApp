// social-media-frontend/src/components/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection after signup

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(''); // Clear previous messages

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Signup successful!');
        // Optional: Store token in localStorage if you want immediate login
        // localStorage.setItem('token', data.token);
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('Network error or server unavailable.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '8px', width: '200px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Signup
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: response.ok ? 'green' : 'red' }}>{message}</p>}
      <p style={{ marginTop: '20px' }}>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Signup;