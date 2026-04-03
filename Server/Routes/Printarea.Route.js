// routes/yourRouteFile.js
import { saveLayers, getLayersByProductId, updateLayers } from "../Controllers/printarea.Controller.js";
import { Router } from "express";
import { upload } from "../Middlewares/Multer/multer.js";

const layerRoute = Router();

layerRoute.post("/layers", upload.any(), saveLayers);
layerRoute.get("/layers/:productId/:mockupId", getLayersByProductId);
layerRoute.put("/layers/:productId/:mockupId", upload.any(), updateLayers);

export default layerRoute;