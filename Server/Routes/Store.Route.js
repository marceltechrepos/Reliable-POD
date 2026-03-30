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