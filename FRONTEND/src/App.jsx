import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import SalesDashboard from './pages/SalesDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import Dashboard from './pages/Dashboard';
import AddUser from './pages/AddUser';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}><span>Loading...</span></div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect based on role
    if (user?.role === 'SALES_STAFF') {
      return <Navigate to="/sales" replace />;
    }
    if (user?.role === 'INVENTORY_STAFF') {
      return <Navigate to="/inventory" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Sales Staff Routes */}
          <Route 
            path="/sales/*" 
            element={
              <ProtectedRoute allowedRoles={['SALES_STAFF']}>
                <SalesDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Inventory Staff Routes */}
          <Route 
            path="/inventory/*" 
            element={
              <ProtectedRoute allowedRoles={['INVENTORY_STAFF', 'ADMIN', 'STORE_MANAGER']}>
                <InventoryDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin and Manager Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STORE_MANAGER']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/users" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/add-user" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'STORE_MANAGER']}>
                <AddUser />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={[]}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;