// social-media-frontend/src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/Login'; // Assuming your login component is named Login.jsx
import Home from './components/Home'; // Simple Home component
import ProfileForm from './components/ProfileForm';
import CreatePost from './components/CreatePost';
import PostFeed from './components/PostFeed';
import './App.css'; // Import the main stylesheet for global and component-level styles

function App() {
  // State to track user authentication status based on the presence of a token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Function to update authentication status, called after successful login/logout
  const handleAuthChange = (status) => {
    setIsAuthenticated(status);
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the stored JWT token
    setIsAuthenticated(false); // Update authentication status to logged out
    // Optionally, you might want to navigate to the login page or home page after logout
  };

  return (
    <Router>
      <div className="App"> {/* Main app container for flexbox layout */}
        <nav> {/* Navigation bar, styled by App.css */}
          <ul>
            <li><Link to="/">Home</Link></li> {/* Link to the Home page */}
            {!isAuthenticated && <li><Link to="/login">Login</Link></li>} {/* Show Login if not authenticated */}
            {!isAuthenticated && <li><Link to="/signup">Signup</Link></li>} {/* Show Signup if not authenticated */}
            {isAuthenticated && <li><Link to="/edit-profile">Edit Profile</Link></li>} {/* Show Edit Profile if authenticated */}
            {isAuthenticated && <li><button onClick={handleLogout}>Logout</button></li>} {/* Show Logout if authenticated */}
          </ul>
        </nav>
        <Routes> {/* Defines the different routes in your application */}
          <Route path="/signup" element={<SignupForm />} /> {/* Route for the Signup form */}
          {/* Route for the Login form, passing a callback to update auth status on success */}
          <Route path="/login" element={<LoginForm onLoginSuccess={() => handleAuthChange(true)} />} />
          <Route path="/edit-profile" element={<ProfileForm />} /> {/* Route for the Profile editing form */}

          {/* The Home page route, which will display the Create Post form and the Post Feed */}
          <Route
            path="/"
            element={
              <div className="home-layout"> {/* Wrapper div for home page content, styled by App.css */}
                {/* Only display the CreatePost component if the user is authenticated */}
                {isAuthenticated && (
                  <CreatePost
                    onPostCreated={() => {
                      // This callback can be used to trigger a refresh of the PostFeed if needed.
                      // Currently, PostFeed fetches on mount, so it might not be strictly necessary
                      // unless you want a real-time update without full page refresh.
                    }}
                  />
                )}
                <PostFeed /> {/* Always display the PostFeed component */}
              </div>
            }
          />
          {/* Future routes for specific user profiles, individual posts, etc. can be added here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;