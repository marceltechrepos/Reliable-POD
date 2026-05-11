import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
// import ProtectedRoute from "./components/ProtectedRoute"
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import UserLayout from "../layout/User/UserLayout";
import UserDashboard from "./pages/UserDashboard.jsx";
import Orders from "./pages/Orders.jsx";
import MyProducts from "./pages/MyProducts.jsx";
import Catalogue from "./pages/Catalogue.jsx";
import PriceList from "./pages/PriceList.jsx";
import Stores from "./pages/Stores.jsx";
import Settings from "./pages/Settings.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import StoreDetail from "./pages/StoreDetail.jsx";
import Subcatalogue from "./pages/Subcatalogue.jsx";
import SingleProduct from "./pages/Singleproduct.jsx";
import DynamicDesignTool from "./pages/DynamicDesignTool.jsx";
import Productcatalogue from "./pages/Productcatalogue";
import Singlecatalogue from "./pages/Singlecatalogue.jsx";
import Editor from "./pagess/Editor.jsx";
import { ToastContainer } from "react-toastify";
import DesignVariants from "./components/Admin/DesignVariants.jsx";

function App() {
  return (
  
    <Router>
      <Routes>
        {/* ADMIN ROUTES */}
        {/* <Route element={<ProtectedRoute adminOnly={true}fs />}> */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products/:ProductId?" element={<MyProducts />} />
          <Route path="catalogue" element={<Catalogue />} />
          <Route path="edit/:productId" element={<Editor />} />
          <Route path="prices" element={<PriceList />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactUs />} />
          <Route
            path="sub-catalogue/:subCategoryId"
            element={<Subcatalogue />}
          />
          <Route
            path="/user/detail-product/:customProductId"
            element={<SingleProduct />}
          />
          <Route path="dynamicDesignTool" element={<DynamicDesignTool />} />
          <Route path="Productcatalogue" element={<Productcatalogue />} />

          <Route
            path="single-catalogue/:productId"
            element={<Singlecatalogue />}
          />
          <Route
            path="design-variants/:productId/:customDesignId?"
            element={<DesignVariants />}
          />
          {/* <Route path="order" element={<Order />} /> */}
          {/* <Route path="product/:id?" element={<ProductBase />} /> */}
          {/* <Route path="category" element={<Category />} /> */}
          {/* <Route path="sub-category/:subCategoryId" element={<SubCategoryProduct />} /> */}
          {/* <Route path="category/:categoryId" element={<SubCategory />} /> */}
          {/* <Route path="provider" element={<Provider />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
        </Route>

        {/* AUTH ROUTES */}
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </Router>
    // <Router>
    //   <Routes>
    //     {/* AUTH ROUTES */}
    //     <Route path="/" element={<Signin />} />
    //     <Route path="/signup" element={<Signup />} />

    //     <Route  path="/user">

    //     </Route>
    //     <Route path="/signup" element={<Signup />} />
    //   </Routes>
    // </Router>
  );
}

export default App;
