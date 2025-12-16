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
        tib: [String],
        fulfiledKey: [String],
        displayName: [String],
        width: [Number],
        height: [Number],
      },
    ],
    Variants: [
      {
        tib: [String],
        fulfiledKey: [String],
        displayName: [String],
        width: [Number],
        height: [Number],
        sku: [String],
        color: [String],
        colorHex: [String],
      },
    ],
  },
  { timestamps: true }
);

export default model("Product", productSchema);
