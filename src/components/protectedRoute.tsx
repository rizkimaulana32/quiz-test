import { Navigate, Outlet } from "react-router";


const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn === "true" ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;