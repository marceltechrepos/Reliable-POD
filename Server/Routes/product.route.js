import { Router } from "express";
import {
  // =========> Base Product
  getProducts,
  getProductsByCategoryId,
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
  createMockup,
  getProductsById,
  addMockupsToProduct,
  removeMockupFromProduct,
  getVariantAttributes,
  saveVariantAttributes,
} from "../Controllers/product.controller.js";
import {
  isLogin, isAdmin,
} from "../Middlewares/Authentication/Auth.middleware.js";
import { upload } from "../Middlewares/Multer/multer.js";

const productRouter = Router();

productRouter.get(
  "/get-product",
  isLogin,
  getProducts
);

productRouter.get(
  "/get-product-By-Id/:id",
  isLogin,
  getProductsById
);

productRouter.get(
  "/get-product-by-category/:categoryId",
  isLogin,
  getProductsByCategoryId
);
productRouter.post(
  "/create-product",
  isLogin,
  isAdmin,
  createProduct
);

productRouter.post(
  "/create-mockup",
  isLogin,
  isAdmin,
  createMockup
);

productRouter.put(
  "/update-product/:id",
  isLogin,
  isAdmin,
  upload.single("thumbnail"),
  updateProduct
);
productRouter.delete(
  "/delete-product/:id",
  isLogin,
  isAdmin,
  deleteProduct
);

// =========> Print Area
productRouter.post(
  "/:productId/print-areas",
  isLogin,

  addPrintArea
);
productRouter.get(
  "/:productId/print-areas",
  isLogin,

  getPrintAreas
);
productRouter.delete(
  "/:productId/print-areas/:printAreaId",
  isLogin,

  removePrintArea
);
productRouter.put(
  "/:productId/print-areas/:printAreaId",
  isLogin,

  updatePrintArea
);

// =========> Variant
productRouter.post(
  "/:productId/create-variant",
  isLogin,

  addVariant
);
productRouter.get(
  "/:productId/get-variant",
  isLogin,

  getVariant
);
productRouter.put(
  "/:productId/update-variant/:variantId",
  isLogin,

  updateVariant
);
productRouter.delete(
  "/:productId/delete-variant/:variantId",
  isLogin,

  removeVariant
);

// ========================== custom variants

productRouter.get('/:productId/variant-attributes', isLogin, getVariantAttributes);
productRouter.post('/:productId/variant-attributes', isLogin, saveVariantAttributes);


// ================== mockupid add 

productRouter.post("/add-mockups", addMockupsToProduct);
productRouter.delete("/product/remove-mockup/:productId/:mockupId", removeMockupFromProduct);

export default productRouter;
