import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import InventoryStaff from './pages/InventoryStaff';
import POS from './pages/POS';
import CustomerManagement from './pages/CustomerManagement';
import Reportingpage from './pages/Reportingpage';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/inventory/manage" element={
            <ProtectedRoute>
              <InventoryStaff />
            </ProtectedRoute>
          } />
          <Route path="/pos" element={
            <ProtectedRoute>
              <POS />
            </ProtectedRoute>
          } />
          <Route path="/CustomerManagement" element={
            <ProtectedRoute>
              <CustomerManagement />
            </ProtectedRoute>
          } />
          <Route path="/Reportingpage" element={
            <ProtectedRoute>
              <Reportingpage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;