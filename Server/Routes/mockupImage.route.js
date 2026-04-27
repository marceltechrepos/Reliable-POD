import { Router } from "express";
import {
  createMockupImage,
  deleteMockupImage,
  duplicateMockup,
  getAllMockupImage,
  getSingleMockupImage,
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
router.post("/duplicate-mockup/:mockupId", duplicateMockup);
router.get("/get-single-mockup/:id", getSingleMockupImage);

export default router;
