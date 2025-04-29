import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaBars,
  FaSignOutAlt,
  FaBox,
  FaClipboardList,
  FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const InventoryDashboard = () => {
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
          <Link to="/products" className="nav-item">
            <FaBox />
            <span>Products</span>
          </Link>
          <Link to="/stock" className="nav-item">
            <FaClipboardList />
            <span>Stock Management</span>
          </Link>
          <Link to="/inventory-reports" className="nav-item">
            <FaChartLine />
            <span>Inventory Reports</span>
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Inventory Dashboard</h1>
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
                    <h3>{user?.full_name || user?.username || 'Inventory Staff'}</h3>
                    <p>{user?.email || 'inventory@miratextile.com'}</p>
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
            <h2>Welcome to Inventory Dashboard</h2>
            <p>Manage your inventory and stock from here.</p>
          </div>
          <div className="quick-actions">
            <div className="action-card">
              <FaBox />
              <h3>Products</h3>
              <p>Manage product catalog</p>
              <Link to="/products" className="action-link">View Products</Link>
            </div>
            <div className="action-card">
              <FaClipboardList />
              <h3>Stock Management</h3>
              <p>Update and track stock</p>
              <Link to="/stock" className="action-link">Manage Stock</Link>
            </div>
            <div className="action-card">
              <FaChartLine />
              <h3>Inventory Reports</h3>
              <p>View inventory analytics</p>
              <Link to="/inventory-reports" className="action-link">View Reports</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryDashboard;
