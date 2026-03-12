import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { deleteLayer, getDesign, saveDesign, updateLayer, uploadImage } from "../Controllers/customerDesign.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const customerRoute = Router();

customerRoute.post('/upload',isLogin, upload.single('image'), uploadImage); // /api/customer/designs
customerRoute.post('/', isLogin, saveDesign);
customerRoute.get('/:productId', isLogin, getDesign);
customerRoute.delete('/layer/:layerId', isLogin, deleteLayer);
customerRoute.put("/layer/:layerId", isLogin, updateLayer);

export default customerRoute;