import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    productTitle: String,
    internalName: String,
    fulfilmentProvider: {
      type: Types.ObjectId,
      ref: "Provider", // ye model ka naam hoga
      required: true,
    },
    // fulfilmentProvider: String,
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

    // Variants: [
    //   {
    //     sku: String,
    //     size: Number,
    //     weight: Number,
    //     color: String,
    //     colorHex: String,
    //     basePrice: Number,
    //     comparePrice: Number,
    //     createdAt: String,
    //     updatedAt: String,

    //   },
    // ],
    Variants: [
      {
        sku: String,
        size: Number,
        weight: Number,
        color: String,
        colorHex: String,
        basePrice: Number,
        comparePrice: Number,

        // 🔥 ADD THESE
        available: {
          type: String,
          enum: ['available', 'out of stock', 'coming soon', 'discontinued'],
          default: 'available',
        },
        addToCampaigns: {
          type: Boolean,
          default: false,
        },

        createdAt: String,
        updatedAt: String,
      },
    ],

  },
  { timestamps: true }
);

export default model("Product", productSchema);
