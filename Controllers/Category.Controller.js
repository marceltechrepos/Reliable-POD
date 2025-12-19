import Category from "../Models/Categories.Model.js";
import Provider from "../Models/Provider.Model.js";
import cloudinary from "../Utils/Cloudinary.Config.js";
import fs from "fs";

const createCategory = async (req, res) => {
  try {
    const { category } = req.body;

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
      thumbnail: uploadResult.secure_url,
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

const getAllCategory = async (req, res) => {
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

const createProvider = async (req, res) => {
  try {
    const { provider } = req.body;
    if (!provider) {
      return res.status(400).json({
        success: false,
        message: "Provider name is required",
      });
    }
    const newProvider = await Provider.create({
      provider,
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

const getProviders = async (req, res) => {
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
export { createCategory, getAllCategory, createProvider, getProviders };
