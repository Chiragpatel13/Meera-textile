// src/pages/Signup.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import '../styles/Auth.css';

const Signup = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.username && userData.email && userData.password) {
      navigate('/login');
    } else {
      setError('All fields are required');
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            label="Username"
            type="text"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            error={error}
          />
          <FormInput
            label="Email"
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            error={error}
          />
          <div style={{ position: 'relative', width: '100%' }}>
          <FormInput
            label="Password"
            type={showPassword ? "text" : "password"}
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            error={error}
          />
          <span 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          </div>
          <button type="submit">Sign Up</button>
          {error && <p className="error">{error}</p>}
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;