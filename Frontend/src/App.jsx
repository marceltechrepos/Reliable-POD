import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin"
import Signup from "./components/Signup"
import Dashboard from "./components/Dashboard";
import "./index.css"
import Order from "./components/Order";
import ProductBase from "./components/ProductBase";

function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order" element={<Order />} />
        <Route path="/product" element={<ProductBase />} />

      </Routes>
    </Router>
  ) 
}

export default App
