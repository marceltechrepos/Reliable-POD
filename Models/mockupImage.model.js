import { Schema, model } from "mongoose";

const mockupImageSchema = new Schema(
  {
    mockupImage: String,
    category: String,
    name: String,
    size: String,
  },
  {
    timestamps: true,
  }
);

export default model("MockupImage", mockupImageSchema);
