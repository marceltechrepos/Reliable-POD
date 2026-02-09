// routes/productRoutes.js
import express from "express";
import { updateProductThumbnail, removeProductThumbnail } from "../Controllers/product.controller.js";
import {upload} from "../Middlewares/Multer/multer.js";

const ThumbnailRoute = express.Router();

// update thumbnail
ThumbnailRoute.put(
  "/product/:id/thumbnail",
  upload.single("thumbnail"),
  updateProductThumbnail
);

// remove thumbnail
ThumbnailRoute.delete(
  "/product/:id/thumbnail",
  removeProductThumbnail
);

export default ThumbnailRoute;
