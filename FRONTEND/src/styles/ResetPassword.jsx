import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError('');
  };

  const validateForm = () => {
    if (password.trim().length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      // In production, use this:
      /*
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: password
        })
      });

      if (response.ok) {
        navigate('/login', { replace: true });
        // Show success toast here
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Reset password failed. Please try again.');
      }
      */
      // For demonstration/testing:
      if (token === 'valid-token') {
        navigate('/login', { replace: true });
        // Show success toast here
      } else {
        setError('Invalid or expired token');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-input" style={{ position: 'relative' }}>
            <label htmlFor="password">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={handleChangePassword}
              required
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <div className="form-input" style={{ position: 'relative' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={handleChangeConfirmPassword}
              required
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
          
          {error && <p className="error">{error}</p>}
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;