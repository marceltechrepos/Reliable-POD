// import { saveLayers, getLayersByProductId, updateLayers } from "../Controllers/printarea.Controller.js";
// import { Router } from "express";
// import { upload } from "../Middlewares/Multer/multer.js"

// const layerRoute = Router();

// // Save layers (POST)
// layerRoute.post("/layers", upload.array("printareaImages"), saveLayers);

// // Get layers for a product (GET)
// layerRoute.get("/layers/:productId", getLayersByProductId);
// // Update layers (PUT) - For editing existing layers
// layerRoute.put("/layers/:productId", upload.array("printareaImages"), updateLayers);
// // layerRoute.put("/:productId/layers/:layerId", upload.array("printareaImages"), updateLayers);

// export default layerRoute;

// routes/yourRouteFile.js
import { saveLayers, getLayersByProductId, updateLayers } from "../Controllers/printarea.Controller.js";
import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";

const layerRoute = Router();

layerRoute.post("/layers", upload.any(), saveLayers);
layerRoute.get("/layers/:productId", getLayersByProductId);
layerRoute.put("/layers/:productId", upload.any(), updateLayers);

export default layerRoute;