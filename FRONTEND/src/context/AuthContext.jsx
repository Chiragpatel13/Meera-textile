// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchUserProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole');
      
      if (token) {
        try {
          const userData = await fetchUserProfile();
          // Ensure role is properly set
          const userWithRole = {
            ...userData,
            role: userData.role || storedRole
          };
          setUser(userWithRole);
          
          // Update localStorage with latest data
          localStorage.setItem('userName', userData.full_name || userData.username);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userRole', userData.role);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          clearAuthData();
        }
      } else {
        clearAuthData();
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const login = (userData) => {
    if (!userData.role) {
      console.error('No role provided in user data');
      return;
    }
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const logout = () => {
    try {
      clearAuthData();
      console.log('User logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear user even if there's an error
      setUser(null);
    }
  };

  const hasRole = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);