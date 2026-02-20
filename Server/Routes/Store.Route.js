import { Router } from "express";
import { createStore, getStore, validateToken } from "../Controllers/Store.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const StoreRoute = Router();

StoreRoute.post("/Store/create-store", isLogin, createStore);
StoreRoute.get("/Store/get-store/:type", isLogin, getStore);
StoreRoute.post("/Store/validate-token", validateToken);

export default StoreRoute;