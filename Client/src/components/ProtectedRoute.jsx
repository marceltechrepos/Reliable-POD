import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false, redirectPath = "/admin/login" }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    const isAuthenticated = !!token;
    const isAdmin = user?.role === "Admin";

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;