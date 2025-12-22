import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    category: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      public_id: {
        type: String,
        required: [true, "Public ID is required"],
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Category = model("Category", CategorySchema);
export default Category;
