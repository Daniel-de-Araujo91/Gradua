import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { apiClient } from '../services/apiClient';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

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

  const isTypingRef = useRef(false);
  const logoutRef = useRef(null);

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

  useEffect(() => {
    if (!token) return;

    const handleFocusIn = (e) => {
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        isTypingRef.current = true;
      }
    };

    const handleFocusOut = (e) => {
      const tag = e.target.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        isTypingRef.current = false;
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const checkExpiration = () => {
      if (!isTokenExpired(token)) return;

      if (isTypingRef.current) {
        if (!logoutRef.current) {
          logoutRef.current = setTimeout(() => {
            logout();
            window.location.href = '/login';
          }, 30000);
        }
        return;
      }

      if (logoutRef.current) {
        clearTimeout(logoutRef.current);
        logoutRef.current = null;
      }

      logout();
      window.location.href = '/login';
    };

    const interval = setInterval(checkExpiration, 10000);
    return () => clearInterval(interval);
  }, [token]);

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
