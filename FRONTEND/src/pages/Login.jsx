import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import LoadingAnimation from '../components/LoadingAnimation';
import '../styles/Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    if (token && userRole) {
      switch (userRole) {
        case 'ADMIN':
        case 'STORE_MANAGER':
          navigate('/dashboard', { replace: true });
          break;
        case 'SALES_STAFF':
          navigate('/sales', { replace: true });
          break;
        case 'INVENTORY_STAFF':
          navigate('/inventory', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    }
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

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
    // Basic validation
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
    setIsSubmitting(true);

    try {
      const data = await login(credentials);
      authLogin(data);

      // Role-based redirection
      switch (data.role) {
        case 'ADMIN':
        case 'STORE_MANAGER':
          navigate('/dashboard');
          break;
        case 'SALES_STAFF':
          navigate('/sales');
          break;
        case 'INVENTORY_STAFF':
          navigate('/inventory');
          break;
        default:
          setError('Invalid user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (pageLoading) {
    return <LoadingAnimation type="pulse" size="large" fullPage text="Loading Mira Textile..." />;
  }

  return (
    <div className="luxury-auth-container">
      <div className="luxury-auth-wrapper">
        <div className="luxury-auth-image">
          <div className="overlay">
            <div className="brand-content">
              <h1>Mira Textile</h1>
              <p>Clothing Management & Distribution System</p>
            </div>
          </div>
        </div>
        
        <div className="luxury-auth-form">
          <div className="logo-container">
            <img src="/templates/logo1.png" alt="Mira Textile Logo" className="auth-logo" />
          </div>
          
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>
          
          {error && (
            <div className="luxury-error">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="luxury-input-group">
              <div className="input-icon">
                <FaUser />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            
            <div className="luxury-input-group">
              <div className="input-icon">
                <FaLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <div 
                className="luxury-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            
            <div className="luxury-options">
              <label className="luxury-checkbox">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className={`luxury-button ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <LoadingAnimation size="small" />
              ) : (
                <>
                  <span>Sign In</span>
                  <FaSignInAlt />
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p> 2023 Mira Textile. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;