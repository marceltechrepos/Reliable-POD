

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import "./index.css"
import ProductBase from "./pages/ProductBase";
import Product from "./pages/Product";
import AdminLayout from "../layout/Admin/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import Provider from "./pages/Provider";
import Category from "./pages/Category";
import { useEffect } from "react";
import Settings from "./pages/Settings";
import AdminLogin from "./components/Admin/AdminLogin";
import Editor from "./pages/AdminEditor/Editor";
import ProtectedRoute from "./components/ProtectedRoute"
import PerspectiveWarp from "./pages/PerspectiveImage";

function App() {
  // const token = localStorage.getItem("token");
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
            <Route path="category/:categoryId" element={<Product />} />
            <Route path="provider" element={<Provider />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/per" element={<PerspectiveWarp />} />
        <Route path="/admin/editor/:editId?" element={<Editor />} />
        {/* AUTH ROUTES */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  )
}

export default App
