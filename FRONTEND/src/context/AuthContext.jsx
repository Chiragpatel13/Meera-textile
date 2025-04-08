// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Default user with admin role
const DEFAULT_USER = {
  role: 'STORE_MANAGER',
  username: 'admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Always provide a default user even if not logged in
    return DEFAULT_USER;
  });

  // Set up default authentication on mount
  useEffect(() => {
    // Ensure token exists
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'bypass-auth-token');
    }
    
    // Ensure user data exists
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User logged in:', userData);
  };

  const logout = () => {
    try {
      // Don't actually clear the user, just reset to default
      setUser(DEFAULT_USER);
      
      // Clean up any authentication data
      localStorage.setItem('user', JSON.stringify(DEFAULT_USER));
      
      // Optional: clear sensitive data but keep defaults
      // Comment these out if you want to preserve the session
      // localStorage.clear();
      // sessionStorage.clear();
      
      console.log('User reset to default admin');
    } catch (error) {
      console.error('Error during logout in context:', error);
      // Still reset to default user even if there's an error
      setUser(DEFAULT_USER);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);