import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { createCategory } from "../Controllers/Category.Controller.js";

const CategoryRouter = Router();

CategoryRouter.post("/Category/create-category", upload.single("thumbnail"), createCategory)

export default CategoryRouter;