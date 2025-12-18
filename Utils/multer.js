import multer, { diskStorage } from "multer";

const dir = "public/images";

const storage = diskStorage({
  destination: function (_, file, cb) {
    cb(null, dir);
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
