// src/pages/ManagerDashboard.js
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FormInput from '../components/FormInput';
import '../styles/ManagerDashboard.css';

const ManagerDashboard = () => {
  const [view, setView] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="manager-dashboard">
      <Navbar userRole="Manager" />
      <h1>Manager Dashboard</h1>
      <div className="view-buttons">
        <button
          className={`view-button ${view === 'sales' ? 'active' : ''}`}
          onClick={() => setView('sales')}
        >
          Sales
        </button>
        <button
          className={`view-button ${view === 'inventory' ? 'active' : ''}`}
          onClick={() => setView('inventory')}
        >
          Inventory
        </button>
        <button
          className={`view-button ${view === 'crm' ? 'active' : ''}`}
          onClick={() => setView('crm')}
        >
          CRM
        </button>
        <button
          className={`view-button ${view === 'credit' ? 'active' : ''}`}
          onClick={() => setView('credit')}
        >
          Credit
        </button>
      </div>
      <div className="date-filters">
        <FormInput
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <FormInput
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="kpi-container">
        <div className="kpi-card">
          <p>Total Sales: $5000</p>
        </div>
        <div className="kpi-card">
          <p>Total Orders: 150</p>
        </div>
        <div className="kpi-card">
          <p>Inventory Alerts: 5</p>
        </div>
      </div>
      <div className="chart-placeholder">
        <p>Chart for {view} data here</p>
      </div>
    </div>
  );
};

export default ManagerDashboard;