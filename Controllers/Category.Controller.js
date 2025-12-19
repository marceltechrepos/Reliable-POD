
import Category from "../Models/Categories.Model.js";
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
            ThumbnailPicture: uploadResult.secure_url,
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
        
    } catch (error) {

    }
}
export { createCategory, getAllCategory };  