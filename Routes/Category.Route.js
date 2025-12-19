import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { createCategory, createProvider, getAllCategory, getProviders } from "../Controllers/Category.Controller.js";
import { isAdmin } from "../Middlewares/Authentication/Auth.middleware.js";

const CategoryRouter = Router();

CategoryRouter.post("/Category/create-category", isAdmin, upload.single("thumbnail"), createCategory)
CategoryRouter.get("/Category/get-all-category", isAdmin, getAllCategory)

CategoryRouter.post("/Provider/create-provider", isAdmin, createProvider);
CategoryRouter.get("/Provider/get-all-provider", isAdmin, getProviders);
export default CategoryRouter;