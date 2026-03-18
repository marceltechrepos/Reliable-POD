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

// const saveDesign = async (req, res) => {
//     try {
//         const { productId, mockupId, layers } = req.body;
//         const userId = req.user._id; // from auth middleware

//         if (!productId || !mockupId || !layers) {
//             return res.status(400).json({ success: false, message: 'Missing required fields' });
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
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// Controllers/customerDesign.Controller.js

const saveDesign = async (req, res) => {
    try {
        const { productId, mockupId } = req.body;
        let { layers } = req.body;
        const userId = req.user && req.user._id;

        // defensive parsing if layers is a string
        if (typeof layers === 'string') {
            try { layers = JSON.parse(layers); }
            catch (e) { return res.status(400).json({ success: false, message: 'Invalid layers JSON' }); }
        }

        if (!productId || !mockupId || !Array.isArray(layers)) {
            return res.status(400).json({ success: false, message: 'Missing or invalid fields' });
        }

        // Find existing design
        let design = await CustomerDesign.findOne({ user: userId, product: productId, mockup: mockupId });

        if (design) {
            // Update
            design.layers = layers;
            await design.save();
        } else {
            // Create new
            design = new CustomerDesign({
                user: userId,
                product: productId,
                mockup: mockupId,
                layers
            });
            await design.save();
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
}

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
            "zIndex"
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

export {
    uploadImage,
    saveDesign,
    getDesign,
    deleteLayer,
    updateLayer,
    getcustomerDesignByuserId
}