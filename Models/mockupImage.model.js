import { Schema, model, Types } from "mongoose";

const mockupImageSchema = new Schema(
  {
    mockupImage: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      public_id: {
        type: String,
        required: [true, "Public ID is required"],
      },
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: String,
    size: String,
  },
  {
    timestamps: true,
  }
);

export default model("MockupImage", mockupImageSchema);
