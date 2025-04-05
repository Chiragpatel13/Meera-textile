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
      
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      let data;
      const contentType = response.headers.get('content-type');
      
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        const text = await response.text();
        console.log('Raw response:', text);
        throw new Error('Failed to parse server response');
      }
      
      if (response.ok) {
        if (!data.token) {
          console.error('No token in response:', data);
          throw new Error('Authentication failed - no token received');
        }
        
        localStorage.setItem('token', data.token);
        console.log('Token stored successfully');
        
        if (!data.role) {
          console.error('No role in response:', data);
          throw new Error('Authentication failed - no role received');
        }
        
        login({
          role: data.role,
          username: credentials.username
        });
        
        console.log('User logged in with role:', data.role);
        
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
            console.warn('Unknown role:', data.role);
            navigate('/dashboard', { replace: true });
        }
      } else {
        console.error('Login failed:', data);
        setError(data.message || 'Invalid username or password');
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