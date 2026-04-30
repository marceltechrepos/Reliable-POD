import { Schema, model, Types } from "mongoose";

const printAreaImageSchema = new Schema(
  {
    printAreaImage: {
      url: {
        type: String,
        required: [true, "Image URL is required"],
      },
      public_id: {
        type: String,
        required: [true, "Public ID is required"],
      },
      name: {
        type: String,
      },
    },
    productId: {
      type: Types.ObjectId,
    },
    UserId: {
      type: Types.ObjectId,
    },
    name: String,
    size: String,
  },
  {
    timestamps: true,
  }
);

export default model("printAreaImage", printAreaImageSchema);