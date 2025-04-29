import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaBars,
  FaSignOutAlt,
  FaChartBar,
  FaCashRegister,
  FaUsers
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const SalesDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2>{sidebarCollapsed ? 'MT' : 'Mira Textile'}</h2>
          <button onClick={toggleSidebar} className="toggle-btn">
            <FaBars />
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/pos" className="nav-item">
            <FaCashRegister />
            <span>POS System</span>
          </Link>
          <Link to="/customers" className="nav-item">
            <FaUsers />
            <span>Customers</span>
          </Link>
          <Link to="/sales-reports" className="nav-item">
            <FaChartBar />
            <span>Sales Reports</span>
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Sales Dashboard</h1>
          </div>
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
                    <h3>{user?.full_name || user?.username || 'Sales Staff'}</h3>
                    <p>{user?.email || 'sales@miratextile.com'}</p>
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
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to Sales Dashboard</h2>
            <p>Access your sales tools and reports from here.</p>
          </div>
          <div className="quick-actions">
            <div className="action-card">
              <FaCashRegister />
              <h3>POS System</h3>
              <p>Process sales and transactions</p>
              <Link to="/pos" className="action-link">Open POS</Link>
            </div>
            <div className="action-card">
              <FaUsers />
              <h3>Customers</h3>
              <p>Manage customer information</p>
              <Link to="/customers" className="action-link">View Customers</Link>
            </div>
            <div className="action-card">
              <FaChartBar />
              <h3>Sales Reports</h3>
              <p>View sales analytics</p>
              <Link to="/sales-reports" className="action-link">View Reports</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;
