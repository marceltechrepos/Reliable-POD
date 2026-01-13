import { Schema, model, Types } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      url: String,
      public_id: String,
    },

    parent: {
      type: Types.ObjectId,
      ref: "Category",
      default: null, // null = top-level category
    },

    level: {
      type: Number,
      default: 0, // 0 = category, 1 = subcategory, 2 = child, etc.
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default model("Category", CategorySchema);
