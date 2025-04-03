import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaPhone, 
  FaUserCircle,
  FaBars,
  FaSync,
  FaSignOutAlt,
  FaKey,
  FaSearch,
  FaFilter,
  FaEnvelope,
  FaCreditCard,
  FaHistory,
  FaTimes,
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaCashRegister,
  FaFolder
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Tab, 
  Tabs, 
  Box, 
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton
} from '@mui/material';
import { Link } from "react-router-dom";
import '../styles/dashboard.css';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openInteractionModal, setOpenInteractionModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contact_info: '',
    credit_limit: ''
  });
  
  const [interactionData, setInteractionData] = useState({
    interaction_type: '',
    details: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [interactionErrors, setInteractionErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [mode, setMode] = useState('add'); // 'add' or 'edit'
  
  useEffect(() => {
    fetchCustomers();
    fetchUserData();
  }, []);
  
  useEffect(() => {
    filterCustomers();
  }, [searchTerm, customers]);
  
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be a fetch to your API
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // For demo purposes, let's add some fake data
      const fakeCustomers = [
        { id: 1, name: 'John Doe', contact_info: 'john@example.com', credit_limit: 500 },
        { id: 2, name: 'Jane Smith', contact_info: 'jane@example.com', credit_limit: 1000 },
        { id: 3, name: 'Bob Johnson', contact_info: 'bob@example.com', credit_limit: 750 },
        { id: 4, name: 'Alice Brown', contact_info: 'alice@example.com', credit_limit: 1200 },
        { id: 5, name: 'Charlie Davis', contact_info: 'charlie@example.com', credit_limit: 250 }
      ];
      setCustomers(fakeCustomers);
      setFilteredCustomers(fakeCustomers);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCustomerInteractions = async (customerId) => {
    try {
      // In a real app, this would be a fetch to your API
      const response = await fetch(`/api/customers/${customerId}/interactions`);
      const data = await response.json();
      setInteractions(data);
    } catch (error) {
      console.error('Error fetching customer interactions:', error);
      // For demo purposes, let's add some fake data
      const today = new Date();
      const fakeInteractions = [
        { 
          id: 1, 
          interaction_type: 'Phone Call', 
          details: 'Discussed order #123', 
          date: '2025-03-24' 
        },
        { 
          id: 2, 
          interaction_type: 'Email', 
          details: 'Sent invoice for recent purchase', 
          date: '2025-03-20' 
        },
        { 
          id: 3, 
          interaction_type: 'In-Store Visit', 
          details: 'Customer browsed inventory, but did not purchase', 
          date: '2025-03-15' 
        }
      ];
      setInteractions(fakeInteractions);
    }
  };
  
  const fetchUserData = async () => {
    try {
      // In a real app, this would be a fetch to your API
      // For now, we're using the dummy data from the original code
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  
  const filterCustomers = () => {
    if (!searchTerm) {
      setFilteredCustomers(customers);
      return;
    }
    
    const filtered = customers.filter(
      customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredCustomers(filtered);
  };
  
  const handleAddCustomer = () => {
    setMode('add');
    resetForm();
    setOpenAddEditModal(true);
  };
  
  const handleEditCustomer = (customer) => {
    setMode('edit');
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contact_info: customer.contact_info,
      credit_limit: customer.credit_limit.toString()
    });
    setOpenAddEditModal(true);
  };
  
  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      contact_info: customer.contact_info,
      credit_limit: customer.credit_limit.toString()
    });
    await fetchCustomerInteractions(customer.id);
    setOpenDetailsModal(true);
  };
  
  const handleAddInteraction = (customer) => {
    setSelectedCustomer(customer);
    resetInteractionForm();
    setOpenInteractionModal(true);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      contact_info: '',
      credit_limit: ''
    });
    setFormErrors({});
  };
  
  const resetInteractionForm = () => {
    setInteractionData({
      interaction_type: '',
      details: ''
    });
    setInteractionErrors({});
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.contact_info.trim()) errors.contact_info = 'Contact info is required';
    if (!formData.credit_limit.trim()) errors.credit_limit = 'Credit limit is required';
    else if (isNaN(formData.credit_limit) || parseFloat(formData.credit_limit) < 0) {
      errors.credit_limit = 'Credit limit must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateInteractionForm = () => {
    const errors = {};
    if (!interactionData.interaction_type.trim()) errors.interaction_type = 'Interaction type is required';
    if (!interactionData.details.trim()) errors.details = 'Details are required';
    
    setInteractionErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitCustomer = async () => {
    if (!validateForm()) return;
    
    try {
      if (mode === 'add') {
        // In a real app, this would be a POST to your API
        // const response = await fetch('/api/customers', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     contact_info: formData.contact_info,
        //     credit_limit: parseFloat(formData.credit_limit)
        //   }),
        // });
        // const data = await response.json();
        
        // For demo purposes, let's simulate adding a customer
        const newCustomer = {
          id: customers.length + 1,
          name: formData.name,
          contact_info: formData.contact_info,
          credit_limit: parseFloat(formData.credit_limit)
        };
        
        setCustomers([...customers, newCustomer]);
        showToastNotification('Customer added successfully', 'success');
      } else {
        // In a real app, this would be a PUT to your API
        // const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     name: formData.name,
        //     contact_info: formData.contact_info,
        //     credit_limit: parseFloat(formData.credit_limit)
        //   }),
        // });
        // const data = await response.json();
        
        // For demo purposes, let's simulate updating a customer
        const updatedCustomers = customers.map(c => 
          c.id === selectedCustomer.id ? {
            ...c,
            name: formData.name,
            contact_info: formData.contact_info,
            credit_limit: parseFloat(formData.credit_limit)
          } : c
        );
        
        setCustomers(updatedCustomers);
        showToastNotification('Customer updated successfully', 'success');
      }
      
      setOpenAddEditModal(false);
    } catch (error) {
      console.error('Error submitting customer:', error);
      showToastNotification('Error saving customer data', 'error');
    }
  };
  
  const handleSubmitInteraction = async () => {
    if (!validateInteractionForm()) return;
    
    try {
      // In a real app, this would be a POST to your API
      // const response = await fetch(`/api/customers/${selectedCustomer.id}/interactions`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     interaction_type: interactionData.interaction_type,
      //     details: interactionData.details
      //   }),
      // });
      // const data = await response.json();
      
      // For demo purposes, let's simulate adding an interaction
      const today = new Date().toISOString().split('T')[0];
      const newInteraction = {
        id: interactions.length + 1,
        interaction_type: interactionData.interaction_type,
        details: interactionData.details,
        date: today
      };
      
      setInteractions([newInteraction, ...interactions]);
      showToastNotification('Interaction logged successfully', 'success');
      setOpenInteractionModal(false);
      
      // If details modal is open, refresh interactions tab
      if (openDetailsModal) {
        setTabValue(1); // Switch to interactions tab
      }
    } catch (error) {
      console.error('Error submitting interaction:', error);
      showToastNotification('Error logging interaction', 'error');
    }
  };
  
  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      // In a real app, this would be a DELETE to your API
      // await fetch(`/api/customers/${customerId}`, {
      //   method: 'DELETE'
      // });
      
      // For demo purposes, let's simulate deleting a customer
      const updatedCustomers = customers.filter(c => c.id !== customerId);
      setCustomers(updatedCustomers);
      showToastNotification('Customer deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting customer:', error);
      showToastNotification('Error deleting customer', 'error');
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleInteractionChange = (e) => {
    const { name, value } = e.target;
    setInteractionData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (interactionErrors[name]) {
      setInteractionErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const showToastNotification = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
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
  
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate('/Login');
    }
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
  
  // DataGrid columns configuration
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'contact_info', headerName: 'Contact Info', width: 220 },
    {
      field: 'credit_limit',
      headerName: 'Credit Limit',
      width: 150,
      renderCell: (params) => (
        <span>${params.value.toFixed(2)}</span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            variant="text" 
            color="primary" 
            size="small"
            onClick={() => handleViewCustomer(params.row)}
          >
            <FaUserCircle style={{ marginRight: '5px' }} /> View
          </Button>
          <Button 
            variant="text" 
            color="secondary" 
            size="small"
            onClick={() => handleEditCustomer(params.row)}
          >
            <FaEdit style={{ marginRight: '5px' }} /> Edit
          </Button>
          <Button 
            variant="text" 
            color="error" 
            size="small"
            onClick={() => handleDeleteCustomer(params.row.id)}
          >
            <FaTrash style={{ marginRight: '5px' }} /> Delete
          </Button>
          <Button 
            variant="text" 
            color="info" 
            size="small"
            onClick={() => handleAddInteraction(params.row)}
          >
            <FaPhone style={{ marginRight: '5px' }} /> Log
          </Button>
        </div>
      )
    }
  ];
  
  // Interactions DataGrid columns
  const interactionColumns = [
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'interaction_type', headerName: 'Type', width: 150 },
    { field: 'details', headerName: 'Details', width: 300 }
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
          <li><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/pos"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li className="active"><Link to="/customers"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Customer Management</h1>
          </div>
          <div className="top-bar-actions">
            <button className="refresh-btn" onClick={fetchCustomers}>
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

        {/* Dashboard Content */}
        <div className="dashboard-content">
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Customers</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <TextField
                    placeholder="Search by name or contact"
                    variant="outlined"
                    size="small"
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
                    startIcon={<FaUserPlus />}
                    onClick={handleAddCustomer}
                    style={{ backgroundColor: '#3B3F51' }}
                  >
                    Add Customer
                  </Button>
                </div>
              </div>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="loading">Loading customer data...</div>
              ) : (
                <div style={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={filteredCustomers}
                    columns={columns}
                    pageSize={8}
                    checkboxSelection={false}
                    disableSelectionOnClick
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Customer Modal */}
      <Dialog 
        open={openAddEditModal} 
        onClose={() => setOpenAddEditModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {mode === 'add' ? 'Add New Customer' : 'Edit Customer'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Customer Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleFormChange}
              error={!!formErrors.name}
              helperText={formErrors.name || "e.g., Jane Doe"}
            />
            <TextField
              name="contact_info"
              label="Contact Info"
              fullWidth
              margin="normal"
              value={formData.contact_info}
              onChange={handleFormChange}
              error={!!formErrors.contact_info}
              helperText={formErrors.contact_info || "e.g., jane@example.com"}
            />
            <TextField
              name="credit_limit"
              label="Credit Limit"
              fullWidth
              margin="normal"
              value={formData.credit_limit}
              onChange={handleFormChange}
              error={!!formErrors.credit_limit}
              helperText={formErrors.credit_limit || "e.g., 500"}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpenAddEditModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitCustomer} color="primary" variant="contained" style={{ backgroundColor: '#3B3F51' }}>
            {mode === 'add' ? 'Add Customer' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interaction Modal */}
      <Dialog 
        open={openInteractionModal} 
        onClose={() => setOpenInteractionModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Log Customer Interaction
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Customer: {selectedCustomer?.name}
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>Interaction Type</InputLabel>
              <Select
                name="interaction_type"
                value={interactionData.interaction_type}
                onChange={handleInteractionChange}
                error={!!interactionErrors.interaction_type}
              >
                <MenuItem value="Phone Call">Phone Call</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="In-Store Visit">In-Store Visit</MenuItem>
                <MenuItem value="Support Ticket">Support Ticket</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {interactionErrors.interaction_type && (
                <Typography color="error" variant="caption">
                  {interactionErrors.interaction_type}
                </Typography>
              )}
            </FormControl>
            <TextField
              name="details"
              label="Interaction Details"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={interactionData.details}
              onChange={handleInteractionChange}
              error={!!interactionErrors.details}
              helperText={interactionErrors.details || "e.g., Discussed order #123"}
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={() => setOpenInteractionModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitInteraction} color="primary" variant="contained" style={{ backgroundColor: '#3B3F51' }}>
            Log Interaction
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Details Modal */}
      <Dialog 
        open={openDetailsModal} 
        onClose={() => setOpenDetailsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Customer Details: {selectedCustomer?.name}</span>
            <IconButton onClick={() => setOpenDetailsModal(false)} size="small">
              <FaTimes />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Profile" />
              <Tab label="Interactions" />
            </Tabs>
          </Box>
          
          {tabValue === 0 && (
            <Box>
              <TextField
                name="name"
                label="Customer Name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
              <TextField
                name="contact_info"
                label="Contact Info"
                fullWidth
                margin="normal"
                value={formData.contact_info}
                onChange={handleFormChange}
                error={!!formErrors.contact_info}
                helperText={formErrors.contact_info}
              />
              <TextField
                name="credit_limit"
                label="Credit Limit"
                fullWidth
                margin="normal"
                value={formData.credit_limit}
                onChange={handleFormChange}
                error={!!formErrors.credit_limit}
                helperText={formErrors.credit_limit}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => {
                    handleSubmitCustomer();
                    setOpenDetailsModal(false);
                  }} 
                  color="primary" 
                  variant="contained"
                  style={{ backgroundColor: '#3B3F51' }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">
                  Interaction History
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<FaPhone />}
                  onClick={() => {
                    setOpenDetailsModal(false);
                    handleAddInteraction(selectedCustomer);
                  }}
                  style={{ backgroundColor: '#3B3F51' }}
                >
                  New Interaction
                </Button>
              </Box>
              
              <div style={{ height: 400, width: '100%' }}>
                {interactions.length > 0 ? (
                  <DataGrid
                    rows={interactions}
                    columns={interactionColumns}
                    pageSize={5}
                    checkboxSelection={false}
                    disableSelectionOnClick
                  />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="textSecondary">
                      No interaction history found for this customer
                    </Typography>
                  </Box>
                )}
              </div>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast-notification ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;