import { createContext, useContext, useEffect, useMemo, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("lms_user"));
  } catch (_error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(localStorage.getItem("lms_token"));
  const [bootstrapping, setBootstrapping] = useState(Boolean(localStorage.getItem("lms_token")));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setBootstrapping(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        setUser(currentUser);
        localStorage.setItem("lms_user", JSON.stringify(currentUser));
      } catch (_error) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("lms_token");
        localStorage.removeItem("lms_user");
      } finally {
        setBootstrapping(false);
      }
    };

    loadUser();
  }, [token]);

  const persistSession = (session) => {
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem("lms_token", session.token);
    localStorage.setItem("lms_user", JSON.stringify(session.user));
  };

  const login = async (credentials) => {
    const session = await authService.login(credentials);
    persistSession(session);
    return session.user;
  };

  const register = async (payload) => {
    const session = await authService.register(payload);
    persistSession(session);
    return session.user;
  };

  const logout = async () => {
    try {
      if (token) {
        await authService.logout();
      }
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("lms_token");
      localStorage.removeItem("lms_user");
    }
  };

  const hasRole = (...roles) => {
    return Boolean(user && roles.includes(user.role));
  };

  const value = useMemo(
    () => ({
      user,
      token,
      bootstrapping,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      hasRole
    }),
    [user, token, bootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
};

