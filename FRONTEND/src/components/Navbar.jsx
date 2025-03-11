// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css'; // New CSS file for Navbar styling

const Navbar = ({ userRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Clear user state and localStorage
    navigate('/login'); // Redirect to login page
    setIsDropdownOpen(false); // Close dropdown after logout
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo-text">MEERA</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard" className="nav-link">Home</Link></li>
        <li><Link to="/inventory" className="nav-link">Product</Link></li>
      </ul>
      {user && (
        <div className="user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <span className="user-role">Welcome, {userRole}</span>
          {isDropdownOpen && (
            <div className="dropdown">
              <Link to="/profile" className="dropdown-item">Profile</Link>
              <Link to="/settings" className="dropdown-item">Settings</Link>
              <Link to="#" onClick={handleLogout} className="dropdown-item">Logout</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;