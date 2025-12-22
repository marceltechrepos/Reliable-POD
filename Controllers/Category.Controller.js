import fs from "fs";
import Provider from "../Models/Provider.Model.js";
import Category from "../Models/Categories.Model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";

// =======> Category
export const createCategory = async (req, res) => {
  try {
    const { category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    // Remove file from local storage after upload
    fs.unlinkSync(req.file.path);

    const newCategory = await Category.create({
      category,
      description,
      thumbnail: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });

    res.status(201).json({
      success: true,
      data: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category, description } = req.body;

    // Find existing category
    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    let updateData = {};

    // Update category name if provided
    if (category !== undefined) {
      updateData.category = category;
    }

    // Update description if provided
    if (description !== undefined) {
      updateData.description = description;
    }

    // If new image is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });

      // Remove file from local storage after upload
      fs.unlinkSync(req.file.path);

      // Delete old image from Cloudinary if exists
      if (existingCategory.thumbnail && existingCategory.thumbnail.public_id) {
        try {
          await cloudinary.uploader.destroy(
            existingCategory.thumbnail.public_id
          );
        } catch (cloudinaryError) {
          console.error(
            "Error deleting old image from Cloudinary:",
            cloudinaryError
          );
          // Continue with update even if delete fails
        }
      }

      updateData.thumbnail = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    // Update category
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======> Providers
export const createProvider = async (req, res) => {
  try {
    const { provider, description } = req.body;
    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "Provider name is required",
      });
    }
    const newProvider = await Provider.create({
      provider,
      description,
    });
    return res.status(201).json({
      success: true,
      data: newProvider,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    return res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { provider, description } = req.body;
    const updateData = {};
    if (provider !== undefined) updateData.provider = provider;
    if (description !== undefined) updateData.description = description;
    
    const updatedProvider = await Provider.findByIdAndUpdate(
      providerId,
      updateData,
      { new: true }
    );
    if (!updatedProvider) {
      return res.status(400).json({
        success: false,
        message: "Provider not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedProvider,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    const provider = await Provider.findByIdAndDelete(providerId);
    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "Provider not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Provider deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
