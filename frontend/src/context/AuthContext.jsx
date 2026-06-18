import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gradua_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('gradua_token') || null);

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('gradua_profile');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token && !profile) {
      apiClient.get('/dashboard/profile')
        .then(data => {
          setProfile(data);
          localStorage.setItem('gradua_profile', JSON.stringify(data));
        })
        .catch(() => {}); 
    }
  }, [token, profile]);

  const login = useCallback((userData, jwt) => {
    setUser(userData);
    setToken(jwt);
    localStorage.setItem('gradua_user', JSON.stringify(userData));
    localStorage.setItem('gradua_token', jwt);

    apiClient.get('/dashboard/profile')
      .then(data => {
        setProfile(data);
        localStorage.setItem('gradua_profile', JSON.stringify(data));
      })
      .catch(() => {});
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setProfile(null);
    localStorage.removeItem('gradua_user');
    localStorage.removeItem('gradua_token');
    localStorage.removeItem('gradua_profile');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, profile, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
