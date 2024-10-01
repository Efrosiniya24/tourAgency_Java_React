// src/components/AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      setUser({ token, role });
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:8083/tourAgency/auth/authenticate', { email, password });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('userRole', response.data.role);
    setUser({ token: response.data.access, role: response.data.role });
    console.log('Токен:', localStorage.getItem('token'));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
