import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import "./Utils/Config.js"; // One time only
import ConnectDB from "./Utils/DB.Config.js";
import UserRouter from "./Routes/User.Route.js";
import mockupImageRouter from "./Routes/mockupImage.route.js";
import productRouter from "./Routes/product.route.js";
import CategoryRouter from "./Routes/Category.Route.js";
import layerRoute from "./Routes/Printarea.Route.js";
import ThumbnailRoute from "./Routes/Thumbnail.Route.js";
import StoreRoute from "./Routes/Store.Route.js";
import customerRoute from "./Routes/customerDesign.Routes.js";
import userPrintAreaImage from "./Routes/User.PrintareaImage.Route.js";
import customerProductRoute from "./Routes/customProduct.routes.js";
import orderRoute from "./Routes/order.route.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// ✅ CORS with credentials support
app.use(
  cors({
    origin: "*",
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Cookie parser (required for Shopify OAuth)
app.use(cookieParser());

// Connect to Database
ConnectDB();

app.get("/", (req, res) => res.send("Hello World!"));

// ✅ Register routes
const routes = [
  UserRouter,
  productRouter,
  mockupImageRouter,
  CategoryRouter,
  layerRoute,
  ThumbnailRoute,
  orderRoute,
  StoreRoute,
  userPrintAreaImage
];

routes.forEach((route) => {
  app.use("/api", route);
});

app.use("/api/customer/designs", customerRoute);
app.use("/api/custom-product", customerProductRoute);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
});
