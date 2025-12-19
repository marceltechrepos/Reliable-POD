import { Router } from "express";
import {
  // =========> Base Product
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,

  // =========> Print Area
  addPrintArea,
  getPrintAreas,
  updatePrintArea,
  removePrintArea,

  // =========> Variant
  addVariant,
  getVariant,
  updateVariant,
  removeVariant,
} from "../Controllers/product.controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";
import {upload} from "../Middlewares/Multer/multer.js"

const router = Router();

router.get("/get-product",
 //  isLogin,
    getProducts);
router.post("/create-product", 
  // isLogin,
   createProduct);

router.put(
  "/update-product/:id",
  // isLogin,
  upload.single("thumbnail"),
  updateProduct
);
router.delete("/delete-product/:id",
  // isLogin,
  
  deleteProduct);

// =========> Print Area
router.post("/:productId/print-areas",
  // isLogin,
  
  addPrintArea);
router.get("/:productId/print-areas",
  // isLogin,
  
  getPrintAreas);
router.delete("/:productId/print-areas/:printAreaId",
  // isLogin,
  
  removePrintArea);
router.put("/:productId/print-areas/:printAreaId",
  // isLogin,
  
  updatePrintArea)

// =========> Variant
router.post("/:productId/create-variant",
  // isLogin,
  
  addVariant);
router.get("/:productId/get-variant",
  // isLogin,
  
  getVariant);
router.put("/:productId/update-variant/:variantId",
  // isLogin,
  
  updateVariant);
router.delete("/:productId/delete-variant/:variantId",
  // isLogin,
  
  removeVariant);

export default router;
