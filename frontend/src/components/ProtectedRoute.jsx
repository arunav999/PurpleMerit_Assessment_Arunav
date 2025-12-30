import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Unauthenticated: Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated: Render the Child Route (Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
