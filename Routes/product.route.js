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
import { upload } from "../Middlewares/Multer/multer.js";

const productRouter = Router();

productRouter.get(
  "/get-product",
  // isLogin,
  getProducts
);
productRouter.post(
  "/create-product",
  // isLogin,
  createProduct
);

productRouter.put(
  "/update-product/:id",
  // isLogin,
  upload.single("thumbnail"),
  updateProduct
);
productRouter.delete(
  "/delete-product/:id",
  // isLogin,
  deleteProduct
);

// =========> Print Area
productRouter.post(
  "/:productId/print-areas",
  // isLogin,

  addPrintArea
);
productRouter.get(
  "/:productId/print-areas",
  // isLogin,

  getPrintAreas
);
productRouter.delete(
  "/:productId/print-areas/:printAreaId",
  // isLogin,

  removePrintArea
);
productRouter.put(
  "/:productId/print-areas/:printAreaId",
  // isLogin,

  updatePrintArea
);

// =========> Variant
productRouter.post(
  "/:productId/create-variant",
  // isLogin,

  addVariant
);
productRouter.get(
  "/:productId/get-variant",
  // isLogin,

  getVariant
);
productRouter.put(
  "/:productId/update-variant/:variantId",
  // isLogin,

  updateVariant
);
productRouter.delete(
  "/:productId/delete-variant/:variantId",
  // isLogin,

  removeVariant
);

export default productRouter;
