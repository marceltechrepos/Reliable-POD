import productModel from "../Models/product.model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import Category from "../Models/Categories.Model.js";

import mongoose from "mongoose";


export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("category").populate("fulfilmentProvider");
    res.status(200).json({ success: true, data: products, status: 200 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const product = await productModel.findById(id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let populatedMockups = [];

    if (product.mockupIds && product.mockupIds.length > 0) {

      const mockups = await mongoose
        .model("MockupImage")
        .find({ _id: { $in: product.mockupIds } })
        .lean();

      // 🔥 ORDER FIX
      populatedMockups = product.mockupIds
        .map(id => mockups.find(m => String(m._id) === String(id)))
        .filter(Boolean);
    }

    const category = await Category.findById(product.category)
      .populate({ path: "parent", select: "name slug" })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...product,
        category: category || null,
        mockupIds: populatedMockups, // ✅ ordered correctly
      },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const getProductsById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ success: false, message: "Product ID is required" });
//     }

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid Product ID" });
//     }

//     // Fetch product
//     const product = await productModel.findById(id).lean();

//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     // 🔥 NEW: Fetch mockups separately and populate them
//     let populatedMockups = [];
//     if (product.mockupIds && product.mockupIds.length > 0) {
//       populatedMockups = await mongoose
//         .model("MockupImage")
//         .find({ _id: { $in: product.mockupIds } })
//         .lean();
//     }

//     // Fetch category and its parent (same as your logic)
//     const category = await Category.findById(product.category)
//       .populate({ path: "parent", select: "name slug" })
//       .lean();

//     res.status(200).json({
//       success: true,
//       data: {
//         ...product,
//         category: category || null,
//         mockupIds: populatedMockups, // 🔥 overwrite ids with full objects
//       },
//       status: 200,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const getProductsByCategoryId = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    // 🔥 Populate category and fulfilmentProvider
    const products = await productModel.find({ category: categoryId })
      .populate("category")
      .populate("fulfilmentProvider");

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error("getProductsByCategoryId error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (!productData) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide product details",
      });
    }

    // Only validate basic fields (no Printareas/Variants required initially)
    const productValidations = [
      {
        field: "productTitle",
        required: true,
        errorMessage: "Please provide a product title",
      },
      {
        field: "fulfilmentProvider",
        required: true,
        errorMessage: "Please provide a fulfilment provider",
      },
      {
        field: "fulfilmentCatalogID",
        required: true,
        errorMessage: "Please provide a fulfilment catalog ID",
      },
      {
        field: "description",
        required: true,
        errorMessage: "Please provide a product description",
      },
      {
        field: "category",
        required: true,
        errorMessage: "Please provide a category",
      },
    ];

    for (const validation of productValidations) {
      const value = productData[validation.field];
      if (validation.required && !value) {
        return res.status(400).json({
          message: validation.errorMessage,
          status: 400,
          field: validation.field,
          success: false,
        });
      }
    }

    // Create product with empty Printareas and Variants arrays
    const newProduct = new productModel({
      ...productData,
      thumbnail: null,
      mockupId: null,
      Printareas: [], // Empty initially
      Variants: [], // Empty initially
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      data: newProduct,
      status: 201,
      message: "Product created successfully. Now you can add print areas.",
    });
  } catch (error) {
    console.error("Error creating product:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Duplicate entry found.",
        status: 409,
        success: false,
        error: error.keyValue,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const createMockup = async (req, res) => {
  try {
    const { productId } = req.query;
    const { mockupImage } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", status: 404, success: false });
    }
    product.mockupImage = mockupImage;
    await product.save();
    return res.status(200).json({ message: "Mockup created successfully", status: 200, success: true });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message || "Internal server error", status: 500, success: false })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const thumbnail = req.file;
    const mockupId = req.body.mockupId;

    // Check if product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Product not found",
      });
    }

    // If thumbnail is provided, upload to Cloudinary
    console.log({ thumbnail })
    if (thumbnail) {
      const uploadResult = await cloudinary.uploader.upload(
        thumbnail.path,
        {
          folder: "products/thumbnails",
        }
      );

      updateData.thumbnail = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Update product
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        $set: updateData,
      },
      { new: true, runValidators: true }
    ).populate("mockupIds");

    res.status(200).json({
      success: true,
      status: 200,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      success: false,
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

export const addPrintArea = async (req, res) => {
  try {
    const { productId } = req.params;
    const printAreaData = req.body;

    if (!productId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID is required",
      });
    }

    if (!printAreaData) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide print area data",
      });
    }

    // Validate print area data
    const printAreaValidations = [
      {
        field: "displayName",
        required: true,
        errorMessage: "Display name is required",
      },
      { field: "width", required: true, errorMessage: "Width is required" },
      { field: "height", required: true, errorMessage: "Height is required" },
    ];

    for (const validation of printAreaValidations) {
      const value = printAreaData[validation.field];
      if (validation.required && !value) {
        return res.status(400).json({
          message: validation.errorMessage,
          status: 400,
          field: validation.field,
          success: false,
        });
      }
    }

    // Convert width and height to numbers
    if (printAreaData.width) printAreaData.width = Number(printAreaData.width);
    if (printAreaData.height)
      printAreaData.height = Number(printAreaData.height);

    // Find product and add print area
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Add the new print area to the array
    product.Printareas.push(printAreaData);

    await product.save();

    res.status(200).json({
      success: true,
      data: product.Printareas[product.Printareas.length - 1], // Return the newly added print area
      status: 200,
      message: "Print area added successfully",
      totalPrintAreas: product.Printareas.length,
    });
  } catch (error) {
    console.error("Error adding print area:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const updatePrintArea = async (req, res) => {
  try {
    const { productId, printAreaId } = req.params;
    const updateData = req.body;

    if (!productId || !printAreaId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID and Print Area ID are required",
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide data to update",
      });
    }

    // Find the product
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Find the print area index in the array
    const printAreaIndex = product.Printareas.findIndex(
      (printArea) => printArea._id.toString() === printAreaId
    );

    if (printAreaIndex === -1) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Print area not found",
      });
    }

    // Get the current print area
    const currentPrintArea = product.Printareas[printAreaIndex];

    // Check if fulfilledKey is being updated and if it already exists (excluding current print area)
    if (
      updateData.fulfiledKey &&
      updateData.fulfiledKey !== currentPrintArea.fulfiledKey
    ) {
      const keyExists = product.Printareas.some(
        (printArea, index) =>
          index !== printAreaIndex &&
          printArea.fulfiledKey === updateData.fulfiledKey
      );

      if (keyExists) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Fulfilled key already exists for another print area",
          field: "fulfiledKey",
        });
      }
    }

    // Convert numeric fields if provided
    if (updateData.width !== undefined) {
      updateData.width = Number(updateData.width);
      if (isNaN(updateData.width)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Width must be a valid number",
          field: "width",
        });
      }
    }

    if (updateData.height !== undefined) {
      updateData.height = Number(updateData.height);
      if (isNaN(updateData.height)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Height must be a valid number",
          field: "height",
        });
      }
    }

    // Validate required fields if they're being updated
    const validationRules = [
      { field: "displayName", errorMessage: "Display name is required" },
      { field: "width", errorMessage: "Width is required" },
      { field: "height", errorMessage: "Height is required" },
    ];

    for (const rule of validationRules) {
      if (
        updateData[rule.field] !== undefined &&
        !updateData[rule.field] &&
        updateData[rule.field] !== 0
      ) {
        return res.status(400).json({
          message: rule.errorMessage,
          status: 400,
          field: rule.field,
          success: false,
        });
      }
    }

    // Update the print area
    product.Printareas[printAreaIndex] = {
      ...currentPrintArea.toObject(),
      ...updateData,
      updatedAt: new Date(), // Add updated timestamp
    };

    await product.save();

    res.status(200).json({
      success: true,
      data: product.Printareas[printAreaIndex],
      status: 200,
      message: "Print area updated successfully",
    });
  } catch (error) {
    console.error("Error updating print area:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const getPrintAreas = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId).select("Printareas");

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product.Printareas,
      status: 200,
      count: product.Printareas.length,
    });
  } catch (error) {
    console.error("Error fetching print areas:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const removePrintArea = async (req, res) => {
  try {
    const { productId, printAreaId } = req.params;

    if (!productId || !printAreaId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID and Print Area ID are required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Remove print area from array
    const initialLength = product.Printareas.length;
    product.Printareas = product.Printareas.filter(
      (area) => area._id.toString() !== printAreaId
    );

    if (product.Printareas.length === initialLength) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Print area not found",
      });
    }

    await product.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Print area removed successfully",
      remainingPrintAreas: product.Printareas.length,
    });
  } catch (error) {
    console.error("Error removing print area:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const addVariant = async (req, res) => {
  try {
    const { productId } = req.params;
    const variantData = req.body;

    console.log("Received variant data:", variantData); // 🔥 Debug log

    if (!productId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID is required",
      });
    }

    if (!variantData) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide variant data",
      });
    }

    // Validate required fields
    if (!variantData.sku) {
      return res.status(400).json({
        success: false,
        message: "SKU is required",
      });
    }

    if (!variantData.basePrice && variantData.basePrice !== 0) {
      return res.status(400).json({
        success: false,
        message: "Base Price is required",
      });
    }

    // Convert numeric fields
    if (variantData.basePrice !== undefined) {
      variantData.basePrice = Number(variantData.basePrice);
    }

    if (variantData.weight !== undefined) {
      variantData.weight = Number(variantData.weight);
    }

    if (variantData.comparePrice !== undefined) {
      variantData.comparePrice = Number(variantData.comparePrice);
    }

    // 🔥 IMPORTANT: Ensure customAttributes is an object
    if (!variantData.customAttributes) {
      variantData.customAttributes = {};
    }

    // Add timestamps
    variantData.createdAt = new Date();
    variantData.updatedAt = new Date();

    // Find product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if SKU already exists
    const skuExists = product.Variants.some(
      (variant) => variant.sku === variantData.sku
    );

    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: "SKU already exists for this product",
      });
    }

    // 🔥 Add the new variant to the array
    product.Variants.push(variantData);
    await product.save();

    const newVariant = product.Variants[product.Variants.length - 1];

    console.log("Saved variant:", newVariant); // 🔥 Debug log

    res.status(201).json({
      success: true,
      data: newVariant,
      status: 201,
      message: "Variant added successfully",
      totalVariants: product.Variants.length,
    });
  } catch (error) {
    console.error("Error adding variant:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const updateData = req.body;

    console.log("Updating variant with data:", updateData); // 🔥 Debug log

    if (!productId || !variantId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID and Variant ID are required",
      });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide data to update",
      });
    }

    // Find the product
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Find the variant index
    const variantIndex = product.Variants.findIndex(
      (variant) => variant._id.toString() === variantId
    );

    if (variantIndex === -1) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Variant not found",
      });
    }

    // Get current variant
    const currentVariant = product.Variants[variantIndex];

    // Check SKU uniqueness if being updated
    if (updateData.sku && updateData.sku !== currentVariant.sku) {
      const skuExists = product.Variants.some(
        (variant, index) =>
          index !== variantIndex && variant.sku === updateData.sku
      );
      if (skuExists) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "SKU already exists for another variant",
        });
      }
    }

    // Convert numeric fields
    if (updateData.basePrice !== undefined) {
      updateData.basePrice = Number(updateData.basePrice);
    }
    if (updateData.weight !== undefined) {
      updateData.weight = Number(updateData.weight);
    }
    if (updateData.comparePrice !== undefined) {
      updateData.comparePrice = Number(updateData.comparePrice);
    }

    // 🔥 Handle customAttributes - merge with existing
    if (updateData.customAttributes) {
      updateData.customAttributes = {
        ...currentVariant.customAttributes,
        ...updateData.customAttributes
      };
    }

    // Update the variant
    product.Variants[variantIndex] = {
      ...currentVariant.toObject(),
      ...updateData,
      updatedAt: new Date(),
    };

    await product.save();

    console.log("Updated variant:", product.Variants[variantIndex]); // 🔥 Debug log

    res.status(200).json({
      success: true,
      data: product.Variants[variantIndex],
      status: 200,
      message: "Variant updated successfully",
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const getVariant = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await productModel.findById(productId).select("Variants");

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: product.Variants,
      status: 200,
      count: "asdf",
    });
  } catch (error) {
    console.error("Error fetching variant:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid product ID",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const removeVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;

    if (!productId || !variantId) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Product ID and Print Area ID are required",
      });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Product not found",
      });
    }

    // Remove print area from array
    const initialLength = product.Variants.length;
    product.Variants = product.Variants.filter(
      (area) => area._id.toString() !== variantId
    );

    if (product.Variants.length === initialLength) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Print area not found",
      });
    }

    await product.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Print area removed successfully",
      remainingVariants: product.Variants.length,
    });
  } catch (error) {
    console.error("Error removing print area:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ID format",
        status: 400,
        success: false,
      });
    }

    res.status(500).json({
      message: error.message || "Internal server error",
      status: 500,
      success: false,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: 404, success: false });
    }
    res.status(200).json({ success: true, data: product, status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, status: 500, success: false });
  }
};



// ================= UPDATE THUMBNAIL =================
export const updateProductThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required"
      });
    }

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // 🔥 delete old thumbnail from cloudinary
    if (product.thumbnail?.public_id) {
      await cloudinary.uploader.destroy(product.thumbnail.public_id);
    }

    // upload new thumbnail
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "products/thumbnails"
    });

    fs.unlinkSync(req.file.path);

    product.thumbnail = {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };

    await product.save();

    res.status(200).json({
      success: true,
      message: "Thumbnail updated successfully",
      thumbnail: product.thumbnail
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ================= REMOVE THUMBNAIL =================
export const removeProductThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (!product.thumbnail?.public_id) {
      return res.status(400).json({
        success: false,
        message: "No thumbnail to remove"
      });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(product.thumbnail.public_id);

    // remove from db
    product.thumbnail = undefined;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Thumbnail removed successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// =================== addMockupsIDsToProduct

export const addMockupsToProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const { mockupIds } = req.body; // expect array of strings

    if (!productId) return res.status(400).json({ success: false, message: "productId required" });
    if (!Array.isArray(mockupIds) || mockupIds.length === 0) {
      return res.status(400).json({ success: false, message: "mockupIds (array) required" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId" });
    }

    // Optional: filter only valid ObjectId strings (prevents bad values)
    const onlyValidStrings = mockupIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (onlyValidStrings.length === 0) {
      return res.status(400).json({ success: false, message: "No valid mockup ids provided" });
    }

    // Add to set to avoid duplicates (no manual new ObjectId conversion needed)
    const updated = await productModel.findByIdAndUpdate(
      productId,
      { $addToSet: { mockupIds: { $each: onlyValidStrings } } },
      { new: true }
    ).populate("mockupIds");

    if (!updated) return res.status(404).json({ success: false, message: "Product not found" });

    return res.status(200).json({ success: true, data: updated, message: "Mockups added" });
  } catch (error) {
    console.error("addMockupsToProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


// REMOVE MOCKUP FROM PRODUCT
export const removeMockupFromProduct = async (req, res) => {
  try {
    const { productId, mockupId } = req.params;

    const product = await productModel.findByIdAndUpdate(
      productId,
      { $pull: { mockupIds: mockupId } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Mockup removed from product",
      data: product,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ============================ Custom Varaint

// Get Variant Attributes for a Product
export const getVariantAttributes = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId).select('variantAttributes');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product.variantAttributes,
      status: 200
    });
  } catch (error) {
    console.error("Error fetching variant attributes:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Save Variant Attributes for a Product
export const saveVariantAttributes = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sizes, colors, customFields } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Update variant attributes
    product.variantAttributes = {
      sizes: sizes || product.variantAttributes.sizes,
      colors: colors || product.variantAttributes.colors,
      customFields: customFields || product.variantAttributes.customFields
    };

    await product.save();

    res.status(200).json({
      success: true,
      data: product.variantAttributes,
      message: "Variant attributes saved successfully",
      status: 200
    });
  } catch (error) {
    console.error("Error saving variant attributes:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};