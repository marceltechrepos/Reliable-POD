import productModel from "../Models/product.model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import mongoose from "mongoose";


export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find().populate("category").populate("fulfilmentProvider");
    res.status(200).json({ success: true, data: products, status: 200 });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


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
    const thumbnail = req.file

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
    );

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
        field: "fulfiledKey",
        required: true,
        errorMessage: "Fulfilled key is required",
      },
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
      { field: "fulfiledKey", errorMessage: "Fulfilled key is required" },
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
    const variantValidations = [
      { field: "sku", required: true, errorMessage: "SKU is required" },
      {
        field: "basePrice",
        required: true,
        errorMessage: "Base Price is required",
      },
    ];

    for (const validation of variantValidations) {
      const value = variantData[validation.field];
      if (
        validation.required &&
        (value === undefined || value === null || value === "")
      ) {
        return res.status(400).json({
          message: validation.errorMessage,
          status: 400,
          field: validation.field,
          success: false,
        });
      }
    }

    // Convert numeric fields
    // if (variantData.size !== undefined) {
    //   variantData.size = Number(variantData.size);
    //   if (isNaN(variantData.size)) {
    //     return res.status(400).json({
    //       status: 400,
    //       success: false,
    //       message: "Size must be a valid number",
    //       field: "size",
    //     });
    //   }
    // }

    // if (variantData.weight !== undefined) {
    //   variantData.weight = Number(variantData.weight);
    //   if (isNaN(variantData.weight)) {
    //     return res.status(400).json({
    //       status: 400,
    //       success: false,
    //       message: "Weight must be a valid number",
    //       field: "weight",
    //     });
    //   }
    // }

    if (variantData.basePrice !== undefined) {
      variantData.basePrice = Number(variantData.basePrice);
      if (isNaN(variantData.basePrice)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Base Price must be a valid number",
          field: "basePrice",
        });
      }
    }

    // Find product
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 404,
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
        status: 400,
        success: false,
        message: "SKU already exists for this product",
        field: "sku",
      });
    }

    variantData.createdAt = new Date();
    variantData.updatedAt = new Date();

    // Add the new variant to the array
    product.Variants.push(variantData);

    await product.save();

    res.status(201).json({
      success: true,
      data: product.Variants[product.Variants.length - 1],
      status: 201,
      message: "Variant added successfully",
      totalVariants: product.Variants.length,
    });
  } catch (error) {
    console.error("Error adding variant:", error);

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

export const updateVariant = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const updateData = req.body;

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

    // Find the variant index in the array
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

    // Get the current variant
    const currentVariant = product.Variants[variantIndex];

    // Check if SKU is being updated and if it already exists (excluding current variant)
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
          field: "sku",
        });
      }
    }

    // Convert numeric fields if provided
    // if (updateData.size !== undefined) {
    //   updateData.size = Number(updateData.size);
    //   if (isNaN(updateData.size)) {
    //     return res.status(400).json({
    //       status: 400,
    //       success: false,
    //       message: "Size must be a valid number",
    //       field: "size",
    //     });
    //   }
    // }

    // if (updateData.weight !== undefined) {
    //   updateData.weight = Number(updateData.weight);
    //   if (isNaN(updateData.weight)) {
    //     return res.status(400).json({
    //       status: 400,
    //       success: false,
    //       message: "Weight must be a valid number",
    //       field: "weight",
    //     });
    //   }
    // }

    if (updateData.basePrice !== undefined) {
      updateData.basePrice = Number(updateData.basePrice);
      if (isNaN(updateData.basePrice)) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Base Price must be a valid number",
          field: "basePrice",
        });
      }
    }

    // if (updateData.salePrice !== undefined) {
    //   updateData.salePrice = Number(updateData.salePrice);
    //   if (isNaN(updateData.salePrice)) {
    //     return res.status(400).json({
    //       status: 400,
    //       success: false,
    //       message: "Sale Price must be a valid number",
    //       field: "salePrice",
    //     });
    //   }
    // }

    // Update the variant
    product.Variants[variantIndex] = {
      ...currentVariant.toObject(),
      ...updateData,
      updatedAt: new Date(),
    };

    await product.save();

    res.status(200).json({
      success: true,
      data: product.Variants[variantIndex],
      status: 200,
      message: "Variant updated successfully",
    });
  } catch (error) {
    console.error("Error updating variant:", error);

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