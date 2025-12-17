import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    productTitle: String,
    internalName: String,
    fulfilmentProvider: String,
    fulfilmentCatalogID: String,
    description: String,
    thumbnail: String,
    mockupImage: String,

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
      },
    ],
  },
  { timestamps: true }
);

export default model("Product", productSchema);
