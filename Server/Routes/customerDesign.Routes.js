import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { deleteLayer, getcustomerDesignByuserId, getDesign, saveDesign, updateLayer, updateMockupImages, uploadFinalImage, uploadImage, uploadMockupImage } from "../Controllers/customerDesign.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerRoute = Router();

customerRoute.post('/upload', isLogin, upload.single('image'), uploadImage);
customerRoute.post('/:designId/final-image', isLogin, upload.single('image'), uploadFinalImage);
customerRoute.post('/', isLogin, saveDesign);
customerRoute.get('/:productId', isLogin, getDesign);
customerRoute.delete('/layer/:layerId', isLogin, deleteLayer);
customerRoute.put("/layer/:layerId", isLogin, updateLayer);
customerRoute.get("/user/:userId", isLogin, getcustomerDesignByuserId)


// ✅ NEW ROUTES FOR MULTIPLE MOCKUP IMAGES
customerRoute.post('/:designId/mockup-image', isLogin, upload.single('image'), uploadMockupImage);
customerRoute.put('/:designId/mockup-images', isLogin, updateMockupImages);

export default customerRoute;