// src/pages/Login.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === '5454') {
      login({ role: 'Manager', username: credentials.username });
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            label="Username or Email"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            error={error}
          />
          <div style={{ position: 'relative', width: '100%' }}>
          <FormInput 
            label="Password"
            type={showPassword ? "text" : "password"}
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            error={error}
          />
          <span 
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <button type="submit">Login</button>
          {error && <p className="error">{error}</p>}
          <p className="auth-footer">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;