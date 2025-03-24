import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { 
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
  FaUserCircle,
  FaBars
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outstandingCredits, setOutstandingCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get sales data for last 30 days
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = today.toISOString().split('T')[0];
      
      const salesResponse = await fetch(`/api/reports/sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      const salesData = await salesResponse.json();
      
      // Get inventory status
      const inventoryResponse = await fetch('/api/reports/inventory');
      const inventoryData = await inventoryResponse.json();
      const lowStock = inventoryData.filter(item => item.total_quantity < item.threshold).length;
      
      // Get outstanding credits
      const ordersResponse = await fetch('/api/orders?status=UNPAID');
      const ordersData = await ordersResponse.json();
      
      setSalesData(salesData);
      setLowStockCount(lowStock);
      setOutstandingCredits(ordersData.slice(0, 5)); // Get first 5 for dashboard
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Prepare chart data
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
          <li className="active"><Link to="/admin/dashboard"><FaChartBar /> Dashboard</Link></li>
          <li><Link to="/inventory/manage"><FaBox /> Inventory</Link></li>
          <li><Link to="/orders"><FaShoppingCart /> Orders</Link></li>
          <li><Link to="/customers"><FaUsers /> Customers</Link></li>
          <li><Link to="/reports"><FaFolder /> Reports</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="page-title">
            <h1>Dashboard</h1>
          </div>
          <div className="user-menu">
            <button className="refresh-btn" onClick={fetchDashboardData} title="Refresh Data">
              <FaSync />
            </button>
            <div className="dropdown">
              <button className="user-avatar">
                <FaUserCircle />
              </button>
              <div className="dropdown-content">
                <Link to="/profile">View Profile</Link>
                <button onClick={handleLogout}>Logout <FaSignOutAlt /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading">Loading dashboard data...</div>
          ) : (
            <>
              {/* Sales Overview */}
              <div className="card sales-overview">
                <div className="card-header">
                  <h2>Sales Overview (Last 30 Days)</h2>
                </div>
                <div className="card-body">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>

              <div className="cards-row">
                {/* Inventory Status */}
                <div className="card inventory-status">
                  <div className="card-header">
                    <h2>Inventory Status</h2>
                  </div>
                  <div className="card-body">
                    <Link 
                      to="/inventory/manage" 
                      className={`inventory-alert ${lowStockCount > 0 ? 'alert-red' : 'alert-red'}`}
                    >
                      Low Stock Items: {lowStockCount}
                    </Link>
                  </div>
                </div>

                {/* Outstanding Credits */}
                <div className="card outstanding-credits">
                  <div className="card-header">
                    <h2>Outstanding Credits</h2>
                  </div>
                  <div className="card-body">
                    {outstandingCredits.length > 0 ? (
                      <table className="credits-table">
                        <thead>
                          <tr>
                            <th>Customer Name</th>
                            <th>Order ID</th>
                            <th>Amount Due</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outstandingCredits.map(credit => (
                            <tr key={credit.orderId}>
                              <td>{credit.customerName}</td>
                              <td>{credit.orderId}</td>
                              <td>${credit.amountDue.toFixed(2)}</td>
                              <td>{credit.dueDate}</td>
                              <td className={credit.status.toLowerCase()}>
                                {credit.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No outstanding credits</p>
                    )}
                    <Link to="/customers" className="view-all">
                      View All
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card quick-actions">
                <div className="card-header">
                  <h2>Quick Actions</h2>
                </div>
                <div className="card-body">
                  <div className="action-buttons">
                    <Link to="/admin/users" className="action-button">
                      <FaUserPlus /> Add User
                    </Link>
                    <Link to="/reports" className="action-button">
                      <FaChartBar /> View Reports
                    </Link>
                    <Link to="/customers" className="action-button">
                      <FaUsers /> Manage Customers
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;