import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddUser.css';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    role: 'SALES_STAFF'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log('Sending user creation request:', formData);
      
      const response = await fetch('http://localhost:8082/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to create user');
      }

      setSuccess('User created successfully! A default password has been set and sent to their email.');
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: 'SALES_STAFF'
      });
      
      // Navigate to UserManagement page after successful creation
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message || 'An error occurred while creating the user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <div className="add-user-card">
        <h2>Add New User</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="add-user-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="SALES_STAFF">Sales Staff</option>
              <option value="INVENTORY_STAFF">Inventory Staff</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </button>
            <button type="button" onClick={() => navigate('/admin/dashboard')} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser; 