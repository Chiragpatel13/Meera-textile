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
      
      if (token) {
        try {
          const userData = await fetchUserProfile();
          setUser(userData);
          
          // Update localStorage with latest data
          localStorage.setItem('userName', userData.full_name || userData.username);
          localStorage.setItem('userEmail', userData.email);
          localStorage.setItem('userRole', userData.role);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // Clear invalid token and user data
          localStorage.removeItem('token');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userRole');
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log('User logged in:', userData);
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      setUser(null);
      window.location.replace('/login'); // hard redirect to login to prevent history back
    } catch (error) {
      setUser(null);
      window.location.replace('/login');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
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