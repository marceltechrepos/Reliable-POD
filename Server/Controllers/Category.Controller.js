import fs from "fs";
import Provider from "../Models/Provider.Model.js";
import Category from "../Models/Categories.Model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import slugify from "slugify";
import mongoose from "mongoose";

// =======> Category
export const createCategory = async (req, res) => {
  try {
    const { name, description, parent = null } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // Check parent category
    let level = 0;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(404).json({
          success: false,
          message: "Parent category not found",
        });
      }
      level = parentCategory.level + 1;
    }

    // Upload image
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });
    fs.unlinkSync(req.file.path);

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      parent,
      level,
      thumbnail: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ level: 1, createdAt: -1 });

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
    const { name, description, parent } = req.body;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updateData = {};

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (parent !== undefined) {
      if (parent) {
        const parentCategory = await Category.findById(parent);
        if (!parentCategory) {
          return res.status(404).json({
            success: false,
            message: "Parent category not found",
          });
        }
        updateData.parent = parent;
        updateData.level = parentCategory.level + 1;
      } else {
        updateData.parent = null;
        updateData.level = 0;
      }
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
      });
      fs.unlinkSync(req.file.path);

      if (existingCategory.thumbnail?.public_id) {
        await cloudinary.uploader.destroy(
          existingCategory.thumbnail.public_id
        );
      }

      updateData.thumbnail = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = false;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category disabled successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });

    const map = {};
    const roots = [];

    categories.forEach(cat => {
      map[cat._id] = { ...cat._doc, children: [] };
    });

    categories.forEach(cat => {
      if (cat.parent) {
        map[cat.parent]?.children.push(map[cat._id]);
      } else {
        roots.push(map[cat._id]);
      }
    });

    res.status(200).json({
      success: true,
      data: roots,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategoryChildren = async (req, res) => {
  try {
    const { parentId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid parent category ID",
      });
    }

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory) {
      return res.status(404).json({
        success: false,
        message: "Parent category not found",
      });
    }

    const categories = await Category.find({ isActive: true }).lean();

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        ...cat,
        children: [],
      };
    });

    categories.forEach(cat => {
      if (cat.parent) {
        const parentKey = cat.parent.toString();
        categoryMap[parentKey]?.children.push(
          categoryMap[cat._id.toString()]
        );
      }
    });

    res.status(200).json({
      success: true,
      data: categoryMap[parentId]?.children || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRootCategoriesDropdown = async (req, res) => {
  try {
    // 1️⃣ Fetch all active categories
    const categories = await Category.find({ isActive: true })
      .select("_id name parent")
      .sort({ name: 1 })
      .lean(); // lean for faster queries & plain JS objects

    // 2️⃣ Build a lookup map
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id.toString()] = {
        _id: cat._id,
        name: cat.name,
        children: []
      };
    });

    // 3️⃣ Attach children to parents
    categories.forEach(cat => {
      if (cat.parent) {
        const parentKey = cat.parent.toString();
        if (categoryMap[parentKey]) {
          categoryMap[parentKey].children.push(categoryMap[cat._id.toString()]);
        }
      }
    });

    // 4️⃣ Get only root categories
    const roots = categories
      .filter(cat => !cat.parent)
      .map(cat => categoryMap[cat._id.toString()]);

    res.status(200).json({
      success: true,
      data: roots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======> Providers ======>
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
