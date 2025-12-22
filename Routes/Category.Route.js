import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import {
  createCategory,
  getAllCategory,
  deleteCategory,
  createProvider,
  getProviders,
  deleteProvider,
  updateProvider,
  updateCategory,
} from "../Controllers/Category.Controller.js";
import { isAdmin } from "../Middlewares/Authentication/Auth.middleware.js";

const CategoryRouter = Router();

// =======> Category

CategoryRouter.post(
  "/Category/create-category",
  //  isAdmin,
  upload.single("thumbnail"),
  createCategory
);

CategoryRouter.get(
  "/Category/get-all-category",
  //  isAdmin,
  getAllCategory
);

CategoryRouter.put(
  "/Category/update-category/:categoryId",
  //  isAdmin,
  upload.single("thumbnail"),
  updateCategory
);

CategoryRouter.delete(
  "/Category/delete-category/:categoryId",
  //  isAdmin,
  deleteCategory
);

// ======> Providers

CategoryRouter.post(
  "/Provider/create-provider",
  //  isAdmin,
  createProvider
);
CategoryRouter.get(
  "/Provider/get-all-provider",
  //  isAdmin,
  getProviders
);

CategoryRouter.put(
  "/Provider/update-provider/:providerId",
  //  isAdmin,
  updateProvider
);
CategoryRouter.delete(
  "/Provider/delete-provider/:providerId",
  //  isAdmin,
  deleteProvider
);
export default CategoryRouter;
