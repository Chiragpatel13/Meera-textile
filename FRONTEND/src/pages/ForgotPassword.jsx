import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setSuccessMessage('Password reset instructions have been sent to your email.');
    setError('');
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Forgot Password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <FormInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          
          <p className="instructions">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          <button type="submit">Reset Password</button>
          
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          
          <p className="auth-footer">
            Remember your password? <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;