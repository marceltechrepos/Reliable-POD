// components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ adminOnly = false, redirectPath = "/admin/login" }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/api/User/VerifyToken`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        // Clear invalid token
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        toast.error("Session expired. Please login again.");
                    }
                    setIsAuthenticated(false);
                    return;
                }

                const data = await res.json();

                if (data.success) {
                    setIsAuthenticated(true);
                    // Check if user is admin
                    const user = JSON.parse(localStorage.getItem('user')) || data.user;
                    setIsAdmin(user?.role === "Admin");
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Check admin access
    if (adminOnly && !isAdmin) {

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error("Access denied. Admin privileges required.");
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;