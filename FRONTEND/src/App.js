// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './styles/ResetPassword';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ManualOrderEntry from './pages/ManualOrderEntry';
import InventoryStaff from './pages/InventoryStaff';
import PaymentProcessing from './pages/PaymentProcessing';
import Reporting from './pages/Reporting';
import ManagerDashboard from './pages/ManagerDashboard';
import Profile from './pages/Profile';
import POS from './pages/POS';
import CustomerManagement from './pages/CustomerManagement';
import Reportingpage from './pages/Reportingpage';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/ResetPassword" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Navigate to="/admin/dashboard" /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/UserManagement" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
        <Route path="/InventoryManagement" element={<ProtectedRoute><InventoryStaff /></ProtectedRoute>} />
        <Route path="/CustomerManagement" element={<ProtectedRoute><CustomerManagement /></ProtectedRoute>} />
        <Route path="/Reportingpage" element={<ProtectedRoute><Reportingpage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><ManualOrderEntry /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentProcessing /></ProtectedRoute>} />
        <Route path="/reporting" element={<ProtectedRoute><Reporting /></ProtectedRoute>} />
        <Route path="/manager-dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />

        {/* Redirect legacy routes */}
        <Route path="/inventory" element={<Navigate to="/InventoryManagement" />} />
        <Route path="/InventoryStaff" element={<Navigate to="/InventoryManagement" />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;