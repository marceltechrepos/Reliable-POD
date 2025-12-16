import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
} from "../Controllers/product.controller.js";

const router = Router();

router.get("/get-product", getProducts);
router.post("/create-product", createProduct);
router.delete("/delete-product/:id", deleteProduct);

export default router;
