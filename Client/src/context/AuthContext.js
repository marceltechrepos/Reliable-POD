    // context/AuthContext.js
    import { createContext, useState, useContext, useEffect } from 'react';

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    export const AuthProvider = ({ children }) => {
        const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
        const [user, setUser] = useState(null);

        const verifyToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                return false;
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

                if (res.status === 401 || res.status === 403) {
                    // Token expired or invalid
                    logout();
                    return false;
                }

                const data = await res.json();

                if (data.success) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                    return true;
                } else {
                    logout();
                    return false;
                }
            } catch (error) {
                console.error("Token verification error:", error);
                logout();
                return false;
            }
        };

        const login = (token, userData) => {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setUser(userData);
        };

        const logout = () => {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            // Clear any other session data
            localStorage.removeItem('userData');
            sessionStorage.clear();
        };

        useEffect(() => {
            verifyToken();

            // Optional: Set up periodic token verification
            const interval = setInterval(() => {
                verifyToken();
            }, 5 * 60 * 1000); // Check every 5 minutes

            return () => clearInterval(interval);
        }, []);

        return (
            <AuthContext.Provider value={{
                isAuthenticated,
                user,
                login,
                logout,
                verifyToken
            }}>
                {children}
            </AuthContext.Provider>
        );
    };