import multer, { diskStorage } from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "images");

// create folder only if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

export const upload = multer({ storage });
