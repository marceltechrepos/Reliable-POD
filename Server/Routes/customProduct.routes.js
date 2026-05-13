import express from "express";
import {
    createCustomProduct,
    getCustomProducts,
    getCustomProductById,
    updateCustomProduct,
    deleteCustomProduct,
    bulkDeleteCustomProducts,
    getCustomProductByUserId,
    getCustomProductByShopifyId,
    updateShopifyProductId,
    importProductsToShopify,
    getImportedProductsByStore  // ✅ Add this
} from "../Controllers/customProduct.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerProductRoute = express.Router();

// ✅ Apply isLogin middleware to all routes EXCEPT the public ones
// customerProductRoute.use(isLogin); // COMMENT THIS OUT

// CRUD operations (protected)
customerProductRoute.post("/custom-product/create", isLogin, createCustomProduct);
customerProductRoute.post("/custom-product/bulk-delete", isLogin, bulkDeleteCustomProducts);
customerProductRoute.get("/custom-product", isLogin, getCustomProducts);
customerProductRoute.get("/custom-product/user/:userId", isLogin, getCustomProductByUserId);
customerProductRoute.get("/custom-product/:id", isLogin, getCustomProductById);
customerProductRoute.put("/custom-product/:id", isLogin, updateCustomProduct);
customerProductRoute.put("/update-shopify-id/:id", isLogin, updateShopifyProductId);
customerProductRoute.delete("/custom-product/:id", isLogin, deleteCustomProduct);
customerProductRoute.post("/custom-product/import", isLogin, importProductsToShopify);

// ✅ Public routes - No authentication required
customerProductRoute.get("/custom-product/shopify/:shopifyProductId", getCustomProductByShopifyId);
customerProductRoute.get("/custom-product/store/:storeId/imported", getImportedProductsByStore);

export default customerProductRoute;