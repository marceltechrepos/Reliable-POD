import { Layer } from "../models/Printarea.Modal.js"; // Layer + discriminators sab isi file se import honge

// Save layers API
export const saveLayers = async (req, res) => {
  try {
    const { productId, layers } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    if (!Array.isArray(layers) || layers.length === 0) {
      return res.status(400).json({ success: false, message: "layers array is required" });
    }

    // Loop through layers and create them
    const savedLayers = [];
    for (const layer of layers) {
      // attach productId to each layer if not present
      if (!layer.productId) layer.productId = productId;

      // Save layer
      const created = await Layer.create(layer);
      savedLayers.push(created);
    }

    return res.status(200).json({
      success: true,
      message: "Layers saved successfully",
      data: savedLayers
    });

  } catch (error) {
    console.error("Error saving layers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get layers by productId
export const getLayersByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    const layers = await Layer.find({ productId }).sort({ createdAt: 1 }); // oldest first
    return res.status(200).json({
      success: true,
      data: layers
    });

  } catch (error) {
    console.error("Error fetching layers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
