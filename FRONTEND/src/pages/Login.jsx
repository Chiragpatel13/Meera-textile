import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
    
    // Clear error when typing
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!credentials.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!credentials.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Attempting login with:', { username: credentials.username });
      
      const response = await login(credentials);
      
      if (!response.token) {
        throw new Error('Authentication failed - no token received');
      }
      
      localStorage.setItem('token', response.token);
      console.log('Token stored successfully');
      
      if (!response.role) {
        throw new Error('Authentication failed - no role received');
      }
      
      authLogin({
        role: response.role,
        username: credentials.username
      });
      
      console.log('User logged in with role:', response.role);
      
      switch (response.role) {
        case 'STORE_MANAGER':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'SALES_STAFF':
          navigate('/sales/pos', { replace: true });
          break;
        case 'INVENTORY_STAFF':
          navigate('/inventory/manage', { replace: true });
          break;
        default:
          console.warn('Unknown role:', response.role);
          navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Mira Textile</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-input">
            <label htmlFor="username" style={{color: "black"}}>Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="e.g., john_doe"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-input" style={{ position: 'relative' }}>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
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
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting' : ''}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;