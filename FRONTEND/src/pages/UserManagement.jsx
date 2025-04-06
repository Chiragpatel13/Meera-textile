import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  FaBox, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaFolder,
  FaPlus, 
  FaChartBar, 
  FaUsers,
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaKey,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUserPlus,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';

const API_BASE_URL = 'http://localhost:8082/api';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    role: 'SALES_STAFF'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchUserData();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { success: false, message: 'Failed to parse server response' };
      }
      
      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to fetch users');
      }
      
      setUsers(responseData.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to fetch users',
        severity: 'error'
      });
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/admin/users/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setUserData({
          name: data.data.fullName || 'Unknown User',
          email: data.data.email || 'No email'
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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

  const handleOpenModal = (isEdit = false, user = null) => {
    setIsEditing(isEdit);
    if (isEdit && user) {
      setEditUserId(user.userId);
      setFormData({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      });
    } else {
      // Reset form for add
      setFormData({
        username: '',
        fullName: '',
        email: '',
        role: 'SALES_STAFF'
      });
    }
    setFormErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData({
      username: '',
      fullName: '',
      email: '',
      role: 'SALES_STAFF'
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear specific error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.username?.trim()) {
        errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }
    
    // Full name validation
    if (!formData.fullName?.trim()) {
        errors.fullName = 'Full name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address';
    }
    
    // Role validation
    if (!formData.role) {
        errors.role = 'Role is required';
    }
    
    // Password validation (only for new users)
    if (!isEditing && formData.password?.trim().length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  };

  const handleSaveUser = async () => {
    try {
        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setToast({
                open: true,
                message: 'Please fill in all required fields correctly',
                severity: 'error'
            });
            return;
        }

        // Create request data
        const requestData = {
            username: formData.username.trim(),
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            role: formData.role
        };

        // Only include password if it's provided (for new users or password changes)
        if (formData.password && formData.password.trim()) {
            requestData.password = formData.password.trim();
        }

        console.log('Sending request data:', requestData);

        const token = localStorage.getItem('token');
        if (!token) {
            setToast({
                open: true,
                message: 'Authentication token not found. Please login again.',
                severity: 'error'
            });
            return;
        }

        // Log the full request details for debugging
        console.log('API URL:', `${API_BASE_URL}/admin/users`);
        console.log('Request headers:', {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.substring(0, 10)}...` // Only log part of the token for security
        });
        console.log('Request body:', JSON.stringify(requestData, null, 2));

        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(requestData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries([...response.headers]));
        
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let data;
        try {
            data = JSON.parse(responseText);
            console.log('Parsed response data:', data);
        } catch (parseError) {
            console.error('Error parsing response:', parseError);
            console.error('Response text that failed to parse:', responseText);
            setToast({
                open: true,
                message: `Invalid response from server: ${parseError.message}. Please check server logs.`,
                severity: 'error'
            });
            return;
        }

        if (!response.ok) {
            console.error('Error response:', data);
            if (data.message) {
                if (data.message.includes('already taken')) {
                    setFormErrors({ username: 'Username is already taken' });
                    setToast({
                        open: true,
                        message: 'Username is already taken',
                        severity: 'error'
                    });
                } else if (data.message.includes('already registered')) {
                    setFormErrors({ email: 'Email is already registered' });
                    setToast({
                        open: true,
                        message: 'Email is already registered',
                        severity: 'error'
                    });
                } else if (data.message.includes('Role must be either SALES_STAFF or INVENTORY_STAFF')) {
                    setFormErrors({ role: 'Invalid role selected' });
                    setToast({
                        open: true,
                        message: 'Invalid role selected. Must be either SALES_STAFF or INVENTORY_STAFF',
                        severity: 'error'
                    });
                } else {
                    setToast({
                        open: true,
                        message: data.message || 'Failed to save user',
                        severity: 'error'
                    });
                }
            } else {
                setToast({
                    open: true,
                    message: `Failed to save user. Server returned status ${response.status}. Please check server logs.`,
                    severity: 'error'
                });
            }
            return;
        }

        // Show success message
        setToast({
            open: true,
            message: 'User created successfully! A password has been sent to their email.',
            severity: 'success'
        });
        
        // Refresh the users list
        await fetchUsers();
        
        // Close modal and clear form
        handleCloseModal();
        setFormData({
            username: '',
            fullName: '',
            email: '',
            password: '',
            role: 'SALES_STAFF'
        });
    } catch (err) {
        console.error('Error in handleSaveUser:', err);
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        setToast({
            open: true,
            message: `Error: ${err.message}. Please check server logs.`,
            severity: 'error'
        });
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userToDelete.userId}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }
      
      await fetchUsers(); // Refresh the user list
      setToast({
        open: true,
        message: 'User deactivated successfully',
        severity: 'success'
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deactivating user:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to deactivate user',
        severity: 'error'
      });
    }
  };

  const handleCloseToast = () => {
    setToast({
      ...toast,
      open: false
    });
  };

  const handleActivateUser = async (user) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${user.userId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to activate user');
      }
      
      await fetchUsers(); // Refresh the user list
      setToast({
        open: true,
        message: 'User activated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error activating user:', error);
      setToast({
        open: true,
        message: error.message || 'Failed to activate user',
        severity: 'error'
      });
    }
  };

  const columns = [
    { field: 'userId', headerName: 'ID', width: 70 },
    { field: 'username', headerName: 'Username', width: 180 },
    { field: 'fullName', headerName: 'Full Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'role', headerName: 'Role', width: 160 },
    { field: 'isActive', headerName: 'Status', width: 120, 
      renderCell: (params) => (
        <span style={{ color: params.value ? 'green' : 'red' }}>
          {params.value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    { field: 'createdAt', headerName: 'Created At', width: 180,
      valueFormatter: (params) => {
        if (!params.value) return '';
        return new Date(params.value).toLocaleString();
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleOpenModal(true, params.row)}
          >
            <FaEdit />
          </IconButton>
          {params.row.isActive ? (
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row)}
            >
              <FaTrash />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              color="success"
              onClick={() => handleActivateUser(params.row)}
            >
              <FaUserPlus />
            </IconButton>
          )}
        </Box>
      )
    }
  ];

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
          <li><Link to="/InventoryManagement"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/orders"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li><Link to="/customers"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/reports"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>User Management</h1>
          </div>
          <div className="top-bar-actions">
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

        {/* User Management Content */}
        <div className="dashboard-content">
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>System Users</h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaSearch />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<FaPlus />}
                  onClick={() => handleOpenModal(false)}
                >
                  Add User
                </Button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                  />
                </Box>
              )}
            </div>
          </div>
        </div>

        {/* Add/Edit User Modal */}
        <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                required
                margin="normal"
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g., jane_doe"
                error={!!formErrors.username}
                helperText={formErrors.username}
                disabled={isEditing}
              />
              <TextField
                fullWidth
                required
                margin="normal"
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g., Jane Doe"
                error={!!formErrors.fullName}
                helperText={formErrors.fullName}
              />
              <TextField
                fullWidth
                required
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g., jane@example.com"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
              <TextField
                fullWidth
                margin="normal"
                label={isEditing ? "Password (leave blank to keep current)" : "Password"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isEditing ? "Leave blank to keep current password" : "Minimum 8 characters"}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required={!isEditing}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth margin="normal" error={!!formErrors.role} required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                >
                  <MenuItem value="STORE_MANAGER">Store Manager</MenuItem>
                  <MenuItem value="SALES_STAFF">Sales Staff</MenuItem>
                  <MenuItem value="INVENTORY_STAFF">Inventory Staff</MenuItem>
                </Select>
                {formErrors.role && (
                  <Typography variant="caption" color="error">
                    {formErrors.role}
                  </Typography>
                )}
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} variant="outlined">Cancel</Button>
            <Button onClick={handleSaveUser} variant="contained" color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Deactivation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to deactivate {userToDelete?.username}? The user will no longer be able to access the system.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} variant="outlined">Cancel</Button>
            <Button onClick={handleDeleteUser} variant="contained" color="error">Deactivate</Button>
          </DialogActions>
        </Dialog>

        {/* Toast Notification */}
        <Snackbar 
          open={toast.open} 
          autoHideDuration={6000} 
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default UserManagement;