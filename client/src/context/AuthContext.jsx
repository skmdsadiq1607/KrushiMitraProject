import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
const AuthContext = createContext(void 0);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("crop_health_token"));
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await authApi.getMe();
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        console.warn("Auth token verification skipped or failed. Using cached profile.");
        const cached = localStorage.getItem("crop_health_user");
        if (cached) {
          setUser(JSON.parse(cached));
        } else {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCurrentUser();
  }, [token]);
  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem("crop_health_token", receivedToken);
      localStorage.setItem("crop_health_user", JSON.stringify(receivedUser));
    }
  };
  const register = async (data) => {
    const response = await authApi.register(data);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem("crop_health_token", receivedToken);
      localStorage.setItem("crop_health_user", JSON.stringify(receivedUser));
    }
  };
  const loginDemoUser = async () => {
    await login("farmer@krushimitra.org", "farmerpassword123");
  };
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("crop_health_token");
    localStorage.removeItem("crop_health_user");
  };
  return <AuthContext.Provider
    value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      loginDemoUser,
      logout
    }}
  >{children}</AuthContext.Provider>;
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export {
  AuthProvider,
  useAuth
};
