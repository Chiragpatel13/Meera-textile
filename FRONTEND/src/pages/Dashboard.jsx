// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaRupeeSign, FaFolder, FaPlus, FaChartBar, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <>
      <style>
        {`
  .dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.dashboard h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}

.dashboard .subtitle {
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

/* KPI Cards */
.kpi-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 20px;
}

.kpi-card {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.kpi-card:hover {
  transform: translateY(-5px);
}

.kpi-card .icon {
  font-size: 24px;
  color: #00aaff;
  margin-bottom: 10px;
}

.kpi-card h3 {
  font-size: 16px;
  margin: 0 0 5px;
  color: #333;
}

.kpi-card p {
  font-size: 20px;
  margin: 0;
  color: #333;
  font-weight: bold;
}

/* Quick Actions */
.quick-actions {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.quick-actions h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.action-button {
  flex: 1;
  text-decoration: none;
  color: #00aaff;
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #e9ecef;
}

.action-button span {
  font-size: 18px;
  margin-right: 5px;
}

/* Recent Alerts */
.alerts {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.alerts h2 {
  font-size: 18px;
  color: #dc3545;
  margin-bottom: 20px;
}

.alerts p {
  font-size: 14px;
  color: #666;
}
        `}
      </style>
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