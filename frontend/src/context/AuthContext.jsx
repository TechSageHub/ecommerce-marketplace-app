import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "ecommerce_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: "", user: null };
  });

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }, [auth]);

  const login = (data) => {
    setAuth(data);
  };

  const logout = () => {
    setAuth({ token: "", user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token),
        isAdmin: auth.user?.role === "admin",
        isCustomer: auth.user?.role === "customer",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
