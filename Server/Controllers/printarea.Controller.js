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
// ==================================================================
// export const saveLayers = async (req, res) => {
//   try {
//     console.log("=== SAVE LAYERS REQUEST ===");
//     const { productId, layers, layerIds } = req.body;
//     const files = req.files || [];

//     if (!productId) {
//       return res.status(400).json({ success: false, message: "productId is required" });
//     }

//     // Parse layers JSON
//     let layersArray = [];
//     try {
//       layersArray = JSON.parse(layers);
//     } catch (err) {
//       return res.status(400).json({ success: false, message: "Invalid layers JSON format" });
//     }

//     // Parse layerIds
//     let layerIdsArray = [];
//     try {
//       if (layerIds) {
//         layerIdsArray = JSON.parse(layerIds);
//         if (!Array.isArray(layerIdsArray)) layerIdsArray = [layerIdsArray];
//       }
//     } catch {
//       layerIdsArray = [];
//     }

//     // Remove old layers
//     await Layer.deleteMany({ productId });

//     // Map files to layers
//     const fileMap = {};
//     for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
//       fileMap[layerIdsArray[i]] = files[i];
//     }

//     const savedLayers = [];

//     for (const layer of layersArray) {
//       try {
//         layer.productId = productId;
//         delete layer._id;
//         delete layer.__v;

//         // Check if needs upload
//         const file = fileMap[layer.id];
//         const needsUpload =
//           (layer.type === "printarea" && layer.imageSrc === "UPLOADING") ||
//           ((layer.type === "image" || layer.type === "background") && layer.src === "UPLOADING") ||
//           (file !== undefined); // ensure background/image file triggers upload

//         // Check if already uploaded
//         const existingCloud =
//           (layer.type === "printarea" && layer.imageSrc?.startsWith("http")) ||
//           ((layer.type === "image" || layer.type === "background") && layer.src?.startsWith("http"));

//         // Determine folder
//         let folder = "mockups";
//         if (layer.type === "printarea") folder = "printareas";
//         if (layer.type === "image") folder = "image_layers";
//         if (layer.type === "background") folder = "backgrounds";

//         // UPLOAD LOGIC
//         if (needsUpload) {
//           if (file) {
//             try {
//               const result = await cloudinary.uploader.upload(file.path, {
//                 folder,
//                 resource_type: "image"
//               });

//               if (layer.type === "printarea") {
//                 layer.imageSrc = result.secure_url;
//                 layer.imagePublicId = result.public_id;
//                 layer.hasImage = true;
//               } else {
//                 layer.src = result.secure_url;
//                 layer.imagePublicId = result.public_id;
//                 layer.hasImage = true; // important for background
//               }

//               fs.existsSync(file.path) && fs.unlinkSync(file.path);

//             } catch {
//               if (layer.type === "printarea") {
//                 layer.imageSrc = null;
//                 layer.hasImage = false;
//               } else {
//                 layer.src = null;
//                 layer.hasImage = false;
//               }
//             }
//           } else if (layer.type === "background") {
//             // If file missing, preserve existing src
//             layer.src = layer.src === "UPLOADING" ? null : layer.src;
//             layer.hasImage = !!layer.src;
//           } else {
//             layer.type === "printarea" ? (layer.imageSrc = null) : (layer.src = null);
//           }
//         } else if (existingCloud) {
//           if (layer.type === "printarea") layer.hasImage = true;
//           else layer.hasImage = true;
//         } else {
//           layer.type === "printarea" ? (layer.imageSrc = null) : (layer.src = null);
//         }

//         const created = await Layer.create(layer);
//         savedLayers.push(created);

//       } catch (err) {
//         console.error("Layer save error:", err);
//       }
//     }

//     files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));

//     return res.status(200).json({
//       success: true,
//       message: "Layers saved successfully",
//       data: savedLayers
//     });

//   } catch (err) {
//     console.error("Error saving layers:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: err.message
//     });
//   }
// };

// export const updateLayers = async (req, res) => {
//   try {
//     console.log("=== UPDATE LAYERS REQUEST ===");
//     const { productId } = req.params;
//     const { layers, layerIds } = req.body;
//     const files = req.files || [];

//     if (!productId) {
//       return res.status(400).json({ success: false, message: "productId is required" });
//     }

//     let layersArray = [];
//     try {
//       layersArray = JSON.parse(layers);
//     } catch {
//       return res.status(400).json({ success: false, message: "Invalid layers JSON" });
//     }

//     let layerIdsArray = [];
//     try {
//       if (layerIds) {
//         layerIdsArray = JSON.parse(layerIds);
//         if (!Array.isArray(layerIdsArray)) layerIdsArray = [layerIdsArray];
//       }
//     } catch {
//       layerIdsArray = [];
//     }

//     // Map files
//     const fileMap = {};
//     for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
//       fileMap[layerIdsArray[i]] = files[i];
//     }

//     await Layer.deleteMany({ productId });

//     const savedLayers = [];

//     for (const layer of layersArray) {
//       try {
//         layer.productId = productId;
//         delete layer._id;
//         delete layer.__v;

//         const file = fileMap[layer.id];
//         const needsUpload =
//           (layer.type === "printarea" && layer.imageSrc === "UPLOADING") ||
//           ((layer.type === "image" || layer.type === "background") && layer.src === "UPLOADING") ||
//           (file !== undefined);

//         const existingCloud =
//           (layer.type === "printarea" && layer.imageSrc?.startsWith("http")) ||
//           ((layer.type === "image" || layer.type === "background") && layer.src?.startsWith("http"));

//         let folder = "mockups";
//         if (layer.type === "printarea") folder = "printareas";
//         if (layer.type === "image") folder = "image_layers";
//         if (layer.type === "background") folder = "backgrounds";

//         if (needsUpload) {
//           if (file) {
//             const upload = await cloudinary.uploader.upload(file.path, { folder });
//             if (layer.type === "printarea") {
//               layer.imageSrc = upload.secure_url;
//               layer.hasImage = true;
//             } else {
//               layer.src = upload.secure_url;
//               layer.hasImage = true;
//             }
//             fs.existsSync(file.path) && fs.unlinkSync(file.path);
//           } else if (layer.type === "background") {
//             layer.src = layer.src === "UPLOADING" ? null : layer.src;
//             layer.hasImage = !!layer.src;
//           } else {
//             layer.type === "printarea" ? (layer.imageSrc = null) : (layer.src = null);
//           }
//         } else if (existingCloud) {
//           if (layer.type === "printarea") layer.hasImage = true;
//           else layer.hasImage = true;
//         } else {
//           layer.type === "printarea" ? (layer.imageSrc = null) : (layer.src = null);
//         }

//         const created = await Layer.create(layer);
//         savedLayers.push(created);

//       } catch (err) {
//         console.error("Layer error:", err);
//       }
//     }

//     files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));

//     return res.status(200).json({
//       success: true,
//       message: "Layers updated successfully",
//       data: savedLayers
//     });

//   } catch (err) {
//     console.error("Update error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message
//     });
//   }
// };

// =======================================================================

// ---------- saveLayers ----------
export const saveLayers = async (req, res) => {
  try {
    console.log("=== SAVE LAYERS REQUEST ===");
    const { productId } = req.body;
    // layers and layerIds can be stringified JSON (from multipart) OR already parsed objects (application/json)
    const rawLayers = req.body.layers;
    const rawLayerIds = req.body.layerIds;
    const files = req.files || [];

    if (!productId) {
      return res.status(400).json({ success: false, message: "productId is required" });
    }

    // Parse layers (accept string or array)
    let layersArray = [];
    if (rawLayers === undefined || rawLayers === null) {
      layersArray = [];
    } else if (typeof rawLayers === "string") {
      try {
        layersArray = JSON.parse(rawLayers);
        if (!Array.isArray(layersArray)) throw new Error("not array");
      } catch (e) {
        console.error("Invalid layers JSON (saveLayers):", e);
        return res.status(400).json({ success: false, message: "Invalid layers JSON" });
      }
    } else if (Array.isArray(rawLayers)) {
      layersArray = rawLayers;
    } else {
      console.error("Unsupported layers payload (saveLayers):", typeof rawLayers);
      return res.status(400).json({ success: false, message: "Invalid layers payload" });
    }

    // Parse layerIds (accept string or array)
    let layerIdsArray = [];
    if (rawLayerIds === undefined || rawLayerIds === null) {
      layerIdsArray = [];
    } else if (typeof rawLayerIds === "string") {
      try {
        layerIdsArray = JSON.parse(rawLayerIds);
        if (!Array.isArray(layerIdsArray)) layerIdsArray = [layerIdsArray];
      } catch (e) {
        layerIdsArray = [];
      }
    } else if (Array.isArray(rawLayerIds)) {
      layerIdsArray = rawLayerIds;
    } else {
      layerIdsArray = [];
    }

    // Remove old layers (existing behavior)
    await Layer.deleteMany({ productId });

    // Map files -> layerId by order. Frontend MUST append files in same order as layerIdsArray.
    const fileMap = {};
    for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
      fileMap[layerIdsArray[i]] = files[i];
    }

    const savedLayers = [];

    for (const rawLayer of layersArray) {
      try {
        // clone to be safe
        const layer = { ...rawLayer };
        layer.productId = productId;
        delete layer._id;
        delete layer.__v;

        // File lookup
        const file = fileMap[layer.id];

        // Determine if upload is required:
        // - placeholder "UPLOADING" OR a real file was attached for this layer
        const placeholderPrintarea = layer.type === "printarea" && layer.imageSrc === "UPLOADING";
        const placeholderImageOrBg = (layer.type === "image" || layer.type === "background") && layer.src === "UPLOADING";
        const needsUpload = placeholderPrintarea || placeholderImageOrBg || (file !== undefined);

        // Check if already has cloud URL
        const existingCloud =
          (layer.type === "printarea" && typeof layer.imageSrc === "string" && layer.imageSrc.startsWith("http")) ||
          ((layer.type === "image" || layer.type === "background") && typeof layer.src === "string" && layer.src.startsWith("http"));

        // choose folder
        let folder = "mockups";
        if (layer.type === "printarea") folder = "printareas";
        if (layer.type === "image") folder = "image_layers";
        if (layer.type === "background") folder = "backgrounds";

        // Upload handling
        if (needsUpload) {
          if (file) {
            try {
              const result = await cloudinary.uploader.upload(file.path, {
                folder,
                resource_type: "image",
              });

              if (layer.type === "printarea") {
                layer.imageSrc = result.secure_url;
                layer.imagePublicId = result.public_id;
                layer.hasImage = true;
              } else {
                // image or background
                layer.src = result.secure_url;
                layer.imagePublicId = result.public_id;
                layer.hasImage = true;
              }

              // cleanup
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            } catch (uploadErr) {
              console.error("Cloudinary upload error (saveLayers):", uploadErr);
              if (layer.type === "printarea") {
                layer.imageSrc = null;
                layer.hasImage = false;
              } else {
                layer.src = null;
                layer.hasImage = false;
              }
            }
          } else {
            // no file found for this placeholder
            if (layer.type === "background") {
              // preserve existing src if any, otherwise clear
              if (layer.src === "UPLOADING") {
                layer.src = null;
                layer.hasImage = false;
              } else {
                layer.hasImage = !!layer.src;
              }
            } else if (layer.type === "printarea") {
              layer.imageSrc = layer.imageSrc === "UPLOADING" ? null : layer.imageSrc;
              layer.hasImage = !!layer.imageSrc;
            } else {
              layer.src = layer.src === "UPLOADING" ? null : layer.src;
              layer.hasImage = !!layer.src;
            }
          }
        } else if (existingCloud) {
          // keep existing cloud URL and set hasImage
          if (layer.type === "printarea") layer.hasImage = true;
          else layer.hasImage = true;
        } else {
          // No image at all
          if (layer.type === "printarea") {
            layer.imageSrc = layer.imageSrc && layer.imageSrc.startsWith("http") ? layer.imageSrc : null;
            layer.hasImage = !!layer.imageSrc;
          } else {
            layer.src = layer.src && layer.src.startsWith("http") ? layer.src : null;
            layer.hasImage = !!layer.src;
          }
        }

        const created = await Layer.create(layer);
        savedLayers.push(created);
      } catch (layerErr) {
        console.error("Layer processing error (saveLayers):", layerErr);
        // continue with other layers
      }
    }

    // final cleanup of any leftover temp files
    files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });

    return res.status(200).json({ success: true, message: "Layers saved successfully", data: savedLayers });
  } catch (err) {
    console.error("saveLayers error:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};


// ---------- updateLayers ----------
export const updateLayers = async (req, res) => {
  try {
    console.log("=== UPDATE LAYERS REQUEST ===");
    const { productId } = req.params;
    const rawLayers = req.body.layers;
    const rawLayerIds = req.body.layerIds;
    const files = req.files || [];

    if (!productId) return res.status(400).json({ success: false, message: "productId is required" });

    // Parse layers (string or array)
    let layersArray = [];
    if (rawLayers === undefined || rawLayers === null) {
      layersArray = [];
    } else if (typeof rawLayers === "string") {
      try {
        layersArray = JSON.parse(rawLayers);
        if (!Array.isArray(layersArray)) throw new Error("not array");
      } catch (e) {
        console.error("Invalid layers JSON (updateLayers):", e);
        return res.status(400).json({ success: false, message: "Invalid layers JSON" });
      }
    } else if (Array.isArray(rawLayers)) {
      layersArray = rawLayers;
    } else {
      return res.status(400).json({ success: false, message: "Invalid layers payload" });
    }

    // Parse layerIds (string or array)
    let layerIdsArray = [];
    if (rawLayerIds === undefined || rawLayerIds === null) {
      layerIdsArray = [];
    } else if (typeof rawLayerIds === "string") {
      try {
        layerIdsArray = JSON.parse(rawLayerIds);
        if (!Array.isArray(layerIdsArray)) layerIdsArray = [layerIdsArray];
      } catch {
        layerIdsArray = [];
      }
    } else if (Array.isArray(rawLayerIds)) {
      layerIdsArray = rawLayerIds;
    } else {
      layerIdsArray = [];
    }

    // Map files -> ids
    const fileMap = {};
    for (let i = 0; i < files.length && i < layerIdsArray.length; i++) {
      fileMap[layerIdsArray[i]] = files[i];
    }

    // If you want to preserve existing layers and update in-place
    // we will delete old layers and recreate (same as before)
    await Layer.deleteMany({ productId });

    const savedLayers = [];

    for (const rawLayer of layersArray) {
      try {
        const layer = { ...rawLayer };
        layer.productId = productId;
        delete layer._id;
        delete layer.__v;

        const file = fileMap[layer.id];

        const placeholderPrintarea = layer.type === "printarea" && layer.imageSrc === "UPLOADING";
        const placeholderImageOrBg = (layer.type === "image" || layer.type === "background") && layer.src === "UPLOADING";
        const needsUpload = placeholderPrintarea || placeholderImageOrBg || (file !== undefined);

        const existingCloud =
          (layer.type === "printarea" && typeof layer.imageSrc === "string" && layer.imageSrc.startsWith("http")) ||
          ((layer.type === "image" || layer.type === "background") && typeof layer.src === "string" && layer.src.startsWith("http"));

        let folder = "mockups";
        if (layer.type === "printarea") folder = "printareas";
        if (layer.type === "image") folder = "image_layers";
        if (layer.type === "background") folder = "backgrounds";

        if (needsUpload) {
          if (file) {
            try {
              const upload = await cloudinary.uploader.upload(file.path, { folder });
              if (layer.type === "printarea") {
                layer.imageSrc = upload.secure_url;
                layer.hasImage = true;
              } else {
                layer.src = upload.secure_url;
                layer.hasImage = true;
              }
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            } catch (uErr) {
              console.error("Cloudinary upload error (updateLayers):", uErr);
              if (layer.type === "printarea") { layer.imageSrc = null; layer.hasImage = false; }
              else { layer.src = null; layer.hasImage = false; }
            }
          } else {
            // no file provided for placeholder
            if (layer.type === "background") {
              layer.src = layer.src === "UPLOADING" ? null : layer.src;
              layer.hasImage = !!layer.src;
            } else if (layer.type === "printarea") {
              layer.imageSrc = layer.imageSrc === "UPLOADING" ? null : layer.imageSrc;
              layer.hasImage = !!layer.imageSrc;
            } else {
              layer.src = layer.src === "UPLOADING" ? null : layer.src;
              layer.hasImage = !!layer.src;
            }
          }
        } else if (existingCloud) {
          layer.hasImage = true;
        } else {
          if (layer.type === "printarea") { layer.imageSrc = layer.imageSrc?.startsWith("http") ? layer.imageSrc : null; layer.hasImage = !!layer.imageSrc; }
          else { layer.src = layer.src?.startsWith("http") ? layer.src : null; layer.hasImage = !!layer.src; }
        }

        const created = await Layer.create(layer);
        savedLayers.push(created);
      } catch (lErr) {
        console.error("Layer error (updateLayers):", lErr);
      }
    }

    // cleanup
    files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });

    return res.status(200).json({ success: true, message: "Layers updated successfully", data: savedLayers });
  } catch (err) {
    console.error("updateLayers error:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
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
