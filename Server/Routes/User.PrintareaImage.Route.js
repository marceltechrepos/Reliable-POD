import { Router } from "express";
import {
  createPrintareaImage,
  getAllPrintareaImages,
  uploadPrintareaImage,
  deletePrintareaImage,
  getPrintareaImageById,
} from "../Controllers/User.PrintareaImage.Controller.js";
import { upload } from "../Middlewares/Multer/multer.js";

const userPrintAreaImage = Router();

userPrintAreaImage.post(
  "/create-printarea-image",
  upload.single("printAreaImage"),
  createPrintareaImage
);

userPrintAreaImage.get("/get-printarea-images", getAllPrintareaImages);

userPrintAreaImage.get("/get-printarea-image/:id", getPrintareaImageById);

userPrintAreaImage.put(
  "/upload-printarea-image/:id",
  upload.single("printareaImage"),
  uploadPrintareaImage
);

userPrintAreaImage.delete("/delete-printarea-image/:id", deletePrintareaImage);

export default userPrintAreaImage;