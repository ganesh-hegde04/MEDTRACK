// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  const expiry = localStorage.getItem("tokenExpiry");

  const isTokenValid = token && expiry && new Date().getTime() < parseInt(expiry);

  return isTokenValid ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
