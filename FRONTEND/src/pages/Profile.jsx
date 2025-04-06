import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaLock,
  FaBox, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaFolder,
  FaPlus, 
  FaChartBar, 
  FaUsers,
  FaUserPlus,
  FaSync,
  FaSignOutAlt,
  FaBars,
  FaKey
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';

const API_BASE_URL = 'http://localhost:8082/api';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });

  useEffect(() => {
    fetchProfileData();
    fetchUserData();
  }, []);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('token');
        navigate('/Login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setFormData({
          username: data.data.username || '',
          email: data.data.email || '',
          password: ''
        });
        
        setUserData({
          name: data.data.fullName || data.data.username || 'Unknown User',
          email: data.data.email || 'No email'
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/current`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('token');
        navigate('/Login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setUserData({
          name: data.data.fullName || data.data.username || 'Unknown User',
          email: data.data.email || 'No email'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showToast('Failed to load user data', 'error');
    }
  };

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
        navigate('/Login');
        return;
      }
      
      // Create request payload
      const payload = {
        email: formData.email,
        username: formData.username
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.status === 403 || response.status === 401) {
        localStorage.removeItem('token');
        navigate('/Login');
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      if (data.success) {
        // Reset password field
        setFormData(prev => ({
          ...prev,
          password: ''
        }));
        
        // Update user data in the menu
        setUserData({
          name: data.data.fullName || data.data.username || userData.name,
          email: data.data.email || userData.email
        });
        
        showToast('Profile updated successfully', 'success');
        
        // Refresh the profile data
        await fetchProfileData();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.message || 'Failed to update profile', 'error');
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/Login');
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
            <button className="refresh-btn" onClick={fetchProfileData}>
              <FaSync />
            </button>
            <div className="user-menu-container">
              <button className="user-menu-btn" onClick={toggleUserMenu}>
                <FaUserCircle />
              </button>
              
              {userMenuOpen && (
                <div className="user-popup">
                  <div className="user-info">
                    <div className="user-avatar">
                      <FaUserCircle />
                    </div>
                    <div className="user-details">
                      <h3>{userData.name}</h3>
                      <p>{userData.email}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                      <FaKey /> Reset Password
                    </button>
                    <button className="reset-password-btn" onClick={handleUser}>
                      <AiFillIdcard /> User Profile
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
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
            <div className="loading">Loading profile data...</div>
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
                        <FaEnvelope className="field-icon" />
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
                      <label htmlFor="password">New Password (optional)</label>
                      <div className="input-with-icon">
                        <FaLock className="field-icon" />
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="New password"
                          className={errors.password ? 'error-input' : ''}
                        />
                      </div>
                      {errors.password && <p className="form-error">{errors.password}</p>}
                      <p className="field-help">Leave blank to keep current password</p>
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