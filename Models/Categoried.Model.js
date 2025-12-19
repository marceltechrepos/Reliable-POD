import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    category: { type: String, required: true },
    ThumbnailPicture: { type: String, required: true },
});