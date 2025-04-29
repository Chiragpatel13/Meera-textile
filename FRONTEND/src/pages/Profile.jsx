import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt,
  FaSync,
  FaBars,
  FaKey,
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaFolder
} from 'react-icons/fa';
import '../styles/dashboard.css';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:8082/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.full_name || '',
    phoneNumber: user?.phone_number || '',
    address: user?.address || '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.full_name || user?.username || 'Unknown User',
    email: user?.email || 'No email',
    phoneNumber: user?.phone_number || '',
    address: user?.address || ''
  });

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      
      // Update local storage with latest user data
      localStorage.setItem('userName', data.full_name || data.username);
      localStorage.setItem('userEmail', data.email);
      
      const updatedUserData = {
        name: data.full_name || data.username || 'Unknown User',
        email: data.email || 'No email',
        phoneNumber: data.phone_number || '',
        address: data.address || ''
      };

      setUserData(updatedUserData);
      setFormData(prev => ({
        ...prev,
        username: data.username,
        fullName: data.full_name || data.username,
        email: data.email,
        phoneNumber: data.phone_number || '',
        address: data.address || ''
      }));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      showToast('Failed to load profile. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }
    
    // Password validation (only if provided)
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const updateData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        address: formData.address
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch('http://localhost:8080/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      showToast('Profile updated successfully!', 'success');
      
      // Update local storage with new user data
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('userEmail', formData.email);
      
      // Update user data state
      setUserData({
        name: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Failed to update profile. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    setToast({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleLogout = async () => {
    try {
      // First navigate to login
      navigate('/login', { replace: true });
      // Then perform logout
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };
  const handleUser = () => {
    navigate('/Profile');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        closeUserMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>Store Manager</h3>
          <button className="collapse-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li><Link to="/dashboard"><FaChartBar /> <span>Dashboard</span></Link></li>
          <li><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/orders"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li><Link to="/customers"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/reports"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Profile</h1>
          </div>
          <div className="top-bar-actions">
            <button className="refresh-btn" onClick={fetchUserProfile}>
              <FaSync />
            </button>
            <div className="user-menu-container">
              <div className="user-profile-icon" onClick={toggleUserMenu}>
                <FaUserCircle />
              </div>
              {userMenuOpen && (
                <div className="user-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="user-details">
                      <h3>{userData.name || 'Demo User'}</h3>
                      <p>{userData.email || 'demo@miratextile.com'}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button onClick={handleLogout} className="logout-button">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`toast-notification ${toast.type}`}>
            {toast.message}
          </div>
        )}

        {/* Profile Content */}
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading profile data...</p>
            </div>
          ) : (
            <div className="profile-content">
              <div className="card profile-card">
                <div className="card-header">
                  <h2>User Profile</h2>
                </div>
                <div className="card-body">
                  <div className="profile-avatar">
                    <FaUserCircle />
                  </div>
                  <form onSubmit={handleSubmit} className="profile-form">
                    <div className="profile-form-grid">
                      <div className="form-field">
                        <label htmlFor="username">Username</label>
                        <div className="input-with-icon">
                          <FaUserCircle className="field-icon" />
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            disabled
                            className="disabled-field"
                          />
                        </div>
                        <p className="field-help">Username cannot be changed</p>
                      </div>

                      <div className="form-field">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                          <FaKey className="field-icon" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g., john@example.com"
                            className={errors.email ? 'error-input' : ''}
                          />
                        </div>
                        {errors.email && <p className="form-error">{errors.email}</p>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-with-icon">
                          <FaUserCircle className="field-icon" />
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="e.g., John Doe"
                            className={errors.fullName ? 'error-input' : ''}
                          />
                        </div>
                        {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                      </div>

                      <div className="form-field">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-with-icon">
                          <FaKey className="field-icon" />
                          <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="e.g., +1 (555) 123-4567"
                            className={errors.phoneNumber ? 'error-input' : ''}
                          />
                        </div>
                        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
                      </div>

                      <div className="form-field full-width">
                        <label htmlFor="address">Address</label>
                        <div className="input-with-icon">
                          <FaKey className="field-icon" />
                          <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g., 123 Main St, City, State, ZIP"
                            className={errors.address ? 'error-input' : ''}
                          />
                        </div>
                        {errors.address && <p className="form-error">{errors.address}</p>}
                      </div>

                      <div className="form-field full-width">
                        <label htmlFor="password">New Password (optional)</label>
                        <div className="input-with-icon">
                          <FaKey className="field-icon" />
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            placeholder="New password"
                            className={errors.password ? 'error-input' : ''}
                          />
                        </div>
                        {errors.password && <p className="form-error">{errors.password}</p>}
                        <p className="field-help">Leave blank to keep current password</p>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button 
                        type="submit" 
                        className="update-profile-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;