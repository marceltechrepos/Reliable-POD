import { saveLayers, getLayersByProductId } from "../Controllers/Printarea.Controller.js";
import { Router } from "express";

const layerRoute = Router();

// Save layers (POST)
layerRoute.post("/layers", saveLayers);

// Get layers for a product (GET)
layerRoute.get("/layers/:productId", getLayersByProductId);

export default layerRoute;