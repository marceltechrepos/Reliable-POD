import { Router } from "express";
import {
  addUserInformation,
  CreateUser,
  getUserDetail,
  Login,
} from "../Controllers/User.Controller.js";
import { isLogin } from "../Middlewares/Authentication/Auth.middleware.js";

const UserRouter = Router();

UserRouter.post("/User/CreateUser", CreateUser);
UserRouter.post("/User/Login", Login);
UserRouter.post("/User/AddUserInfo", isLogin, addUserInformation);

UserRouter.get("/User/getUserDetail", isLogin, getUserDetail);
export default UserRouter;
