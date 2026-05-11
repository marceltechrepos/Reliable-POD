// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"
import ProductBase from "./pages/ProductBase";
import SubCategoryProduct from "./pages/SubCategoryProduct";
import AdminLayout from "../layout/Admin/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import Provider from "./pages/Provider";
import Category from "./pages/Category";
import Settings from "./pages/Settings";
import AdminLogin from "./components/Admin/AdminLogin";
import Editor from "./pages/AdminEditor/Editor";
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import SubCategory from "./pages/SubCategory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./components/Signup.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("token") ? null : false); // null = checking, true = authed, false = not authed

  useEffect(() => {
    // Setup axios interceptor for automatic token handling
    const setupAxiosInterceptor = () => {
      // Request interceptor to add token
      axios.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem("token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Response interceptor to handle token expiration
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            setIsAuthenticated(false);

            // Show notification
            toast.error("Session expired. Please login again.", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });

            // Redirect to login page
            if (window.location.pathname !== "/admin/login") {
              window.location.href = "/admin/login";
            }
          }

          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptor();

    // Verify token on app load
    const verifyTokenOnLoad = async () => {
      const token = localStorage.getItem("token");

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

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    if (localStorage.getItem("token")) {
      verifyTokenOnLoad();
    }

    // Check token periodically (every 5 minutes)
    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

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
          if (res.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);

            toast.error("Session expired. Please login again.", {
              position: "top-right",
              autoClose: 5000,
            });

            if (window.location.pathname.startsWith("/admin") &&
              window.location.pathname !== "/admin/login") {
              window.location.href = "/admin/login";
            }
          }
        }
      } catch (error) {
        console.error("Periodic token check failed:", error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="order" element={<Order />} />
            <Route path="product/:id?" element={<ProductBase />} />
            <Route path="category" element={<Category />} />
            <Route path="sub-category/:subCategoryId" element={<SubCategoryProduct />} />
            <Route path="category/:categoryId" element={<SubCategory />} />
            <Route path="provider" element={<Provider />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* <Route path="/admin/signup" element={<Signup />} /> */}
        <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />} />
        <Route path="/admin/editor/:editId?/:mockupId?" element={<Editor />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/login" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;