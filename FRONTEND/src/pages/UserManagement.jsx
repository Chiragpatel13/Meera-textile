import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserPlus, 
  FaUserCircle, 
  FaBars,
  FaSignOutAlt,
  FaKey,
  FaCalendarAlt,
  FaChartBar,
  FaBox,
  FaCashRegister,
  FaUsers,
  FaFolder,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import '../styles/dashboard.css';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'SALES_STAFF'
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [userData] = useState({
    name: 'Admin User',
    email: 'admin@miratextile.com'
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, using mock data
      const mockUsers = [
        {
          id: 1,
          username: 'john_doe',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'SALES_STAFF',
          createdAt: new Date(),
          active: true
        },
        {
          id: 2,
          username: 'jane_smith',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          role: 'INVENTORY_STAFF',
          createdAt: new Date(),
          active: true
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm) {
      setFilteredUsers(users);
        return;
      }

    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // For demo purposes, just filter out the user
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleResetPassword = () => {
    navigate('/ResetPassword');
  };

  const handleUser = () => {
    navigate('/Profile');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      password: '', // Don't show existing password
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Update user in the local state
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            username: formData.username,
            fullName: formData.fullName,
            email: formData.email,
            role: formData.role,
            // Only update password if a new one is provided
            ...(formData.password && { password: formData.password })
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setSuccessMessage('User updated successfully!');
      
      setTimeout(() => {
        setShowEditModal(false);
        resetForm();
      }, 1500);

    } catch (error) {
      console.error('Error updating user:', error);
      setErrorMessage('Failed to update user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (isEdit = false) => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!isEdit && !formData.password.trim()) errors.password = 'Password is required';
    if (formData.password.trim() && formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    if (!formData.role) errors.role = 'Role is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // For demo purposes, create a new user object
      const newUser = {
        id: users.length + 1,
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
        active: true
      };

      // Add the new user to the existing users array
      setUsers(prevUsers => [...prevUsers, newUser]);
      setSuccessMessage('User created successfully!');
      
      // Close modal and reset form after a short delay
      setTimeout(() => {
        setShowAddModal(false);
        resetForm();
      }, 1500);

    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
        setFormData({
            username: '',
            fullName: '',
            email: '',
            password: '',
            role: 'SALES_STAFF'
        });
    setFormErrors({});
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetForm();
  };

  const renderTableActions = (user) => (
    <div className="user-actions">
      <button className="action-btn edit-btn" onClick={() => handleEditUser(user)}>
            <FaEdit />
      </button>
      <button className="action-btn delete-btn" onClick={() => handleDeleteUser(user.id)}>
              <FaTrash />
      </button>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h3>Mira Textile</h3>
          <button className="collapse-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
        <ul className="sidebar-menu">
          <li className="active"><Link to="/dashboard"><FaChartBar /> <span>Dashboard</span></Link></li>
          <li><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/pos"><FaCashRegister /> <span>POS</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: sidebarCollapsed ? '70px' : '240px' }}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>User Management</h1>
            <p className="subtitle">Manage system users and their permissions</p>
          </div>
          <div className="top-bar-actions">
            <div className="date-display">
              <FaCalendarAlt />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
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
                      <span className="user-role">Admin</span>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="view-profile-btn" onClick={handleUser}>
                      <FaUserCircle /> View Profile
                    </button>
                    <button className="reset-password-btn" onClick={handleResetPassword}>
                      <FaKey /> Reset Password
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

        {/* User Management Content */}
        <div className="users-page">
          {/* Search and Actions Bar */}
          <div className="users-actions-bar">
            <div className="search-filter-container">
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name, username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <button className="add-user-btn" onClick={() => setShowAddModal(true)}>
              <FaUserPlus /> Add New User
            </button>
          </div>
          
          {/* Users Table */}
          <div className="users-card">
            <div className="users-table-header">
              <h2>User List</h2>
            </div>
            <div className="users-table-container">
              {isLoading ? (
                <div className="loading-state">Loading user data...</div>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created At</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role.toLowerCase()}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {renderTableActions(user)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="close-modal" onClick={handleCloseAddModal}>&times;</button>
            </div>
            <div className="modal-body">
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              
              <form onSubmit={handleAddUser}>
                <div className="form-group">
                  <label htmlFor="username">Username*</label>
                  <input
                    type="text"
                    id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                    placeholder="Enter username"
                    className={formErrors.username ? 'error' : ''}
                  />
                  {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name*</label>
                  <input
                    type="text"
                    id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={formErrors.fullName ? 'error' : ''}
                  />
                  {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <input
                    type="password"
                    id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                    placeholder="Enter password"
                    className={formErrors.password ? 'error' : ''}
                  />
                  {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role*</label>
                  <select
                    id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                    className={formErrors.role ? 'error' : ''}
                  >
                    <option value="SALES_STAFF">Sales Staff</option>
                    <option value="INVENTORY_STAFF">Inventory Staff</option>
                  </select>
                  {formErrors.role && <span className="error-message">{formErrors.role}</span>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseAddModal}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button className="close-modal" onClick={handleCloseEditModal}>&times;</button>
            </div>
            <div className="modal-body">
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}
              
              <form onSubmit={handleUpdateUser}>
                <div className="form-group">
                  <label htmlFor="username">Username*</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className={formErrors.username ? 'error' : ''}
                  />
                  {formErrors.username && <span className="error-message">{formErrors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fullName">Full Name*</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className={formErrors.fullName ? 'error' : ''}
                  />
                  {formErrors.fullName && <span className="error-message">{formErrors.fullName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={formErrors.password ? 'error' : ''}
                  />
                  {formErrors.password && <span className="error-message">{formErrors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role*</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={formErrors.role ? 'error' : ''}
                  >
                    <option value="SALES_STAFF">Sales Staff</option>
                    <option value="INVENTORY_STAFF">Inventory Staff</option>
                  </select>
                  {formErrors.role && <span className="error-message">{formErrors.role}</span>}
                </div>

                <div className="modal-footer">
                  <button type="button" className="cancel-btn" onClick={handleCloseEditModal}>Cancel</button>
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default UserManagement;