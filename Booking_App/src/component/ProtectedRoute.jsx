import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // TODO: Re-enable token check for production
  // const token = localStorage.getItem("token"); // Check if token exists
  // return token ? children : <Navigate to="/barberlogin" />;
  return children; // Temporarily bypass auth for testing CSS changes
};

export default ProtectedRoute;
