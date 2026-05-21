import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const [meRes, orgsRes] = await Promise.all([
        api.get('/accounts/me/'),
        api.get('/accounts/organizations/'),
      ]);
      setUser(meRes.data);
      const orgs = orgsRes.data?.results ?? orgsRes.data;
      setOrg(Array.isArray(orgs) && orgs.length > 0 ? orgs[0] : null);
    } catch {
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setOrg(null);
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, org, loading, logout, refetch: fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
