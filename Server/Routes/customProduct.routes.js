// import express from "express";
// import {
//     createCustomProduct,
//     getCustomProducts,
//     getCustomProductById,
//     updateCustomProduct,
//     deleteCustomProduct,
//     bulkDeleteCustomProducts,
//     getCustomProductByUserId,
//     importProductsToShopify,
//     getImportedProductsByStore
// } from "../Controllers/customProduct.Controller.js";
// import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

// const customerProductRoute = express.Router();

// // Apply isLogin middleware to all routes
// customerProductRoute.use(isLogin);

// // CRUD operations
// customerProductRoute.post("/create", createCustomProduct);
// customerProductRoute.post("/bulk-delete", bulkDeleteCustomProducts); 

// customerProductRoute.get("/", getCustomProducts); 
// customerProductRoute.get("/user/:userId", getCustomProductByUserId)                 
// customerProductRoute.get("/:id", getCustomProductById);             
// customerProductRoute.put("/:id", updateCustomProduct);            
// customerProductRoute.delete("/:id", deleteCustomProduct);         
// customerProductRoute.post("/import", importProductsToShopify);
// customerProductRoute.get("/store/:storeId/imported", getImportedProductsByStore);



// export default customerProductRoute;


import express from "express";
import {
    createCustomProduct,
    getCustomProducts,
    getCustomProductById,
    updateCustomProduct,
    deleteCustomProduct,
    bulkDeleteCustomProducts,
    getCustomProductByUserId,
    importProductsToShopify,
    getImportedProductsByStore  // ✅ Add this
} from "../Controllers/customProduct.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerProductRoute = express.Router();

// ✅ Apply isLogin middleware to all routes EXCEPT the public ones
// customerProductRoute.use(isLogin); // COMMENT THIS OUT

// CRUD operations (protected)
customerProductRoute.post("/create", isLogin, createCustomProduct);
customerProductRoute.post("/bulk-delete", isLogin, bulkDeleteCustomProducts);
customerProductRoute.get("/", isLogin, getCustomProducts);
customerProductRoute.get("/user/:userId", isLogin, getCustomProductByUserId);
customerProductRoute.get("/:id", isLogin, getCustomProductById);
customerProductRoute.put("/:id", isLogin, updateCustomProduct);
customerProductRoute.delete("/:id", isLogin, deleteCustomProduct);
customerProductRoute.post("/import", isLogin, importProductsToShopify);

// ✅ Public route - No authentication required
customerProductRoute.get("/store/:storeId/imported", getImportedProductsByStore);

export default customerProductRoute;