import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { createCategory, getAllCategory } from "../Controllers/Category.Controller.js";
import { isAdmin } from "../Middlewares/Authentication/Auth.middleware.js";

const CategoryRouter = Router();

CategoryRouter.post("/Category/create-category", isAdmin, upload.single("thumbnail"), createCategory)
CategoryRouter.get("/Category/get-all-category", isAdmin, getAllCategory)

export default CategoryRouter;