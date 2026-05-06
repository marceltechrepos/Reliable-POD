import CustomProduct from "../Models/CustomProduct.js";
import mongoose from "mongoose";
import Store from "../Models/Stores.Model.js"


const createCustomProduct = async (req, res) => {
  try {
    const userId = req.user?._id;
    const {
      productId,
      selectedDefaultVariants = [],
      customVariants = [],
      customVariant = {},
      customerDesignId = null,
      selectedMockup = null,
      variantPrices = {},
      customerLayers = [],
    } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
      });
    }

    // ✅ Process customVariants array
    const normalizedCustomVariants = customVariants.map(variant => ({
      enabled: Boolean(variant.enabled || variant.imageUrl),
      imageUrl: variant.imageUrl || "",
      publicId: variant.publicId || "",
      fileName: variant.fileName || "",
      name: variant.name || customVariant.name || "",
      description: variant.description || customVariant.description || "",
      tags: variant.tags?.length
        ? variant.tags
        : (customVariant.tags || []),
    }));

    // Normalize customVariant for backward compatibility
    const normalizedCustomVariant = {
      enabled: Boolean(customVariant.enabled || customVariant.imageUrl),
      imageUrl: customVariant.imageUrl || "",
      publicId: customVariant.publicId || "",
      name: customVariant.name || "",
      description: customVariant.description || "",
      tags: Array.isArray(customVariant.tags)
        ? customVariant.tags
        : String(customVariant.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    };

    const customProduct = new CustomProduct({
      user: userId,
      baseProduct: productId,
      selectedDefaultVariants,
      customVariant: normalizedCustomVariant,
      customVariants: normalizedCustomVariants,
      customerDesign: customerDesignId,
      selectedMockup,
      customerLayers,
      variantPrices: Object.entries(variantPrices).map(([variantId, price]) => ({
        variantId,
        price: parseFloat(price) || 0,
      })),
    });

    await customProduct.save();

    return res.status(201).json({
      success: true,
      message: "Custom product created successfully",
      data: customProduct,
    });
  } catch (error) {
    console.error("createCustomProduct error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate custom product",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all custom products for a user
const getCustomProducts = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filter by baseProduct if provided
    const filter = { user: userId };
    if (req.query.productId) {
      filter.baseProduct = req.query.productId;
    }

    if (req.query.storeId) {
      filter.storeId = req.query.storeId;
    }
    if (req.query.imported !== undefined) {
      filter.importedToShopify = req.query.imported === 'true';
    }

    // Get custom products with populated references
    const customProducts = await CustomProduct.find(filter)
      .populate("baseProduct", "name images price")
      .populate("customerDesign", "name thumbnailUrl")
      .populate("selectedMockup", "imageUrl name")
      .populate("customerLayers.printArea", "name type")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await CustomProduct.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: customProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("getCustomProducts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single custom product by ID
const getCustomProductById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid custom product ID is required",
      });
    }

    const customProduct = await CustomProduct.findOne({
      _id: id,
      user: userId,
    })
      .populate("baseProduct")
      .populate("customerDesign")
      .populate("selectedMockup")
      .populate("customerLayers.printArea");

    if (!customProduct) {
      return res.status(404).json({
        success: false,
        message: "Custom product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: customProduct,
    });
  } catch (error) {
    console.error("getCustomProductById error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Custom Product by User id
const getCustomProductByUserId = async (req, res) => {

  const { userId } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ success: false, message: "Bad Request" });
    }


    const customProductsByUserId = await CustomProduct.find({ user: userId, deleted: false })
      .populate("baseProduct")
      .populate("customerDesign")
      .populate("selectedMockup")
      .populate("customerLayers.printArea");

    if (!customProductsByUserId.length) {
      return res.status(404).json({
        success: false,
        message: "No custom products found"
      });
    }

    return res.status(200).json({
      success: true,
      data: customProductsByUserId
    })
  } catch (error) {
    console.error("getCustomProductByUserId error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update custom product
const updateCustomProduct = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid custom product ID is required",
      });
    }

    // Check if custom product exists and belongs to user
    const existingProduct = await CustomProduct.findOne({
      _id: id,
      user: userId,
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Custom product not found or you don't have permission to update it",
      });
    }

    // Prepare update object with allowed fields
    const allowedUpdates = {
      selectedDefaultVariants: updateData.selectedDefaultVariants,
      customVariants: updateData.customVariants,
      customVariant: updateData.customVariant,
      customerDesign: updateData.customerDesignId,
      selectedMockup: updateData.selectedMockup,
      customerLayers: updateData.customerLayers,
      variantPrices: updateData.variantPrices,
    };

    if (updateData.variantPrices && typeof updateData.variantPrices === 'object' && !Array.isArray(updateData.variantPrices)) {
      allowedUpdates.variantPrices = Object.entries(updateData.variantPrices).map(([variantId, price]) => ({
        variantId,
        price: parseFloat(price) || 0,
      }));
    }
    // Remove undefined fields
    Object.keys(allowedUpdates).forEach(key => {
      if (allowedUpdates[key] === undefined) {
        delete allowedUpdates[key];
      }
    });

    // Normalize customVariants if provided
    if (updateData.customVariants) {
      allowedUpdates.customVariants = updateData.customVariants.map(variant => ({
        enabled: Boolean(variant.enabled || variant.imageUrl),
        imageUrl: variant.imageUrl || "",
        publicId: variant.publicId || "",
        fileName: variant.fileName || "",
        name: variant.name || "",
        description: variant.description || "",
        tags: Array.isArray(variant.tags)
          ? variant.tags
          : String(variant.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      }));
    }


    // Normalize customVariant if provided
    if (updateData.customVariant) {
      allowedUpdates.customVariant = {
        enabled: Boolean(updateData.customVariant.enabled || updateData.customVariant.imageUrl),
        imageUrl: updateData.customVariant.imageUrl || "",
        publicId: updateData.customVariant.publicId || "",
        name: updateData.customVariant.name || "",
        description: updateData.customVariant.description || "",
        tags: Array.isArray(updateData.customVariant.tags)
          ? updateData.customVariant.tags
          : String(updateData.customVariant.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      };
    }

    // Update the custom product
    const updatedProduct = await CustomProduct.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    )
      .populate("baseProduct")
      .populate("customerDesign")
      .populate("selectedMockup")
      .populate("customerLayers.printArea");

    return res.status(200).json({
      success: true,
      message: "Custom product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("updateCustomProduct error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete custom product
// const deleteCustomProduct = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const { id } = req.params;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid custom product ID is required",
//       });
//     }

//     // Check if custom product exists and belongs to user
//     const customProduct = await CustomProduct.findOne({
//       _id: id,
//       user: userId,
//     });

//     if (!customProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Custom product not found or you don't have permission to delete it",
//       });
//     }

//     await CustomProduct.deleteOne({ _id: id, user: userId });

//     return res.status(200).json({
//       success: true,
//       message: "Custom product deleted successfully",
//     });
//   } catch (error) {
//     console.error("deleteCustomProduct error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// ============== SOFT DELETE (instead of hard delete) ==============
const deleteCustomProduct = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid custom product ID is required",
      });
    }

    // Find product and set deleted flag to true
    const updatedProduct = await CustomProduct.findOneAndUpdate(
      { _id: id, user: userId, deleted: false },  // only if not already deleted
      { $set: { deleted: true } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Custom product not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted (soft delete)",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("deleteCustomProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Bulk delete custom products
const bulkDeleteCustomProducts = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { ids } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Valid array of custom product IDs is required",
      });
    }

    // Validate all IDs are valid ObjectIds
    const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid custom product IDs provided",
        invalidIds,
      });
    }

    const result = await CustomProduct.updateMany(
      { _id: { $in: ids }, user: userId, deleted: false },
      { $set: { deleted: true } }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} product(s) soft deleted`,
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("bulkDeleteCustomProducts error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const importProductsToShopify = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { productIds, storeId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: "Product IDs required" });
    }
    if (!storeId) {
      return res.status(400).json({ success: false, message: "Store ID required" });
    }

    // Verify store belongs to user
    const store = await Store.findOne({ _id: storeId, userId, isActive: true });
    if (!store) {
      return res.status(404).json({ success: false, message: "Store not found or not owned by user" });
    }

    // Update each product
    const updateResult = await CustomProduct.updateMany(
      { _id: { $in: productIds }, user: userId },
      { $set: { importedToShopify: true, storeId: storeId } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "No valid products found" });
    }

    // Fetch updated products
    const updatedProducts = await CustomProduct.find({ _id: { $in: productIds } })
      .populate("baseProduct")
      .populate("selectedMockup");

    return res.status(200).json({
      success: true,
      message: `${updateResult.modifiedCount} products imported to Shopify`,
      data: updatedProducts
    });
  } catch (error) {
    console.error("importProductsToShopify error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// Get imported products by store ID
const getImportedProductsByStore = async (req, res) => {
  try {
    const { storeId } = req.params;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: "Store ID is required"
      });
    }

    // Find all products with this storeId and importedToShopify = true
    const products = await CustomProduct.find({
      storeId: storeId,
      importedToShopify: true
    })
      .populate("baseProduct")
      .populate("customerDesign")
      // .populate("baseProduct", "productTitle price thumbnail")
      .populate("selectedMockup", "imageUrl name")
      .sort({ createdAt: -1 });

    console.log(`Found ${products.length} imported products for store ${storeId}`);

    return res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      message: "Products fetched successfully"
    });

  } catch (error) {
    console.error("getImportedProductsByStore error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  getCustomProducts,
  getCustomProductById,
  updateCustomProduct,
  deleteCustomProduct,
  bulkDeleteCustomProducts,
  createCustomProduct,
  getCustomProductByUserId,
  importProductsToShopify,
  getImportedProductsByStore
};