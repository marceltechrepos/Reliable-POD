import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ adminOnly = false, redirectPath = "/admin/login" }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
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

                if (res.status === 401) {
                    // ❌ DON'T REMOVE TOKEN HERE - Let interceptor handle it
                    setIsAuthenticated(false);
                    return;
                }

                const data = await res.json();

                if (data.success) {
                    setIsAuthenticated(true);
                    const user = JSON.parse(localStorage.getItem('user')) || data.user;
                    setIsAdmin(user?.role === "Admin");
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
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

    if (adminOnly && !isAdmin) {
        // ❌ DON'T REMOVE TOKEN HERE
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;