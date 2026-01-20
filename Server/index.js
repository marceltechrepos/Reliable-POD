import express from "express";
import cors from "cors";
import "./Utils/Config.js"; // One time only
import ConnectDB from "./Utils/DB.Config.js";
import UserRouter from "./Routes/User.Route.js";
import mockupImageRouter from "./Routes/mockupImage.route.js";
import productRouter from "./Routes/product.route.js";
import CategoryRouter from "./Routes/Category.Route.js";
import layerRoute from "./Routes/Printarea.Route.js";
import ThumbnailRoute from "./Routes/Thumbnail.Route.js";

const app = express();

app.use(
  cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

ConnectDB();
app.get("/", (req, res) => res.send("Hello World!"));

const routes = [UserRouter, productRouter, mockupImageRouter, CategoryRouter, layerRoute, ThumbnailRoute];
routes.forEach((route) => app.use("/api", route));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port http://localhost:${process.env.PORT}`);
});
