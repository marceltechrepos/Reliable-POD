// import { Router } from "express";
// import { createStore, getStore, validateToken } from "../Controllers/Store.Controller.js";
// import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

// const StoreRoute = Router();

// StoreRoute.post("/Store/create-store", isLogin, createStore);
// StoreRoute.get("/Store/get-store/:type", isLogin, getStore);
// StoreRoute.post("/Store/validate-token", validateToken);

// export default StoreRoute;





// =================================================================

// import { Router } from "express";
// import {
//     createStore, getStore, validateToken, getUserStores,
//     getStoreById,
//     disconnectStore,
//     createManualStore
// } from "../Controllers/Store.Controller.js";
// import {
//     initiateShopifyAuth,
//     shopifyCallback
// } from "../Controllers/Shopify.Controller.js";
// import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

// const StoreRoute = Router();

// StoreRoute.get("/Store/shopify/auth", initiateShopifyAuth);
// StoreRoute.get("/Store/shopify/callback", shopifyCallback);

// StoreRoute.post("/Store/create-store", isLogin, createStore);
// StoreRoute.post("/Store/manual-store", isLogin, createManualStore);
// StoreRoute.get("/Store/get-stores", isLogin, getUserStores);
// StoreRoute.get("/Store/get-store/:type", isLogin, getStore);
// StoreRoute.get("/Store/:storeId", isLogin, getStoreById);
// StoreRoute.delete("/Store/disconnect/:storeId", isLogin, disconnectStore);
// StoreRoute.post("/Store/validate-token", validateToken);

// export default StoreRoute;

// ================================================================================

// Routes/Store.Route.js

import { Router } from "express";
import {
    createStore,
    getUserStores,
    getStoreById,
    disconnectStore,
    createManualStore,
    validateStoreWithApiKey,
    getStoreByDomain
} from "../Controllers/Store.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const StoreRoute = Router();

// ✅ Store CRUD routes (protected)
StoreRoute.post("/create-store", isLogin, createStore);
StoreRoute.post("/manual-store", isLogin, createManualStore);
StoreRoute.get("/get-stores", isLogin, getUserStores);
StoreRoute.get("/:storeId", isLogin, getStoreById);
StoreRoute.delete("/disconnect/:storeId", isLogin, disconnectStore);

// ✅ Validation route (public - called from Shopify app)
StoreRoute.post("/validate", validateStoreWithApiKey);
StoreRoute.post("/stores/by-domain", getStoreByDomain);

export default StoreRoute;