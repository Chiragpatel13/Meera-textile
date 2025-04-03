import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { 
  Box, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  FormControlLabel, 
  Switch,
  Typography
} from '@mui/material';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import { 
  FaChartBar, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaFolder,
  FaCashRegister,
  FaFileDownload,
  FaUserCircle,
  FaSync,
  FaBars,
  FaCalendarAlt
} from 'react-icons/fa';
import '../styles/dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  // Tab state
  const [tabValue, setTabValue] = useState('1');
  
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Date range states
  const [salesStartDate, setSalesStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [salesEndDate, setSalesEndDate] = useState(new Date());
  const [cashStartDate, setCashStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [cashEndDate, setCashEndDate] = useState(new Date());
  
  // Data states
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [cashReconciliationData, setCashReconciliationData] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  // Loading states
  const [loadingSales, setLoadingSales] = useState(false);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [loadingCash, setLoadingCash] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fetch sales data based on date range
  const fetchSalesData = async () => {
    setLoadingSales(true);
    try {
      const formattedStartDate = salesStartDate.toISOString().split('T')[0];
      const formattedEndDate = salesEndDate.toISOString().split('T')[0];
      
      const response = await fetch(`/api/reports/sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoadingSales(false);
    }
  };
  
  // Fetch inventory data
  const fetchInventoryData = async () => {
    setLoadingInventory(true);
    try {
      const response = await fetch('/api/reports/inventory');
      const data = await response.json();
      setInventoryData(data);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setLoadingInventory(false);
    }
  };
  
  // Fetch cash reconciliation data
  const fetchCashReconciliationData = async () => {
    setLoadingCash(true);
    try {
      const formattedStartDate = cashStartDate.toISOString().split('T')[0];
      const formattedEndDate = cashEndDate.toISOString().split('T')[0];
      
      const response = await fetch(`/api/reports/cash-reconciliation?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      const data = await response.json();
      setCashReconciliationData(data);
    } catch (error) {
      console.error('Error fetching cash reconciliation data:', error);
    } finally {
      setLoadingCash(false);
    }
  };
  
  // Initial data loading
  useEffect(() => {
    fetchSalesData();
    fetchInventoryData();
    fetchCashReconciliationData();
  }, []);
  
  // Refetch sales data when date range changes
  useEffect(() => {
    fetchSalesData();
  }, [salesStartDate, salesEndDate]);
  
  // Refetch cash data when date range changes
  useEffect(() => {
    fetchCashReconciliationData();
  }, [cashStartDate, cashEndDate]);
  
  // Prepare chart data for sales report
  const chartData = {
    labels: salesData ? salesData.map(item => item.date) : [],
    datasets: [
      {
        label: 'Daily Sales',
        data: salesData ? salesData.map(item => item.amount) : [],
        backgroundColor: '#4CAF50',
        borderColor: '#2E7D32',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales Amount ($)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };
  
  // Filter inventory data based on low stock toggle
  const filteredInventoryData = showLowStockOnly 
    ? inventoryData.filter(item => item.total_quantity < item.threshold)
    : inventoryData;
  
  // Prepare data for CSV export
  const salesCsvData = salesData.map(item => ({
    Date: item.date,
    'Total Sales': `$${item.amount.toFixed(2)}`
  }));
  
  const inventoryCsvData = filteredInventoryData.map(item => ({
    'SKU Code': item.sku_code,
    'Fabric Type': item.fabric_type,
    'Color': item.color,
    'Stock': item.total_quantity
  }));
  
  const cashCsvData = cashReconciliationData.map(item => ({
    Date: item.date,
    'Total Cash': `$${item.total_cash.toFixed(2)}`
  }));
  
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
          <li><Link to="/CustomerManagement"><FaUsers /> <span>Customers</span></Link></li>
          <li className="active"><Link to="/reports"><FaFolder /> <span>Reports</span></Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Reports</h1>
          </div>
          <div className="top-bar-actions">
            <button className="refresh-btn" onClick={() => {
              fetchSalesData();
              fetchInventoryData();
              fetchCashReconciliationData();
            }}>
              <FaSync />
            </button>
            <div className="user-menu-container">
              <button className="user-menu-btn">
                <FaUserCircle />
              </button>
            </div>
          </div>
        </div>

        {/* Reports Content */}
        <div className="dashboard-content">
          <div className="card">
            <div className="card-header">
              <h2>Store Reports</h2>
            </div>
            <div className="card-body">
              <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <TabList onChange={handleTabChange} aria-label="report tabs">
                    <Tab label="Sales Report" value="1" />
                    <Tab label="Inventory Report" value="2" />
                    <Tab label="Cash Reconciliation" value="3" />
                  </TabList>
                </Box>
                
                {/* Sales Report Tab */}
                <TabPanel value="1">
                  <div className="sales-report-container">
                    <div className="filters-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                      <div className="date-pickers" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaCalendarAlt />
                          <span>From:</span>
                          <div style={{ position: 'relative', zIndex: '100' }}>
                            <DatePicker
                              selected={salesStartDate}
                              onChange={date => setSalesStartDate(date)}
                              selectsStart
                              startDate={salesStartDate}
                              endDate={salesEndDate}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>To:</span>
                          <div style={{ position: 'relative', zIndex: '100' }}>
                            <DatePicker
                              selected={salesEndDate}
                              onChange={date => setSalesEndDate(date)}
                              selectsEnd
                              startDate={salesStartDate}
                              endDate={salesEndDate}
                              minDate={salesStartDate}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <CSVLink 
                        data={salesCsvData} 
                        filename={'sales-report.csv'}
                        className="action-button"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                      >
                        <FaFileDownload /> Export CSV
                      </CSVLink>
                    </div>
                    
                    {loadingSales ? (
                      <div className="loading">Loading sales data...</div>
                    ) : (
                      <>
                        <div style={{ height: '400px', marginBottom: '20px' }}>
                          <Bar data={chartData} options={chartOptions} />
                        </div>
                        
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 650 }} aria-label="sales table">
                            <TableHead>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell align="right">Total Sales</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {salesData.length > 0 ? (
                                salesData.map((row) => (
                                  <TableRow key={row.date}>
                                    <TableCell component="th" scope="row">
                                      {row.date}
                                    </TableCell>
                                    <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={2} align="center">No sales data available</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </div>
                </TabPanel>
                
                {/* Inventory Report Tab */}
                <TabPanel value="2">
                  <div className="inventory-report-container">
                    <div className="filters-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Switch 
                            checked={showLowStockOnly}
                            onChange={(e) => setShowLowStockOnly(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Show Low Stock Only"
                      />
                      <CSVLink 
                        data={inventoryCsvData} 
                        filename={'inventory-report.csv'}
                        className="action-button"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                      >
                        <FaFileDownload /> Export CSV
                      </CSVLink>
                    </div>
                    
                    {loadingInventory ? (
                      <div className="loading">Loading inventory data...</div>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="inventory table">
                          <TableHead>
                            <TableRow>
                              <TableCell>SKU Code</TableCell>
                              <TableCell>Fabric Type</TableCell>
                              <TableCell>Color</TableCell>
                              <TableCell align="right">Stock</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredInventoryData.length > 0 ? (
                              filteredInventoryData.map((row) => (
                                <TableRow 
                                  key={row.sku_code}
                                  sx={row.total_quantity < row.threshold ? { backgroundColor: '#ffebee' } : {}}
                                >
                                  <TableCell component="th" scope="row">
                                    {row.sku_code}
                                  </TableCell>
                                  <TableCell>{row.fabric_type}</TableCell>
                                  <TableCell>{row.color}</TableCell>
                                  <TableCell align="right">
                                    {row.total_quantity.toFixed(1)}
                                    {row.total_quantity < row.threshold && (
                                      <span style={{ color: '#d32f2f', marginLeft: '5px' }}>
                                        (Low)
                                      </span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center">No inventory data available</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                </TabPanel>
                
                {/* Cash Reconciliation Tab */}
                <TabPanel value="3">
                  <div className="cash-report-container">
                    <div className="filters-container" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                      <div className="date-pickers" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FaCalendarAlt />
                          <span>From:</span>
                          <div style={{ position: 'relative', zIndex: '100' }}>
                            <DatePicker
                              selected={cashStartDate}
                              onChange={date => setCashStartDate(date)}
                              selectsStart
                              startDate={cashStartDate}
                              endDate={cashEndDate}
                              className="form-control"
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>To:</span>
                          <div style={{ position: 'relative', zIndex: '100' }}>
                            <DatePicker
                              selected={cashEndDate}
                              onChange={date => setCashEndDate(date)}
                              selectsEnd
                              startDate={cashStartDate}
                              endDate={cashEndDate}
                              minDate={cashStartDate}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      <CSVLink 
                        data={cashCsvData} 
                        filename={'cash-reconciliation-report.csv'}
                        className="action-button"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                      >
                        <FaFileDownload /> Export CSV
                      </CSVLink>
                    </div>
                    
                    {loadingCash ? (
                      <div className="loading">Loading cash reconciliation data...</div>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="cash reconciliation table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell align="right">Total Cash</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {cashReconciliationData.length > 0 ? (
                              cashReconciliationData.map((row) => (
                                <TableRow key={row.date}>
                                  <TableCell component="th" scope="row">
                                    {row.date}
                                  </TableCell>
                                  <TableCell align="right">${row.total_cash.toFixed(2)}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={2} align="center">No cash reconciliation data available</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </div>
                </TabPanel>
              </TabContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;