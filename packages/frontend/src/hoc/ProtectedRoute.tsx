import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isLoggedIn = !!localStorage.getItem("isLoggedIn");

  return isLoggedIn ? element : <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
