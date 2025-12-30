import { useState, useEffect, createContext, useContext } from "react";
import axiosClient from "../services/axiosClient";
import { API_PATHS } from "../services/apiPaths";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axiosClient.get(`${API_PATHS.USERS.GET_ME}`);
        setUser(data?.user);
      } catch (error) {
        setUser(null);
        console.error("Login failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axiosClient.post(`${API_PATHS.AUTH.LOGOUT}`);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

export const useAuth = () => useContext(AuthContext);
