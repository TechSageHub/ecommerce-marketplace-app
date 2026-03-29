import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={requiredRole === "admin" ? "/admin/login" : "/login"} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/account"} replace />;
  }

  return children;
}

export default ProtectedRoute;
