import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // agar token nahi → login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // token hai → andar jane do
  return <Outlet />;
};

export default ProtectedRoute;
