import React, { createContext, useContext, useState, useEffect } from 'react';
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = getUser();
    const token = getToken();
    if (storedUser && token) {
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeToken();
    removeUser();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
