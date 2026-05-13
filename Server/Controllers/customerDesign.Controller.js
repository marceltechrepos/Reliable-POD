import CustomerDesign from "../Models/CustomerDesign.js"
import cloudinary from "../Utils/Cloudinary.Config.js";

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Upload to cloudinary (or your storage)
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'customer_designs',
        });

        res.json({
            success: true,
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const uploadFinalImage = async (req, res) => {
    try {
        const { designId } = req.params;
        const userId = req.user._id;

        // Find design owned by this user
        const design = await CustomerDesign.findOne({ _id: designId, user: userId });
        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        // Delete existing final image if present
        if (design.finalDesignPublicId) {
            try {
                await cloudinary.uploader.destroy(design.finalDesignPublicId);
            } catch (err) {
                console.warn('Failed to delete old final image:', err);
            }
        }

        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'customer_final_designs',
        });

        design.finalDesignImage = result.secure_url;
        design.finalDesignPublicId = result.public_id;
        await design.save();

        res.json({
            success: true,
            message: 'Final image uploaded',
            data: { imageUrl: result.secure_url }
        });
    } catch (error) {
        console.error('uploadFinalImage error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Controllers/customerDesign.Controller.js

// const saveDesign = async (req, res) => {
//     try {
//         const { productId, mockupId , forceNew  } = req.body;
//         let { layers } = req.body;
//         const userId = req.user && req.user._id;



//         // defensive parsing if layers is a string
//         if (typeof layers === 'string') {
//             try { layers = JSON.parse(layers); }
//             catch (e) { return res.status(400).json({ success: false, message: 'Invalid layers JSON' }); }
//         }

//         if (!productId || !mockupId || !Array.isArray(layers)) {
//             return res.status(400).json({ success: false, message: 'Missing or invalid fields' });
//         }

//         // Find existing design
//         let design = await CustomerDesign.findOne({ user: userId, product: productId, mockup: mockupId });

//         if (design) {
//             // Update
//             design.layers = layers;
//             await design.save();
//         } else {
//             // Create new
//             design = new CustomerDesign({
//                 user: userId,
//                 product: productId,
//                 mockup: mockupId,
//                 layers
//             });
//             await design.save();
//         }

//         res.json({ success: true, data: design });
//     } catch (error) {
//         console.error(error);
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ success: false, message: error.message });
//         }
//         if (error.code === 11000) {
//             return res.status(409).json({ success: false, message: 'Duplicate design exists' });
//         }
//         res.status(500).json({ success: false, message: error.message });
//     }
// }

const saveDesign = async (req, res) => {
    try {
        const { productId, mockupId, forceNew } = req.body;
        let { layers } = req.body;
        const userId = req.user && req.user._id;

        if (typeof layers === 'string') {
            try { layers = JSON.parse(layers); }
            catch (e) { return res.status(400).json({ success: false, message: 'Invalid layers JSON' }); }
        }

        if (!productId || !mockupId || !Array.isArray(layers)) {
            return res.status(400).json({ success: false, message: 'Missing or invalid fields' });
        }

        let design;

        if (forceNew) {
            const lastDesign = await CustomerDesign
                .findOne({ user: userId, product: productId, mockup: mockupId })
                .sort({ version: -1 });

            const newVersion = lastDesign ? lastDesign.version + 1 : 1;
            design = new CustomerDesign({
                user: userId,
                product: productId,
                mockup: mockupId,
                layers,
                canvasWidth: 100,
                canvasHeight: 100,
                finalDesignImage: [],
                finalDesignImages: [],
                version: newVersion, 
                createdAt: new Date(), // already there, but helps differentiate
            });
            await design.save();
        } else {
            // Existing logic — find and update, or create
            design = await CustomerDesign.findOne({
                user: userId,
                product: productId,
                mockup: mockupId
            });

            if (design) {
                design.layers = layers;
                await design.save();
            } else {
                design = new CustomerDesign({
                    user: userId,
                    product: productId,
                    mockup: mockupId,
                    layers,
                    canvasWidth: 100,
                    canvasHeight: 100,
                });
                await design.save();
            }
        }

        res.json({ success: true, data: design });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Duplicate design exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateLayer = async (req, res) => {
    try {
        const { layerId } = req.params;
        const userId = req.user._id;
        const updates = req.body;

        const design = await CustomerDesign.findOne({
            user: userId,
            "layers._id": layerId
        });

        if (!design) {
            return res.status(404).json({
                success: false,
                message: "Layer not found"
            });
        }

        const layer = design.layers.id(layerId);

        if (!layer) {
            return res.status(404).json({
                success: false,
                message: "Layer not found"
            });
        }

        // Allowed fields update
        const allowedFields = [
            "positionX",
            "positionY",
            "width",
            "height",
            "rotation",
            "opacity",
            "visible",
            "locked",
            "horizontalAlign",
            "verticalAlign",
            "zIndex",
            // Text properties
            "text",
            "fontSize",
            "fontFamily",
            "fontWeight",
            "fontStyle",
            "fill",
            "align",
            "lineHeight",
            "textDecoration",
            "letterSpacing",
            "wrapMode"
        ];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                layer[field] = updates[field];
            }
        });

        await design.save();

        res.json({
            success: true,
            message: "Layer updated",
            data: layer
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getDesign = async (req, res) => {
    try {
        const { productId } = req.params;
        const { mockupId } = req.query;

        // ✅ req.user available hoga because isLogin middleware ne set kiya
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Please login"
            });
        }

        const userId = req.user._id;

        const query = {
            user: userId,
            product: productId
        };

        if (mockupId) {
            query.mockup = mockupId;
        }

        const design = await CustomerDesign.findOne(query).populate('layers.printArea');

        res.json({
            success: true,
            data: design || null
        });

    } catch (error) {
        console.error("getDesign error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteLayer = async (req, res) => {
    try {
        const { layerId } = req.params;
        const userId = req.user._id;

        const design = await CustomerDesign.findOne({
            'layers._id': layerId,
            user: userId
        });

        if (!design) {
            return res.status(404).json({
                success: false,
                message: 'Layer not found'
            });
        }

        const layer = design.layers.id(layerId);

        if (layer?.publicId) {
            // delete from cloudinary
            await cloudinary.uploader.destroy(layer.publicId);
        }

        // ✅ new
        design.layers.pull({ _id: layerId });

        await design.save();

        res.json({
            success: true,
            message: 'Layer deleted'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getcustomerDesignByuserId = async (req, res) => {
    try {
        const { userId } = req.params;

        const design = await CustomerDesign.find({ user: userId }).populate("user").populate("product").populate("mockup")

        if (!design.length) {
            return res.status(404).json({ success: false, message: "No Design Found" })
        }

        return res.status(200).json({ success: true, data: design })

    } catch (error) {
        console.log(error, "<<<< error")
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// customDesign.controller.js mein add karo

const getCustomerDesignById = async (req, res) => {
  try {
    const { designId } = req.params;

    if (!designId) {
      return res.status(400).json({
        success: false,
        message: "Design ID is required",
      });
    }

    const design = await CustomerDesign.findById(designId)
      .populate("product")
      .populate("mockup");

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: design,
    });
  } catch (error) {
    console.error("getCustomerDesignById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =================================================

// ✅ NEW: Upload image for a specific mockup
const uploadMockupImage = async (req, res) => {
    try {
        const { designId } = req.params;
        const { mockupId } = req.body;
        const userId = req.user._id;

        // Find design owned by this user
        const design = await CustomerDesign.findOne({ _id: designId, user: userId });
        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file provided' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'customer_final_designs',
        });

        // Delete temporary file after upload (optional)
        // fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            data: {
                imageUrl: result.secure_url,
                publicId: result.public_id,
                mockupId: mockupId
            }
        });
    } catch (error) {
        console.error('uploadMockupImage error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ NEW: Update design with all mockup images array
const updateMockupImages = async (req, res) => {
    try {
        const { designId } = req.params;
        const { finalDesignImages } = req.body;
        const userId = req.user._id;

        // Find design owned by this user
        const design = await CustomerDesign.findOne({ _id: designId, user: userId });
        if (!design) {
            return res.status(404).json({ success: false, message: 'Design not found' });
        }

        // Update with new images array
        design.finalDesignImages = finalDesignImages;

        // Also keep first image as main for backward compatibility
        if (finalDesignImages && finalDesignImages.length > 0) {
            design.finalDesignImage = finalDesignImages[0].imageUrl;
        }

        await design.save();

        res.json({
            success: true,
            message: 'Mockup images updated successfully',
            data: {
                finalDesignImages: design.finalDesignImages,
                finalDesignImage: design.finalDesignImage
            }
        });
    } catch (error) {
        console.error('updateMockupImages error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    uploadImage,
    saveDesign,
    getDesign,
    deleteLayer,
    updateLayer,
    getcustomerDesignByuserId,
    uploadFinalImage,
    uploadMockupImage,
    updateMockupImages,
    getCustomerDesignById
}