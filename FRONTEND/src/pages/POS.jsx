import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaShoppingCart, 
  FaUser, 
  FaPlus, 
  FaRupeeSign, 
  FaQrcode, 
  FaCreditCard,
  FaMoneyBillWave,
  FaUserPlus,
  FaSearch,
  FaSave,
  FaBars,
  FaChartBar,
  FaBox,
  FaUsers,
  FaCashRegister,
  FaTrash,
  FaFolder,
  FaKey,
  FaSignOutAlt,
  FaUserCircle, // Ensure this is imported
  FaSync
} from 'react-icons/fa';
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import '../styles/dashboard.css';
import '../styles/pos.css';
import { AiFillIdcard } from 'react-icons/ai';

const POSInterface = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [skus, setSkus] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [activePaymentTab, setActivePaymentTab] = useState('cash');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  // Initialize userData with default values to prevent null errors
  const [userData, setUserData] = useState({
    name: 'User',
    email: 'user@example.com'
  });
  
  // Form states
  const [orderItems, setOrderItems] = useState([{ sku_id: '', quantity: 1, subtotal: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);
  const [creditPeriodDays, setCreditPeriodDays] = useState(30);
  
  // New customer form
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    contact_info: '',
    credit_limit: 500
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCustomers();
    fetchSKUs();
    
    // Mock user data - in a real app, you would fetch this from an API
    // This ensures userData is not null when accessed
    setUserData({
      name: 'Store Admin',
      email: 'admin@storemanager.com'
    });
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // Simulate API response if backend isn't ready
      setTimeout(() => {
        const mockCustomers = [
          { id: 1, name: 'John Doe', contact_info: 'john@example.com', credit_limit: 1000 },
          { id: 2, name: 'Jane Smith', contact_info: '555-123-4567', credit_limit: 2000 }
        ];
        setCustomers(mockCustomers);
        setIsLoading(false);
      }, 500);
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data);
      setIsLoading(false);
      */
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to load customers', 'error');
      setIsLoading(false);
    }
  };

  const fetchSKUs = async () => {
    try {
      // Simulate API response if backend isn't ready
      setTimeout(() => {
        const mockSKUs = [
          { id: 1, code: 'SKU001', name: 'Product 1', price: 100, total_quantity: 50 },
          { id: 2, code: 'SKU002', name: 'Product 2', price: 200, total_quantity: 25 },
          { id: 3, code: 'SKU003', name: 'Product 3', price: 150, total_quantity: 30 }
        ];
        setSkus(mockSKUs);
      }, 500);
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/skus');
      const data = await response.json();
      setSkus(data);
      */
    } catch (error) {
      console.error('Error fetching SKUs:', error);
      showNotification('Failed to load inventory items', 'error');
    }
  };

  const handleCustomerChange = (e) => {
    setSelectedCustomer(e.target.value);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Define toggleUserMenu function
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  const closeUserMenu = () => {
    setUserMenuOpen(false);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems];
    updatedItems[index][field] = value;
    
    // If SKU changed or quantity changed, recalculate subtotal
    if (field === 'sku_id' || field === 'quantity') {
      const selectedSku = skus.find(sku => sku.id === parseInt(updatedItems[index].sku_id));
      const price = selectedSku ? selectedSku.price : 0;
      updatedItems[index].subtotal = price * updatedItems[index].quantity;
    }
    
    setOrderItems(updatedItems);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { sku_id: '', quantity: 1, subtotal: 0 }]);
  };

  const removeOrderItem = (index) => {
    const updatedItems = [...orderItems];
    updatedItems.splice(index, 1);
    setOrderItems(updatedItems.length ? updatedItems : [{ sku_id: '', quantity: 1, subtotal: 0 }]);
  };

  const handleNewCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({
      ...newCustomer,
      [name]: name === 'credit_limit' ? parseFloat(value) : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateCustomerForm = () => {
    const newErrors = {};
    
    if (!newCustomer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!newCustomer.contact_info.trim()) {
      newErrors.contact_info = 'Contact information is required';
    }
    
    if (!newCustomer.credit_limit || newCustomer.credit_limit <= 0) {
      newErrors.credit_limit = 'Credit limit must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addNewCustomer = async () => {
    if (!validateCustomerForm()) return;
    
    try {
      // Simulate API response if backend isn't ready
      const newCustomerId = customers.length + 1;
      const addedCustomer = {
        id: newCustomerId,
        ...newCustomer
      };
      
      setCustomers([...customers, addedCustomer]);
      setSelectedCustomer(newCustomerId.toString());
      setShowAddCustomerModal(false);
      setNewCustomer({ name: '', contact_info: '', credit_limit: 500 });
      showNotification('Customer added successfully', 'success');
      
      // Uncomment this for real API
      /*
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCustomer)
      });
      
      if (response.ok) {
        const addedCustomer = await response.json();
        setCustomers([...customers, addedCustomer]);
        setSelectedCustomer(addedCustomer.id);
        setShowAddCustomerModal(false);
        setNewCustomer({ name: '', contact_info: '', credit_limit: 500 });
        showNotification('Customer added successfully', 'success');
      } else {
        showNotification('Failed to add customer', 'error');
      }
      */
    } catch (error) {
      console.error('Error adding customer:', error);
      showNotification('Failed to add customer', 'error');
    }
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * tax) / 100;
    const total = afterDiscount + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2),
      change: (amountReceived - total).toFixed(2)
    };
  };

  const submitOrder = async () => {
    if (!selectedCustomer) {
      showNotification('Please select a customer', 'error');
      return;
    }
    
    if (!orderItems[0].sku_id) {
      showNotification('Please add at least one item to the order', 'error');
      return;
    }
    
    // Check stock availability for each item
    for (const item of orderItems) {
      if (!item.sku_id) continue;
      
      const selectedSku = skus.find(sku => sku.id === parseInt(item.sku_id));
      if (selectedSku && item.quantity > selectedSku.total_quantity) {
        showNotification(`Not enough stock for ${selectedSku.name}`, 'error');
        return;
      }
    }
    
    const { total } = calculateTotals();
    
    try {
      // Simulate order creation for demo
      if (activePaymentTab === 'qrcode') {
        setQrCodeData(`ORDER-${Date.now()}-AMT-${total}`);
        showNotification('Order created, scan QR code to complete payment', 'success');
      } else {
        showNotification('Order completed successfully!', 'success');
        // In a real app, you would navigate to the invoice
        // navigate(`/orders/${orderId}/invoice`);
        
        // Reset form after successful order
        setOrderItems([{ sku_id: '', quantity: 1, subtotal: 0 }]);
        setSelectedCustomer('');
        setDiscount(0);
        setTax(0);
        setAmountReceived(0);
      }
      
      // Uncomment this for real API
      /*
      // Step 1: Create order
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_id: selectedCustomer,
          items: orderItems.filter(item => item.sku_id),
          discount: parseFloat(discount),
          tax: parseFloat(tax),
          total: parseFloat(total)
        })
      });
      
      if (!orderResponse.ok) {
        showNotification('Failed to create order', 'error');
        return;
      }
      
      const orderData = await orderResponse.json();
      const orderId = orderData.id;
      
      // Step 2: Process payment
      const paymentData = {
        payment_method: activePaymentTab.toUpperCase(),
      };
      
      if (activePaymentTab === 'cash') {
        paymentData.amount_received = parseFloat(amountReceived);
      } else if (activePaymentTab === 'credit') {
        paymentData.credit_period_days = parseInt(creditPeriodDays);
      }
      
      const paymentResponse = await fetch(`/api/orders/${orderId}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      if (!paymentResponse.ok) {
        showNotification('Failed to process payment', 'error');
        return;
      }
      
      const paymentResult = await paymentResponse.json();
      
      if (activePaymentTab === 'qrcode' && paymentResult.qr_code_data) {
        setQrCodeData(paymentResult.qr_code_data);
      } else {
        // Redirect to invoice page
        navigate(`/orders/${orderId}/invoice`);
      }
      */
    } catch (error) {
      console.error('Error submitting order:', error);
      showNotification('Failed to process order', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleResetPassword = () => {
    window.location.href = '/ResetPassword';
  };
  const handleUser = () => {
    window.location.href = '/Profile';
  };
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/Login';
    }
  };

  // Calculate totals for display
  const totals = calculateTotals();

  return (
    <div className="admin-dashboard">
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
          <li className="active"><Link to="/pos"><FaShoppingCart /> <span>Orders</span></Link></li>
          <li><Link to="/customerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li><Link to="/Reportingpage"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Point of Sale</h1>
          </div>
          <div className="top-bar-actions">
            <button className="refresh-btn" onClick={() => {
              fetchCustomers();
              fetchSKUs();
            }}>
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

        {/* Notification Toast */}
        {notification.show && (
          <div className={`toast-notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* POS Content */}
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading">Loading POS data...</div>
          ) : (
            <div className="pos-container">
              {/* Left Column - Customer and Order Form */}
              <div className="card pos-card">
                <div className="card-header">
                  <h2>Customer & Order Details</h2>
                </div>
                <div className="card-body">
                  {/* Customer Selection */}
                  <div className="form-field">
                    <label>Select Customer</label>
                    <div className="customer-selection">
                      <select 
                        value={selectedCustomer} 
                        onChange={handleCustomerChange}
                        className="customer-select"
                      >
                        <option value="">-- Select Customer --</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.contact_info}
                          </option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        className="action-button add-customer-btn"
                        onClick={() => {
                          console.log("Opening add customer modal");
                          setShowAddCustomerModal(true);
                        }}
                      >
                        <FaUserPlus /> Add New
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="form-field">
                    <label>Order Items</label>
                    <div className="user-table-container">
                      <table className="credits-table">
                        <thead>
                          <tr>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <select
                                  value={item.sku_id}
                                  onChange={(e) => handleItemChange(index, 'sku_id', e.target.value)}
                                  className="sku-select"
                                >
                                  <option value="">-- Select SKU --</option>
                                  {skus.map(sku => (
                                    <option key={sku.id} value={sku.id}>
                                      {sku.code} - {sku.name} (Stock: {sku.total_quantity})
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                  className="quantity-input"
                                />
                              </td>
                              <td>₹{item.subtotal.toFixed(2)}</td>
                              <td>
                                <button 
                                  type="button"
                                  onClick={() => removeOrderItem(index)}
                                  className="remove-item-btn"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      type="button"
                      className="action-button add-item-btn"
                      onClick={addOrderItem}
                    >
                      <FaPlus /> Add Item
                    </button>
                  </div>

                  {/* Discount and Tax */}
                  <div className="discount-tax-container">
                    <div className="form-field">
                      <label>Discount (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="e.g., 10%"
                        className="discount-input"
                      />
                    </div>
                    <div className="form-field">
                      <label>Tax (%)</label>
                      <input
                        type="number"
                        min="0"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="e.g., 5.50%"
                        className="tax-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Order Summary and Payment */}
              <div className="card pos-card">
                <div className="card-header">
                  <h2>Order Summary & Payment</h2>
                </div>
                <div className="card-body">
                  {/* Order Summary */}
                  <div className="form-field">
                    <h3 className="summary-title">Summary</h3>
                    <table className="credits-table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.filter(item => item.sku_id).map((item, index) => {
                          const sku = skus.find(s => s.id === parseInt(item.sku_id));
                          return (
                            <tr key={index}>
                              <td>{sku ? sku.code : 'N/A'}</td>
                              <td>{item.quantity}</td>
                              <td>₹{item.subtotal.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Totals */}
                    <div className="totals-container">
                      <div className="total-row">
                        <span>Total Amount:</span>
                        <span>₹{totals.subtotal}</span>
                      </div>
                      <div className="total-row">
                        <span>Discount ({discount}%):</span>
                        <span>-₹{totals.discountAmount}</span>
                      </div>
                      <div className="total-row">
                        <span>Tax ({tax}%):</span>
                        <span>₹{totals.taxAmount}</span>
                      </div>
                      <div className="total-row net-amount">
                        <span>Net Amount:</span>
                        <span>₹{totals.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Tabs */}
                  <div className="form-field payment-section">
                    <h3 className="payment-title">Payment Method</h3>
                    <div className="payment-tabs">
                      <button 
                        type="button"
                        className={`payment-tab ${activePaymentTab === 'cash' ? 'active' : ''}`}
                        onClick={() => setActivePaymentTab('cash')}
                      >
                        <FaMoneyBillWave className="payment-icon" /> Cash
                      </button>
                      <button 
                        type="button"
                        className={`payment-tab ${activePaymentTab === 'qrcode' ? 'active' : ''}`}
                        onClick={() => setActivePaymentTab('qrcode')}
                      >
                        <FaQrcode className="payment-icon" /> QR Code
                      </button>
                      <button 
                        type="button"
                        className={`payment-tab ${activePaymentTab === 'credit' ? 'active' : ''}`}
                        onClick={() => setActivePaymentTab('credit')}
                      >
                        <FaCreditCard className="payment-icon" /> Credit
                      </button>
                    </div>

                    {/* Payment Tab Content */}
                    <div className="payment-content">
                      {activePaymentTab === 'cash' && (
                        <div>
                          <div className="form-field">
                            <label>Amount Received</label>
                            <input
                              type="number"
                              min={parseFloat(totals.total)}
                              step="0.01"
                              value={amountReceived}
                              onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                              placeholder="e.g., 80.00"
                              className="amount-received-input"
                            />
                          </div>
                          {amountReceived >= parseFloat(totals.total) && (
                            <div className="change-amount">
                              Change: ₹{totals.change}
                            </div>
                          )}
                        </div>
                      )}

                      {activePaymentTab === 'qrcode' && (
                        <div className="qrcode-container">
                          {qrCodeData ? (
                            <div>
                              <div className="qrcode">
                                <QRCodeSVG value={qrCodeData} size={200} />
                              </div>
                              <p>Scan this QR code to complete payment</p>
                              <button 
                                type="button"
                                className="action-button view-orders-btn"
                                onClick={() => {
                                  // In a real app, navigate to orders page
                                  // navigate('/orders');
                                  showNotification('Navigating to orders would happen here', 'success');
                                }}
                              >
                                View Orders
                              </button>
                            </div>
                          ) : (
                            <p>QR code will be generated after submitting the order</p>
                          )}
                        </div>
                      )}

                      {activePaymentTab === 'credit' && (
                        <div>
                          <div className="form-field">
                            <label>Credit Period (Days)</label>
                            <input
                              type="number"
                              min="1"
                              value={creditPeriodDays}
                              onChange={(e) => setCreditPeriodDays(parseInt(e.target.value) || 30)}
                              placeholder="e.g., 30"
                              className="credit-period-input"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="submit-container">
                    <button 
                      type="button"
                      className="action-button complete-sale-btn"
                      onClick={submitOrder}
                      disabled={
                        !selectedCustomer || 
                        !orderItems.some(item => item.sku_id) || 
                        (activePaymentTab === 'cash' && amountReceived < parseFloat(totals.total)) ||
                        (qrCodeData !== '')
                      }
                    >
                      <FaSave /> Complete Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New Customer</h2>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newCustomer.name}
                  onChange={handleNewCustomerChange}
                  placeholder="e.g., Jane Doe"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>
              <div className="form-field">
                <label>Contact Information</label>
                <input
                  type="text"
                  name="contact_info"
                  value={newCustomer.contact_info}
                  onChange={handleNewCustomerChange}
                  placeholder="e.g., jane@example.com"
                  className={`form-input ${errors.contact_info ? 'input-error' : ''}`}
                />
                {errors.contact_info && <div className="form-error">{errors.contact_info}</div>}
              </div>
              <div className="form-field">
                <label>Credit Limit</label>
                <input
                  type="number"
                  name="credit_limit"
                  min="0"
                  value={newCustomer.credit_limit}
                  onChange={handleNewCustomerChange}
                  placeholder="e.g., 500"
                  className={`form-input ${errors.credit_limit ? 'input-error' : ''}`}
                />
                {errors.credit_limit && <div className="form-error">{errors.credit_limit}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddCustomerModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                className="confirm-btn"
                onClick={addNewCustomer}
              >
                Add Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSInterface;