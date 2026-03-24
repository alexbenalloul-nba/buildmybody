import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out

  useEffect(() => {
    api.me().then(setUser).catch(() => setUser(null));
  }, []);

  const login = async (credentials) => {
    const u = await api.login(credentials);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const u = await api.register(data);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
