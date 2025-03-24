import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
    if (credentials.username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }
    if (!credentials.password.trim()) {
      setError('Password is required');
      return false;
    }
    if (credentials.password.trim().length < 8) {
      setError('Password must be at least 8 characters');
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
      // For demonstration/testing
      if (credentials.username === 'admin' && credentials.password === 'password123') {
        login({ 
          role: 'STORE_MANAGER', 
          username: credentials.username 
        });
        navigate('/admin/dashboard', { replace: true });
      } else if (credentials.username === 'sales' && credentials.password === 'password123') {
        login({ 
          role: 'SALES_STAFF', 
          username: credentials.username 
        });
        navigate('/sales/pos', { replace: true });
      } else if (credentials.username === 'inventory' && credentials.password === 'password123') {
        login({ 
          role: 'INVENTORY_STAFF', 
          username: credentials.username 
        });
        navigate('/inventory/manage', { replace: true });
      } else {
        setError('Invalid username or password');
      }
      
      // In production, use this code instead:
      /*
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Store JWT token
        localStorage.setItem('token', data.token);
        
        // Log in user
        login({
          role: data.role,
          username: credentials.username
        });
        
        // Redirect based on user role
        switch (data.role) {
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
            navigate('/dashboard', { replace: true });
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed. Please try again.');
      }
      */
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
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
            <label htmlFor="username">Username</label>
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