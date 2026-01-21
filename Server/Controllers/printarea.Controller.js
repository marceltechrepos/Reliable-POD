// import { Layer } from "../Models/Printarea.Modal.js"; // Layer + discriminators sab isi file se import honge

// // Save layers API
// export const saveLayers = async (req, res) => {
//   try {
//     const { productId, layers } = req.body;

//     if (!productId) {
//       return res.status(400).json({ success: false, message: "productId is required" });
//     }

//     if (!Array.isArray(layers) || layers.length === 0) {
//       return res.status(400).json({ success: false, message: "layers array is required" });
//     }

//     // Loop through layers and create them
//     const savedLayers = [];
//     for (const layer of layers) {
//       // attach productId to each layer if not present
//       if (!layer.productId) layer.productId = productId;

//       // Save layer
//       const created = await Layer.create(layer);
//       savedLayers.push(created);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Layers saved successfully",
//       data: savedLayers
//     });

//   } catch (error) {
//     console.error("Error saving layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Get layers by productId
// export const getLayersByProductId = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     if (!productId) {
//       return res.status(400).json({ success: false, message: "productId is required" });
//     }

//     const layers = await Layer.find({ productId }).sort({ createdAt: 1 }); // oldest first
//     return res.status(200).json({
//       success: true,
//       data: layers
//     });

//   } catch (error) {
//     console.error("Error fetching layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Update layers API (UPDATE or UPSERT)
// export const updateLayers = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { layers } = req.body;

//     if (!productId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "productId is required in params" 
//       });
//     }

//     if (!Array.isArray(layers)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "layers array is required" 
//       });
//     }

//     const results = {
//       created: 0,
//       updated: 0,
//       deleted: 0,
//       failed: 0,
//       layers: []
//     };

//     // Step 1: Pehle existing layers ke IDs collect karo
//     const existingLayers = await Layer.find({ productId });
//     const existingLayerIds = existingLayers.map(layer => layer.id);
//     const incomingLayerIds = layers.map(layer => layer.id).filter(id => id);

//     // Step 2: Delete those layers that are not in incoming array
//     const idsToDelete = existingLayerIds.filter(id => !incomingLayerIds.includes(id));

//     if (idsToDelete.length > 0) {
//       const deleteResult = await Layer.deleteMany({ 
//         productId, 
//         id: { $in: idsToDelete } 
//       });
//       results.deleted = deleteResult.deletedCount;
//     }

//     // Step 3: Process each incoming layer (UPSERT operation)
//     for (const layer of layers) {
//       try {
//         // Ensure productId is set
//         layer.productId = productId;

//         // Update timestamps
//         layer.updatedAt = new Date();

//         // Try to find existing layer
//         const existingLayer = await Layer.findOne({ 
//           productId, 
//           id: layer.id 
//         });

//         if (existingLayer) {
//           // UPDATE existing layer
//           const updated = await Layer.findOneAndUpdate(
//             { productId, id: layer.id },
//             { $set: layer },
//             { new: true, runValidators: true }
//           );
//           results.layers.push(updated);
//           results.updated++;
//         } else {
//           // CREATE new layer
//           layer.createdAt = new Date();
//           const created = await Layer.create(layer);
//           results.layers.push(created);
//           results.created++;
//         }
//       } catch (error) {
//         console.error(`Error processing layer ${layer.id}:`, error);
//         results.failed++;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Layers updated successfully",
//       data: results.layers,
//       summary: results
//     });

//   } catch (error) {
//     console.error("Error updating layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// // Alternative: Simple update (without deletion)
// export const updateLayersSimple = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { layers } = req.body;

//     if (!productId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "productId is required" 
//       });
//     }

//     if (!Array.isArray(layers)) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "layers array is required" 
//       });
//     }

//     const updatedLayers = [];

//     // Transaction start (agar mongoose version support karta hai)
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       for (const layer of layers) {
//         layer.productId = productId;
//         layer.updatedAt = new Date();

//         // Upsert operation: update if exists, otherwise create
//         const updatedLayer = await Layer.findOneAndUpdate(
//           { productId, id: layer.id },
//           layer,
//           { 
//             new: true, 
//             upsert: true, 
//             runValidators: true,
//             session 
//           }
//         );

//         updatedLayers.push(updatedLayer);
//       }

//       await session.commitTransaction();
//       session.endSession();

//       return res.status(200).json({
//         success: true,
//         message: "Layers updated successfully",
//         data: updatedLayers
//       });

//     } catch (error) {
//       await session.abortTransaction();
//       session.endSession();
//       throw error;
//     }

//   } catch (error) {
//     console.error("Error updating layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };



import { Layer } from "../Models/Printarea.Modal.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import fs from 'fs';

// Helper function to upload image to Cloudinary
const uploadImageToCloudinary = async (imagePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "printareas",
      resource_type: "auto",
    });

    // Delete local file after upload
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };
  } catch (error) {
    // Clean up local file if upload fails
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    throw error;
  }
};

// Helper function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export const saveLayers = async (req, res) => {
  try {
    console.log("=== SAVE LAYERS REQUEST ===");
    const { productId, layers, layerIds } = req.body;
    const files = req.files || [];

    console.log("Product ID:", productId);
    console.log("Files received:", files.length);
    console.log("Layer IDs from body:", layerIds);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    // Parse layers
    let layersArray = [];
    try {
      layersArray = JSON.parse(layers);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid layers JSON format"
      });
    }

    if (!Array.isArray(layersArray) || layersArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "layers array is required"
      });
    }

    // Parse layerIds (frontend se array aayega)
    let layerIdsArray = [];
    try {
      if (layerIds) {
        layerIdsArray = JSON.parse(layerIds);
        if (!Array.isArray(layerIdsArray)) {
          layerIdsArray = [layerIdsArray];
        }
      }
    } catch (e) {
      console.log("Error parsing layerIds:", e);
      layerIdsArray = [];
    }

    console.log("Layer IDs array:", layerIdsArray);
    console.log("Layers count:", layersArray.length);

    const savedLayers = [];

    // First, delete all existing layers for this product (clean slate)
    await Layer.deleteMany({ productId });
    console.log("Deleted existing layers for product:", productId);

    // Create mapping of layerId to file
    const fileMap = {};
    for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
      const layerId = layerIdsArray[i];
      fileMap[layerId] = files[i];
      console.log(`Mapped file ${files[i].originalname} to layer ${layerId}`);
    }

    // Process each layer
    for (const layer of layersArray) {
      try {
        // Attach productId
        layer.productId = productId;

        // 🔥 IMPORTANT: Remove _id from frontend data to avoid duplicate key error
        delete layer._id;
        delete layer.__v;

        // Handle printarea image
        if (layer.type === "printarea" && layer.hasImage) {
          const file = fileMap[layer.id];

          if (file) {
            try {
              console.log(`Uploading image for layer ${layer.id}...`);
              const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "printareas",
                resource_type: "image",
                public_id: `printarea_${layer.id}_${Date.now()}`
              });

              layer.imageSrc = uploadResult.secure_url;
              layer.imagePublicId = uploadResult.public_id;
              layer.hasImage = true;

              console.log(`✓ Image uploaded: ${uploadResult.secure_url}`);

              // Clean up local file
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }

            } catch (uploadError) {
              console.error("Cloudinary upload error:", uploadError);
              layer.imageSrc = null;
              layer.hasImage = false;
            }
          } else if (layer.imageSrc === "UPLOADING") {
            layer.imageSrc = null;
            layer.hasImage = false;
            console.log(`✗ No image for layer ${layer.id}`);
          } else if (layer.imageSrc && layer.imageSrc.startsWith("http")) {
            // Already has a URL (from previous save)
            console.log(`✓ Layer ${layer.id} already has image URL`);
            layer.hasImage = true;
          } else {
            layer.imageSrc = null;
            layer.hasImage = false;
          }
        }

        // Save layer (Mongoose will generate new _id)
        const created = await Layer.create(layer);
        savedLayers.push(created);
        console.log(`✓ Saved layer ${layer.id}`);

      } catch (layerError) {
        console.error(`Error saving layer ${layer?.id}:`, layerError);
        // Continue with other layers
      }
    }

    // Clean up any remaining files
    files.forEach(file => {
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (cleanupError) {
          console.error("Error cleaning up file:", cleanupError);
        }
      }
    });

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

// ================================================================================

// ✅ SAVE LAYERS WITH IMAGE UPLOAD
// Controllers/printarea.Controller.js
// export const saveLayers = async (req, res) => {
//   try {
//     const { productId, layers } = req.body;
//     const files = req.files; // ✅ Multer array se files aayengi

//     console.log("Product ID from body:", productId);
//     console.log("Layers from body (string):", layers);
//     console.log("File received:", files ? `Yes - ${files.originalname}` : "No")

//     if (!productId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "productId is required" 
//       });
//     }

//     let layersArray = [];
//     try {
//       layersArray = JSON.parse(layers);
//     } catch (parseError) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Invalid layers JSON format" 
//       });
//     }

//     if (!Array.isArray(layersArray) || layersArray.length === 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "layers array is required" 
//       });
//     }

//     const savedLayers = [];
//     let fileIndex = 0;

//     for (const layer of layersArray) {
//       // Attach productId
//       if (!layer.productId) layer.productId = productId;

//       // Handle printarea image
//       if (layer.type === "printarea" && layer.hasImage) {
//         // Agar file available hai aur yeh woh layer hai jo image upload kar rahi hai
//         if (files[fileIndex]) {
//           try {
//             // Upload to Cloudinary
//             const uploadResult = await cloudinary.uploader.upload(files[fileIndex].path, {
//               folder: "printareas",
//               resource_type: "auto",
//             });

//             // Update layer with Cloudinary URL
//             layer.imageSrc = uploadResult.secure_url;
//             layer.imagePublicId = uploadResult.public_id;
//             layer.hasImage = true;

//             // Clean up local file
//             if (fs.existsSync(files[fileIndex].path)) {
//               fs.unlinkSync(files[fileIndex].path);
//             }

//             fileIndex++;

//           } catch (uploadError) {
//             console.error("Cloudinary upload error:", uploadError);
//             layer.imageSrc = null;
//             layer.hasImage = false;
//           }
//         } else if (layer.imageSrc === "UPLOADING") {
//           // Agar image upload nahi hui, to hasImage false karo
//           layer.imageSrc = null;
//           layer.hasImage = false;
//         }
//       }

//       // Save layer
//       const created = await Layer.create(layer);
//       savedLayers.push(created);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Layers saved successfully",
//       data: savedLayers
//     });

//   } catch (error) {
//     console.error("Error saving layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };

// =====================================================================

// ✅ UPDATE LAYERS WITH IMAGE HANDLING
// export const updateLayers = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { layers } = req.body;

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "productId is required"
//       });
//     }

//     if (!Array.isArray(layers)) {
//       return res.status(400).json({
//         success: false,
//         message: "layers array is required"
//       });
//     }

//     // Handle file upload if exists
//     let uploadedImageUrl = null;
//     let uploadedImagePublicId = null;

//     if (req.file) {
//       const uploadResult = await uploadImageToCloudinary(req.file.path);
//       uploadedImageUrl = uploadResult.url;
//       uploadedImagePublicId = uploadResult.public_id;
//     }

//     const results = {
//       created: 0,
//       updated: 0,
//       deleted: 0,
//       failed: 0,
//       layers: []
//     };

//     // Get existing layers
//     const existingLayers = await Layer.find({ productId });
//     const existingLayerIds = existingLayers.map(layer => layer.id);
//     const incomingLayerIds = layers.map(layer => layer.id).filter(id => id);

//     // Delete layers not in incoming array
//     const idsToDelete = existingLayerIds.filter(id => !incomingLayerIds.includes(id));

//     if (idsToDelete.length > 0) {
//       // Delete associated images from Cloudinary
//       const layersToDelete = existingLayers.filter(layer =>
//         idsToDelete.includes(layer.id)
//       );

//       for (const layer of layersToDelete) {
//         if (layer.imagePublicId) {
//           await deleteImageFromCloudinary(layer.imagePublicId);
//         }
//       }

//       await Layer.deleteMany({ productId, id: { $in: idsToDelete } });
//       results.deleted = idsToDelete.length;
//     }

//     // Process each incoming layer
//     for (const layer of layers) {
//       try {
//         layer.productId = productId;
//         layer.updatedAt = new Date();

//         // Handle printarea image
//         if (layer.type === "printarea" && layer.hasImage) {
//           const existingLayer = existingLayers.find(l => l.id === layer.id);

//           // If new image uploaded
//           if (uploadedImageUrl) {
//             // Delete old image if exists
//             if (existingLayer && existingLayer.imagePublicId) {
//               await deleteImageFromCloudinary(existingLayer.imagePublicId);
//             }

//             layer.imageSrc = uploadedImageUrl;
//             layer.imagePublicId = uploadedImagePublicId;
//           }
//           // If using existing image
//           else if (existingLayer && existingLayer.imageSrc && !layer.imageSrc) {
//             layer.imageSrc = existingLayer.imageSrc;
//             layer.imagePublicId = existingLayer.imagePublicId;
//           }
//         }

//         // Upsert operation
//         const existing = await Layer.findOne({ productId, id: layer.id });

//         if (existing) {
//           const updated = await Layer.findOneAndUpdate(
//             { productId, id: layer.id },
//             { $set: layer },
//             { new: true, runValidators: true }
//           );
//           results.layers.push(updated);
//           results.updated++;
//         } else {
//           if (!layer.createdAt) layer.createdAt = new Date();
//           const created = await Layer.create(layer);
//           results.layers.push(created);
//           results.created++;
//         }
//       } catch (error) {
//         console.error(`Error processing layer ${layer.id}:`, error);
//         results.failed++;
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Layers updated successfully",
//       data: results.layers,
//       summary: results
//     });

//   } catch (error) {
//     console.error("Error updating layers:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message
//     });
//   }
// };


// ===========================================================================





export const updateLayers = async (req, res) => {
  try {
    console.log("=== UPDATE LAYERS REQUEST ===");
    const { productId } = req.params;
    const { layers, layerIds } = req.body;
    const files = req.files || [];

    console.log("Product ID:", productId);
    console.log("Files received:", files.length);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    // Parse layers
    let layersArray = [];
    try {
      layersArray = JSON.parse(layers);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid layers JSON format"
      });
    }

    if (!Array.isArray(layersArray)) {
      return res.status(400).json({
        success: false,
        message: "layers must be an array"
      });
    }

    // Parse layerIds
    let layerIdsArray = [];
    try {
      if (layerIds) {
        layerIdsArray = JSON.parse(layerIds);
        if (!Array.isArray(layerIdsArray)) {
          layerIdsArray = [layerIdsArray];
        }
      }
    } catch (e) {
      console.log("Error parsing layerIds:", e);
      layerIdsArray = [];
    }

    // Create file mapping
    const fileMap = {};
    for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
      const layerId = layerIdsArray[i];
      fileMap[layerId] = files[i];
      console.log(`Mapped file to layer ${layerId}`);
    }

    const savedLayers = [];

    // Delete all existing layers and create new ones (simpler approach)
    await Layer.deleteMany({ productId });

    for (const layer of layersArray) {
      try {
        layer.productId = productId;

        // Handle printarea image
        if (layer.type === "printarea" && layer.hasImage) {
          const file = fileMap[layer.id];

          if (file) {
            try {
              const uploadResult = await cloudinary.uploader.upload(file.path, {
                folder: "printareas",
                resource_type: "image"
              });

              layer.imageSrc = uploadResult.secure_url;
              layer.imagePublicId = uploadResult.public_id;
              layer.hasImage = true;

              // Clean up
              if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
              }

            } catch (uploadError) {
              console.error("Cloudinary upload error:", uploadError);
              layer.imageSrc = null;
              layer.hasImage = false;
            }
          } else if (layer.imageSrc === "UPLOADING") {
            layer.imageSrc = null;
            layer.hasImage = false;
          }
        }

        // Save new layer
        const created = await Layer.create(layer);
        savedLayers.push(created);

      } catch (layerError) {
        console.error(`Error processing layer:`, layerError);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Layers updated successfully",
      data: savedLayers
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



// ✅ GET LAYERS BY PRODUCT ID
export const getLayersByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required"
      });
    }

    const layers = await Layer.find({ productId }).sort({ createdAt: 1 });

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
