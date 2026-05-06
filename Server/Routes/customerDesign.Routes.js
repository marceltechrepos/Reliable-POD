// import { Router } from "express";
// import { upload } from "../Middlewares/Multer/multer.js";
// import { deleteLayer, getCustomerDesignById, getcustomerDesignByuserId, getDesign, saveDesign, updateLayer, updateMockupImages, uploadFinalImage, uploadImage, uploadMockupImage } from "../Controllers/customerDesign.Controller.js";
// import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

// const customerRoute = Router();

// customerRoute.post('/upload', isLogin, upload.single('image'), uploadImage);
// customerRoute.post('/:designId/final-image', isLogin, upload.single('image'), uploadFinalImage);
// customerRoute.post('/', isLogin, saveDesign);
// customerRoute.get('/:productId', isLogin, getDesign);
// customerRoute.delete('/layer/:layerId', isLogin, deleteLayer);
// customerRoute.put("/layer/:layerId", isLogin, updateLayer);
// customerRoute.get("/user/:userId", isLogin, getcustomerDesignByuserId)
// customerRoute.get("/:designId", isLogin, getCustomerDesignById);


// // ✅ NEW ROUTES FOR MULTIPLE MOCKUP IMAGES
// customerRoute.post('/:designId/mockup-image', isLogin, upload.single('image'), uploadMockupImage);
// customerRoute.put('/:designId/mockup-images', isLogin, updateMockupImages);

// export default customerRoute;


import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { 
  deleteLayer, 
  getCustomerDesignById, 
  getcustomerDesignByuserId, 
  getDesign, 
  saveDesign, 
  updateLayer, 
  updateMockupImages, 
  uploadFinalImage, 
  uploadImage, 
  uploadMockupImage 
} from "../Controllers/customerDesign.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerRoute = Router();

// ✅ SPECIFIC ROUTES PEHLE (top to bottom)
customerRoute.get("/user/:userId", isLogin, getcustomerDesignByuserId);
customerRoute.get("/single/:designId", isLogin, getCustomerDesignById);  // ← yeh pehle

// ✅ DYNAMIC ROUTES BAAD MEIN
customerRoute.get('/:productId', isLogin, getDesign);

// Baaki routes
customerRoute.post('/upload', isLogin, upload.single('image'), uploadImage);
customerRoute.post('/:designId/final-image', isLogin, upload.single('image'), uploadFinalImage);
customerRoute.post('/', isLogin, saveDesign);
customerRoute.delete('/layer/:layerId', isLogin, deleteLayer);
customerRoute.put("/layer/:layerId", isLogin, updateLayer);
customerRoute.post('/:designId/mockup-image', isLogin, upload.single('image'), uploadMockupImage);
customerRoute.put('/:designId/mockup-images', isLogin, updateMockupImages);

export default customerRoute;