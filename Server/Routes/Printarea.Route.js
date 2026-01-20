import { saveLayers, getLayersByProductId, updateLayers, updateLayersSimple } from "../Controllers/printarea.Controller.js";
import { Router } from "express";

const layerRoute = Router();

// Save layers (POST)
layerRoute.post("/layers", saveLayers);

// Get layers for a product (GET)
layerRoute.get("/layers/:productId", getLayersByProductId);
// Update layers (PUT) - For editing existing layers
layerRoute.put("/layers/:productId", updateLayers);

// Alternative update (PATCH)
layerRoute.patch("/layers/:productId", updateLayersSimple);

export default layerRoute;