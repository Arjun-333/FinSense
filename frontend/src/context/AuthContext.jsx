import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (name) => {
    // Simulating login - just saving name locally to bypass Auth
    const dummyUser = { name, email: 'user@local', token: 'DUMMY_TOKEN' };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    setUser(dummyUser);
    return dummyUser;
  };

  const register = async (name) => {
      return login(name);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
