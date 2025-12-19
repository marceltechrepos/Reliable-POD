import express from "express";
import cors from "cors";
import "./Utils/Config.js"; // One time only
import ConnectDB from "./Utils/DB.Config.js";
import UserRouter from "./Routes/User.Route.js";
import mockupImageRouter from "./Routes/mockupImage.route.js";
import productRouter from "./Routes/product.route.js";

const app = express();

app.use(
  cors({ origin: "http://localhost:5173/", methods: ["GET", "POST", "DELETE"] })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

ConnectDB();


const routes = [UserRouter, productRouter, mockupImageRouter];
routes.forEach((route) => app.use("/api", route));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
