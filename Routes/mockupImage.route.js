import { Router } from "express";
import {
  createMockupImage,
  deleteMockupImage,
  getAllMockupImage,
  uploadMockupImage,
} from "../Controllers/mockupImage.controller.js";
import { upload } from "../Middlewares/Multer/multer.js";

const router = Router();

router.post(
  "/create-mockup-image",
  upload.single("mockupImage"),
  createMockupImage
);
router.get("/get-mockup-image", getAllMockupImage);
router.put(
  "/upload-mockup-image/:id",
  upload.single("mockupImage"),
  uploadMockupImage
);
router.delete("/delete-mockup-image/:id", deleteMockupImage);

export default router;
