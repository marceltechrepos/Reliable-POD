import { Layer } from "../Models/Printarea.Modal.js"; // Layer + discriminators sab isi file se import honge

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

// Update layers API (UPDATE or UPSERT)
export const updateLayers = async (req, res) => {
  try {
    const { productId } = req.params;
    const { layers } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "productId is required in params" 
      });
    }

    if (!Array.isArray(layers)) {
      return res.status(400).json({ 
        success: false, 
        message: "layers array is required" 
      });
    }

    const results = {
      created: 0,
      updated: 0,
      deleted: 0,
      failed: 0,
      layers: []
    };

    // Step 1: Pehle existing layers ke IDs collect karo
    const existingLayers = await Layer.find({ productId });
    const existingLayerIds = existingLayers.map(layer => layer.id);
    const incomingLayerIds = layers.map(layer => layer.id).filter(id => id);

    // Step 2: Delete those layers that are not in incoming array
    const idsToDelete = existingLayerIds.filter(id => !incomingLayerIds.includes(id));
    
    if (idsToDelete.length > 0) {
      const deleteResult = await Layer.deleteMany({ 
        productId, 
        id: { $in: idsToDelete } 
      });
      results.deleted = deleteResult.deletedCount;
    }

    // Step 3: Process each incoming layer (UPSERT operation)
    for (const layer of layers) {
      try {
        // Ensure productId is set
        layer.productId = productId;
        
        // Update timestamps
        layer.updatedAt = new Date();
        
        // Try to find existing layer
        const existingLayer = await Layer.findOne({ 
          productId, 
          id: layer.id 
        });

        if (existingLayer) {
          // UPDATE existing layer
          const updated = await Layer.findOneAndUpdate(
            { productId, id: layer.id },
            { $set: layer },
            { new: true, runValidators: true }
          );
          results.layers.push(updated);
          results.updated++;
        } else {
          // CREATE new layer
          layer.createdAt = new Date();
          const created = await Layer.create(layer);
          results.layers.push(created);
          results.created++;
        }
      } catch (error) {
        console.error(`Error processing layer ${layer.id}:`, error);
        results.failed++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Layers updated successfully",
      data: results.layers,
      summary: results
    });

  } catch (error) {
    console.error("Error updating layers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Alternative: Simple update (without deletion)
export const updateLayersSimple = async (req, res) => {
  try {
    const { productId } = req.params;
    const { layers } = req.body;

    if (!productId) {
      return res.status(400).json({ 
        success: false, 
        message: "productId is required" 
      });
    }

    if (!Array.isArray(layers)) {
      return res.status(400).json({ 
        success: false, 
        message: "layers array is required" 
      });
    }

    const updatedLayers = [];

    // Transaction start (agar mongoose version support karta hai)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const layer of layers) {
        layer.productId = productId;
        layer.updatedAt = new Date();

        // Upsert operation: update if exists, otherwise create
        const updatedLayer = await Layer.findOneAndUpdate(
          { productId, id: layer.id },
          layer,
          { 
            new: true, 
            upsert: true, 
            runValidators: true,
            session 
          }
        );
        
        updatedLayers.push(updatedLayer);
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Layers updated successfully",
        data: updatedLayers
      });

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Error updating layers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
