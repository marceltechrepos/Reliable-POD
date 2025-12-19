import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import "./index.css"
import ProductBase from "./pages/ProductBase";
import AdminLayout from "../layout/Admin/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import Provider from "./pages/Provider";
import Category from "./pages/Category";

function App() {


  return (
    <Router>
      <Routes>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="order" element={<Order />} />
          <Route path="product" element={<ProductBase />} />
          <Route path="category" element={<Category />} />
          <Route path="provider" element={<Provider />} />
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />

      </Routes>
    </Router>
  )
}

export default App
