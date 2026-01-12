import {
  Login,
  CreateUser,
  getUserDetail,
  addUserInformation,
} from "../Controllers/User.Controller.js";

import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";
const UserRouter = Router();

UserRouter.post("/User/CreateUser", CreateUser);
UserRouter.post("/User/Login", Login);
UserRouter.post(
  "/User/AddUserInfo",
  upload.single("profileImage"),
  isLogin,
  addUserInformation
);

UserRouter.get("/User/getUserDetail", isLogin, getUserDetail);
export default UserRouter;