import express from "express";
import {
    createCustomProduct,
    getCustomProducts,
    getCustomProductById,
    updateCustomProduct,
    deleteCustomProduct,
    bulkDeleteCustomProducts,
    getCustomProductByUserId
} from "../Controllers/customProduct.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerProductRoute = express.Router();

// Apply isLogin middleware to all routes
customerProductRoute.use(isLogin);

// CRUD operations
customerProductRoute.post("/create", createCustomProduct);
customerProductRoute.post("/bulk-delete", bulkDeleteCustomProducts); 

customerProductRoute.get("/", getCustomProducts); 
customerProductRoute.get("/user/:userId", getCustomProductByUserId)                 
customerProductRoute.get("/:id", getCustomProductById);             
customerProductRoute.put("/:id", updateCustomProduct);            
customerProductRoute.delete("/:id", deleteCustomProduct);         



export default customerProductRoute;