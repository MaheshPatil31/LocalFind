import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);
const TOKEN_KEY = 'localfind.authToken';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authApi.me(token).then(({ user: currentUser }) => setUser(currentUser)).catch(() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }).finally(() => setLoading(false));
  }, [token]);

  function saveSession(session) { localStorage.setItem(TOKEN_KEY, session.token); setToken(session.token); setUser(session.user); }
  function logout() { localStorage.removeItem(TOKEN_KEY); setToken(null); setUser(null); }
  const value = useMemo(() => ({ user, token, loading, isAuthenticated: Boolean(user), saveSession, logout }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider.'); return context; }
