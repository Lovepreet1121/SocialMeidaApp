// social-media-frontend/src/components/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setMessage('Session expired. Please log in again.');
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
        setUsername(data.username || '');
        setBio(data.bio || ''); // Assuming your backend provides 'bio'
        setProfilePictureUrl(data.profilePictureUrl || ''); // Assuming 'profilePictureUrl'
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]); // Add navigate to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to update your profile.');
      setIsSuccess(false);
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({ username, bio, profilePictureUrl }), // Send updated fields
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Profile updated successfully!');
        setIsSuccess(true);
        // Optionally update the local user state after successful update
        setUser(prevUser => ({
          ...prevUser,
          username: username,
          bio: bio,
          profilePictureUrl: profilePictureUrl
        }));
      } else {
        setMessage(data.message || 'Failed to update profile.');
        setIsSuccess(false);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage('Network error or server unavailable.');
      setIsSuccess(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
  if (!user) return <div style={{ textAlign: 'center', padding: '20px' }}>No user data found.</div>;


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email (Cannot be changed):</label>
          <input
            type="email"
            id="email"
            value={user.email || ''} // Email is read-only
            disabled
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px' }}>Bio (Optional):</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="3"
            cols="30"
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ddd' }}
          ></textarea>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="profilePictureUrl" style={{ display: 'block', marginBottom: '5px' }}>Profile Picture URL (Optional):</label>
          <input
            type="url"
            id="profilePictureUrl"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
            placeholder="e.g., https://example.com/profile.jpg"
            style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>
        {profilePictureUrl && (
          <div style={{ marginBottom: '20px' }}>
            <img src={profilePictureUrl} alt="Profile Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%', border: '1px solid #ccc' }} />
          </div>
        )}
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Update Profile
        </button>
      </form>
      {message && <p style={{ marginTop: '15px', color: isSuccess ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default UserProfile;