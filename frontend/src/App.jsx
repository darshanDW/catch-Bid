import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Allauction from '../src/components/Allauction';

import Bid from '../src/components/Bid';
import CreateAuction from '../src/components/CreateAuction';
import Myauction from '../src/components/Myauction';
import UserInfo from '../src/components/UserInfo';
import AuthPage from '../src/components/AuthPage'; // Import AuthPage
import './App.css';
import { jwtDecode } from "jwt-decode";
function App() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userId, setUserId] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
      const storedToken = localStorage.getItem('token');
console.log("storedToken", storedToken);
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  console.log("storedToken", storedToken);

  if (storedToken) {
    try {
      const decoded = jwtDecode(storedToken);
      console.log("Decoded token:", decoded);

      setToken(storedToken);
      setUserId(decoded.userId);
      setName(decoded.name);
      setEmail(decoded.email);
      setIsAuthorized(true);
    } catch (error) {
      console.error("Invalid token:", error);
      setIsAuthorized(false);
      localStorage.removeItem('token'); // Clean up bad token
    }
  } else {
    setIsAuthorized(false);
  }
}, []);

  const handleAuthSuccess = (data) => {
    console.log('Authentication successful:', data);
    setToken(data.token);
    setUserId(data.userId);
    setName(data.name);
    setEmail(data.email);
    setIsAuthorized(true);
    localStorage.setItem('token', data.token);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setUserId(1);
    setName('');
    setEmail('');
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="app-container">
          {isAuthorized ? (
                    <header className="main-header">

            <nav className="nav-links">
              
              <Link to="/">Allauction</Link>
              <Link to="/create-auction">CreateAuction</Link>
              <Link to="/my-auction" property='userId'>Myauction</Link>
              <button onClick={handleLogout}>Logout</button>
            </nav>
                    </header>

          ) : (
            <AuthPage onAuthSuccess={handleAuthSuccess} /> // Use AuthPage here
          )}
        {isAuthorized && (
          <main>
            <Routes>
              <Route path="/" element={<Allauction userId={userId} />} />
              <Route path="/bid/:paramsId"  element={<Bid userId={userId} />} />
              <Route path="/create-auction" element={<CreateAuction userId={userId} />} />
              <Route path="/my-auction" element={<Myauction userId={userId} />} />
              <Route path="/user-info" element={<UserInfo userId={userId} />} />
            </Routes>
          </main>
        )}
        {!isAuthorized && (
          <main>
            <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>Please log in or sign up to access the app.</h2>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;