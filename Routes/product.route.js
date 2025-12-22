import { Router } from "express";
import {
  // =========> Base Product
  createProduct,
  deleteProduct,
  getProducts,

  // =========> Print Area
  addPrintArea,
  getPrintAreas,
  removePrintArea,

  // =========> Variant
  addVariant,
  getVariant,
  updateVariant,
  removeVariant,
  updateProduct,
} from "../Controllers/product.controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";
import { upload } from "../Middlewares/Multer/multer.js";


const router = Router();

router.get("/get-product", isLogin, getProducts);
router.post("/create-product", isLogin, createProduct);

router.put(
  "/update-product/:id",
  isLogin,
  upload.single("thumbnail"),
  updateProduct
);
router.delete("/delete-product/:id", deleteProduct);

// =========> Print Area
router.post("/:productId/print-areas", addPrintArea);

router.get("/:productId/print-areas", getPrintAreas);

router.delete("/:productId/print-areas/:printAreaId", removePrintArea);

// =========> Variant
router.post("/:productId/variant", addVariant);
router.get("/:productId/variant", getVariant);
router.put("/:productId/:variantId/variant", updateVariant);
router.delete("/:productId/:variantId/variant", removeVariant);

export default router;
