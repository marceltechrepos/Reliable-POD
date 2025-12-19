import { Router } from "express";
import {
  deleteMockupImage,
  getAllMockupImage,
  uploadMockupImage,
} from "../Controllers/mockupImage.controller.js";
import { upload } from "../Middlewares/Multer/multer.js";

const router = Router();

router.get("/get-mockup-image", getAllMockupImage);
router.post("/upload-mockup-image", upload.single("thumbnail"), uploadMockupImage);
router.delete("/delete-mockup-image/:id", deleteMockupImage);

export default router;
