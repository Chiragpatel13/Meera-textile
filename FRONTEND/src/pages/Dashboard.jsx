// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaRupeeSign, FaFolder, FaPlus, FaChartBar, FaUsers } from 'react-icons/fa';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <>
      
      <div className="dashboard">
        <h1>Welcome to Textile Management System</h1>
        <p className="subtitle">Manage your textile business efficiently</p>

        {/* KPI Cards */}
        <div className="kpi-container">
          <div className="kpi-card">
            <FaBox className="icon" />
            <h3>Total Inventory</h3>
            <p>0</p>
          </div>
          <div className="kpi-card">
            <FaShoppingCart className="icon" />
            <h3>Pending Orders</h3>
            <p>0</p>
          </div>
          <div className="kpi-card">
            <FaRupeeSign className="icon" />
            <h3>Today's Sales</h3>
            <p>₹0</p>
          </div>
          <div className="kpi-card">
            <FaFolder className="icon" />
            <h3>Storage Used</h3>
            <p>0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/inventory" className="action-button">
              <FaPlus /> Add New Product
            </Link>
            <Link to="/orders" className="action-button">
              <FaShoppingCart /> Create Order
            </Link>
            <Link to="/reporting" className="action-button">
              <FaChartBar /> View Reports
            </Link>
            <Link to="/manager-dashboard" className="action-button">
              <FaUsers /> Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="alerts">
          <h2>Recent Alerts</h2>
          <p>No alerts at the moment.</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;