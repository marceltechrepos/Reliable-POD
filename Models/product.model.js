import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    productTitle: String,
    internalName: String,
    fulfilmentProvider: String,
    fulfilmentCatalogID: String,
    description: String,
    thumbnail: {
      url: String,
      public_id: String,
    },
    mockupImage: String,
    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },
    Printareas: [
      {
        fulfiledKey: String,
        displayName: String,
        width: Number,
        height: Number,
      },
    ],

    Variants: [
      {
        sku: String,
        size: Number,
        weight: Number,
        color: String,
        colorHex: String,
        basePrice: Number,
        comparePrice: Number,
        createdAt: String,
        updatedAt: String,
        available: { type: String, default: "available", enum: ["available", "coming soon", "out of stock"] },
        addToCampaigns: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default model("Product", productSchema);
