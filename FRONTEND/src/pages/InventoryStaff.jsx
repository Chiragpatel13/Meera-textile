import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Typography,
  Box,
  FormHelperText,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  FaBox, 
  FaShoppingCart, 
  FaFolder,
  FaChartBar, 
  FaUsers,
  FaUserCircle,
  FaBars,
  FaSignOutAlt,
  FaKey,
  FaEdit,
  FaMinus,
  FaPlus,
  FaTrash,
  FaSync,
  FaCashRegister
} from 'react-icons/fa';
import { AiFillIdcard } from 'react-icons/ai';
import '../styles/dashboard.css';

const InventoryManagement = () => {
  // State management
  const [skus, setSkus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddEditModal, setOpenAddEditModal] = useState(false);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [currentSku, setCurrentSku] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  });
  
  // Form states
  const [skuForm, setSkuForm] = useState({
    sku_code: '',
    fabric_type: '',
    color: '',
    price_per_meter: ''
  });
  
  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustment_type: 'INCREASE',
    quantity: '',
    reason: ''
  });
  
  const [receiptForm, setReceiptForm] = useState({
    quantity_received: '',
    supplier_info: ''
  });
  
  // Validation states
  const [skuErrors, setSkuErrors] = useState({});
  const [adjustmentErrors, setAdjustmentErrors] = useState({});
  const [receiptErrors, setReceiptErrors] = useState({});

  // Fetch SKUs on component mount
  useEffect(() => {
    fetchSkus();
    fetchUserData();
  }, []);

  // Filter SKUs if showing low stock only
  const filteredSkus = showLowStock 
    ? skus.filter(sku => sku.stock < 20)
    : skus;
  
  // Fetch SKUs from API
  const fetchSkus = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/skus');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = [
        { id: 1, sku_code: 'COT-RED-001', fabric_type: 'Cotton', color: 'Red', price_per_meter: 15.50, stock: 95.5 },
        { id: 2, sku_code: 'SLK-BLU-001', fabric_type: 'Silk', color: 'Blue', price_per_meter: 24.75, stock: 45.2 },
        { id: 3, sku_code: 'PLY-BLK-001', fabric_type: 'Polyester', color: 'Black', price_per_meter: 8.99, stock: 120.0 },
        { id: 4, sku_code: 'LIN-WHT-001', fabric_type: 'Linen', color: 'White', price_per_meter: 18.25, stock: 15.5 },
        { id: 5, sku_code: 'DNM-BLU-001', fabric_type: 'Denim', color: 'Blue', price_per_meter: 12.00, stock: 78.3 }
      ];
      
      setSkus(mockData);
    } catch (error) {
      console.error('Error fetching SKUs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch('/api/user/profile');
      // const data = await response.json();
      // setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeUserMenu = () => {
    setUserMenuOpen(false);
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

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/Login';
    }
  };

  // Reset password navigation
  const handleResetPassword = () => {
    window.location.href = '/ResetPassword';
  };

  // User profile navigation
  const handleUser = () => {
    window.location.href = '/Profile';
  };

  // Handle Add/Edit modal
  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSkuForm({
      sku_code: '',
      fabric_type: '',
      color: '',
      price_per_meter: ''
    });
    setSkuErrors({});
    setOpenAddEditModal(true);
  };

  const handleOpenEditModal = (sku) => {
    setIsEditMode(true);
    setCurrentSku(sku);
    setSkuForm({
      sku_code: sku.sku_code,
      fabric_type: sku.fabric_type,
      color: sku.color,
      price_per_meter: sku.price_per_meter.toString()
    });
    setSkuErrors({});
    setOpenAddEditModal(true);
  };

  // Handle Adjust modal
  const handleOpenAdjustModal = (sku) => {
    setCurrentSku(sku);
    setAdjustmentForm({
      adjustment_type: 'INCREASE',
      quantity: '',
      reason: ''
    });
    setAdjustmentErrors({});
    setOpenAdjustModal(true);
  };

  // Handle Receive modal
  const handleOpenReceiveModal = (sku) => {
    setCurrentSku(sku);
    setReceiptForm({
      quantity_received: '',
      supplier_info: ''
    });
    setReceiptErrors({});
    setOpenReceiveModal(true);
  };

  // Close modals
  const handleCloseAddEditModal = () => {
    setOpenAddEditModal(false);
  };

  const handleCloseAdjustModal = () => {
    setOpenAdjustModal(false);
  };

  const handleCloseReceiveModal = () => {
    setOpenReceiveModal(false);
  };

  // Form change handlers
  const handleSkuFormChange = (e) => {
    const { name, value } = e.target;
    setSkuForm({
      ...skuForm,
      [name]: value
    });
    
    // Clear error when field is edited
    if (skuErrors[name]) {
      setSkuErrors({
        ...skuErrors,
        [name]: ''
      });
    }
  };

  const handleAdjustmentFormChange = (e) => {
    const { name, value } = e.target;
    setAdjustmentForm({
      ...adjustmentForm,
      [name]: value
    });
    
    // Clear error when field is edited
    if (adjustmentErrors[name]) {
      setAdjustmentErrors({
        ...adjustmentErrors,
        [name]: ''
      });
    }
  };

  const handleReceiptFormChange = (e) => {
    const { name, value } = e.target;
    setReceiptForm({
      ...receiptForm,
      [name]: value
    });
    
    // Clear error when field is edited
    if (receiptErrors[name]) {
      setReceiptErrors({
        ...receiptErrors,
        [name]: ''
      });
    }
  };

  // Validate SKU form
  const validateSkuForm = () => {
    const errors = {};
    if (!skuForm.sku_code) errors.sku_code = 'SKU code is required';
    if (!skuForm.fabric_type) errors.fabric_type = 'Fabric type is required';
    if (!skuForm.color) errors.color = 'Color is required';
    if (!skuForm.price_per_meter) {
      errors.price_per_meter = 'Price per meter is required';
    } else if (isNaN(parseFloat(skuForm.price_per_meter)) || parseFloat(skuForm.price_per_meter) <= 0) {
      errors.price_per_meter = 'Price must be a positive number';
    }
    
    setSkuErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate adjustment form
  const validateAdjustmentForm = () => {
    const errors = {};
    if (!adjustmentForm.quantity) {
      errors.quantity = 'Quantity is required';
    } else if (isNaN(parseFloat(adjustmentForm.quantity)) || parseFloat(adjustmentForm.quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number';
    }
    
    if (!adjustmentForm.reason) errors.reason = 'Reason is required';
    
    setAdjustmentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate receipt form
  const validateReceiptForm = () => {
    const errors = {};
    if (!receiptForm.quantity_received) {
      errors.quantity_received = 'Quantity is required';
    } else if (isNaN(parseFloat(receiptForm.quantity_received)) || parseFloat(receiptForm.quantity_received) <= 0) {
      errors.quantity_received = 'Quantity must be a positive number';
    }
    
    setReceiptErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handlers
  const handleSubmitSku = async () => {
    if (!validateSkuForm()) return;
    
    try {
      if (isEditMode) {
        // Update existing SKU
        // In a real app, this would be an API call:
        // await fetch(`/api/skus/${currentSku.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(skuForm)
        // });
        
        // For demo, update locally
        const updatedSkus = skus.map(sku => 
          sku.id === currentSku.id ? 
            { 
              ...sku, 
              sku_code: skuForm.sku_code,
              fabric_type: skuForm.fabric_type,
              color: skuForm.color,
              price_per_meter: parseFloat(skuForm.price_per_meter)
            } : sku
        );
        setSkus(updatedSkus);
      } else {
        // Add new SKU
        // In a real app, this would be an API call:
        // const response = await fetch('/api/skus', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(skuForm)
        // });
        // const data = await response.json();
        
        // For demo, add locally
        const newSku = {
          id: skus.length + 1,
          sku_code: skuForm.sku_code,
          fabric_type: skuForm.fabric_type,
          color: skuForm.color,
          price_per_meter: parseFloat(skuForm.price_per_meter),
          stock: 0
        };
        
        setSkus([...skus, newSku]);
      }
      
      handleCloseAddEditModal();
    } catch (error) {
      console.error('Error saving SKU:', error);
    }
  };

  const handleSubmitAdjustment = async () => {
    if (!validateAdjustmentForm()) return;
    
    try {
      // In a real app, this would be an API call:
      // await fetch('/api/inventory/adjustments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sku_id: currentSku.id,
      //     ...adjustmentForm,
      //     quantity: parseFloat(adjustmentForm.quantity)
      //   })
      // });
      
      // For demo, update locally
      const updatedSkus = skus.map(sku => {
        if (sku.id === currentSku.id) {
          const adjustmentValue = parseFloat(adjustmentForm.quantity);
          let newStock = sku.stock;
          
          if (adjustmentForm.adjustment_type === 'INCREASE') {
            newStock += adjustmentValue;
          } else {
            newStock = Math.max(0, newStock - adjustmentValue);
          }
          
          return { ...sku, stock: newStock };
        }
        return sku;
      });
      
      setSkus(updatedSkus);
      handleCloseAdjustModal();
    } catch (error) {
      console.error('Error submitting adjustment:', error);
    }
  };

  const handleSubmitReceipt = async () => {
    if (!validateReceiptForm()) return;
    
    try {
      // In a real app, this would be an API call:
      // await fetch('/api/inventory/receipts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     sku_id: currentSku.id,
      //     ...receiptForm,
      //     quantity_received: parseFloat(receiptForm.quantity_received)
      //   })
      // });
      
      // For demo, update locally
      const updatedSkus = skus.map(sku => {
        if (sku.id === currentSku.id) {
          return {
            ...sku,
            stock: sku.stock + parseFloat(receiptForm.quantity_received)
          };
        }
        return sku;
      });
      
      setSkus(updatedSkus);
      handleCloseReceiveModal();
    } catch (error) {
      console.error('Error submitting receipt:', error);
    }
  };

  // Handle delete SKU
  const handleDeleteSku = async (sku) => {
    if (window.confirm(`Are you sure you want to delete ${sku.sku_code}?`)) {
      try {
        // In a real app, this would be an API call:
        // await fetch(`/api/skus/${sku.id}`, {
        //   method: 'DELETE'
        // });
        
        // For demo, update locally
        setSkus(skus.filter(s => s.id !== sku.id));
      } catch (error) {
        console.error('Error deleting SKU:', error);
      }
    }
  };

  // DataGrid columns
  const columns = [
    { field: 'sku_code', headerName: 'SKU Code', flex: 1, minWidth: 120 },
    { field: 'fabric_type', headerName: 'Fabric Type', flex: 1, minWidth: 120 },
    { field: 'color', headerName: 'Color', flex: 1, minWidth: 100 },
    { 
      field: 'price_per_meter', 
      headerName: 'Price/Meter', 
      flex: 1, 
      minWidth: 120,
      renderCell: (params) => `$${params.value.toFixed(2)}`
    },
    { 
      field: 'stock', 
      headerName: 'Stock', 
      flex: 1, 
      minWidth: 100,
      renderCell: (params) => {
        return (
          <Box sx={{ color: params.value < 20 ? '#f44336' : 'inherit' }}>
            {params.value.toFixed(1)}
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton 
              onClick={() => handleOpenEditModal(params.row)}
              size="small"
              className="edit-icon"
            >
              <FaEdit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Adjust Stock">
            <IconButton 
              onClick={() => handleOpenAdjustModal(params.row)}
              size="small"
              className="edit-icon"
            >
              <FaMinus />
            </IconButton>
          </Tooltip>
          <Tooltip title="Receive Stock">
            <IconButton 
              onClick={() => handleOpenReceiveModal(params.row)}
              size="small"
              className="edit-icon"
            >
              <FaPlus />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              onClick={() => handleDeleteSku(params.row)}
              size="small"
              className="delete-icon"
            >
              <FaTrash />
            </IconButton>
          </Tooltip>
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
          <li className="active"><Link to="/inventory/manage"><FaBox /> <span>Inventory</span></Link></li>
          <li><Link to="/pos"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Inventory Management</h1>
          </div>
          <div className="top-bar-actions">
            <button className="refresh-btn" onClick={fetchSkus}>
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

        {/* Inventory Management Content */}
        <div className="dashboard-content">
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>SKU Management</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={showLowStock}
                      onChange={(e) => setShowLowStock(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Show Low Stock Only"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenAddModal}
                  style={{ 
                    backgroundColor: '#3B3F51',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '4px'
                  }}
                >
                  <FaPlus style={{ marginRight: '8px' }} /> Add SKU
                </Button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ height: 500, width: '100%' }}>
                <DataGrid
                  rows={filteredSkus}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[5, 10, 25]}
                  disableSelectionOnClick
                  loading={loading}
                  getRowClassName={(params) => 
                    params.row.stock < 20 ? 'low-stock-row' : ''
                  }
                  sx={{
                    '& .low-stock-row': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold'
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit SKU Modal */}
      <Dialog 
        open={openAddEditModal} 
        onClose={handleCloseAddEditModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          {isEditMode ? 'Edit SKU' : 'Add New SKU'}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <TextField
            margin="dense"
            name="sku_code"
            label="SKU Code"
            type="text"
            fullWidth
            value={skuForm.sku_code}
            onChange={handleSkuFormChange}
            placeholder="e.g., COT-BLU-002"
            error={!!skuErrors.sku_code}
            helperText={skuErrors.sku_code}
            autoFocus
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="fabric_type"
            label="Fabric Type"
            type="text"
            fullWidth
            value={skuForm.fabric_type}
            onChange={handleSkuFormChange}
            placeholder="e.g., Cotton"
            error={!!skuErrors.fabric_type}
            helperText={skuErrors.fabric_type}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="color"
            label="Color"
            type="text"
            fullWidth
            value={skuForm.color}
            onChange={handleSkuFormChange}
            placeholder="e.g., Blue"
            error={!!skuErrors.color}
            helperText={skuErrors.color}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="price_per_meter"
            label="Price per Meter"
            type="number"
            fullWidth
            value={skuForm.price_per_meter}
            onChange={handleSkuFormChange}
            placeholder="e.g., 12.75"
            error={!!skuErrors.price_per_meter}
            helperText={skuErrors.price_per_meter}
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: '$' }}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseAddEditModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitSku} 
            color="primary"
            variant="contained"
            style={{ backgroundColor: '#3B3F51' }}
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjustment Modal */}
      <Dialog 
        open={openAdjustModal} 
        onClose={handleCloseAdjustModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Adjust Stock: {currentSku?.sku_code}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Current Stock: {currentSku?.stock.toFixed(1)}
          </Typography>
          
          <FormControl fullWidth margin="dense">
            <InputLabel>Adjustment Type</InputLabel>
            <Select
              name="adjustment_type"
              value={adjustmentForm.adjustment_type}
              onChange={handleAdjustmentFormChange}
              label="Adjustment Type"
            >
              <MenuItem value="INCREASE">Increase Stock</MenuItem>
              <MenuItem value="DECREASE">Decrease Stock</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="quantity"
            label="Quantity"
            type="number"
            fullWidth
            value={adjustmentForm.quantity}
            onChange={handleAdjustmentFormChange}
            placeholder="e.g., 10"
            error={!!adjustmentErrors.quantity}
            helperText={adjustmentErrors.quantity}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            margin="dense"
            name="reason"
            label="Reason"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={adjustmentForm.reason}
            onChange={handleAdjustmentFormChange}
            placeholder="e.g., Damaged stock"
            error={!!adjustmentErrors.reason}
            helperText={adjustmentErrors.reason}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseAdjustModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitAdjustment} 
            color="primary"
            variant="contained"
            style={{ backgroundColor: '#3B3F51' }}
          >
            Submit Adjustment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog 
        open={openReceiveModal} 
        onClose={handleCloseReceiveModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="dialog-title">
          Receive Stock: {currentSku?.sku_code}
        </DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Current Stock: {currentSku?.stock.toFixed(1)}
          </Typography>
          
          <TextField
            margin="dense"
            name="quantity_received"
            label="Quantity Received"
            type="number"
            fullWidth
            value={receiptForm.quantity_received}
            onChange={handleReceiptFormChange}
            placeholder="e.g., 50"
            error={!!receiptErrors.quantity_received}
            helperText={receiptErrors.quantity_received}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            margin="dense"
            name="supplier_info"
            label="Supplier Info (Optional)"
            type="text"
            fullWidth
            value={receiptForm.supplier_info}
            onChange={handleReceiptFormChange}
            placeholder="e.g., Supplier XYZ"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleCloseReceiveModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReceipt} 
            color="primary"
            variant="contained"
            style={{ backgroundColor: '#3B3F51' }}
          >
            Record Receipt
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        .MuiDataGrid-root .low-stock-row {
          background-color: rgba(244, 67, 54, 0.08);
        }
      `}</style>
    </div>
  );
};

export default InventoryManagement;