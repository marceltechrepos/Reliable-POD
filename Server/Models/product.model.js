import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    productTitle: String,
    internalName: String,

    fulfilmentProvider: {
      type: Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    fulfilmentCatalogID: String,
    description: String,

    thumbnail: {
      url: String,
      public_id: String,
    },

    mockupImage: {
      url: String,
      width: Number,
      height: Number,
    },

    category: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
    },

    printAreas: [
      {
        fulfilledKey: String,
        displayName: String,

        // placement
        x: Number,
        y: Number,
        width: Number,
        height: Number,

        // perspective / warp
        enablePerspective: {
          type: Boolean,
          default: false,
        },

        corners: [
          {
            x: Number,
            y: Number,
          },
        ],

        // rendering
        fit: {
          type: String,
          enum: ["cover", "contain", "stretch"],
          default: "cover",
        },

        // admin-only flags
        locked: {
          type: Boolean,
          default: true,
        },
      },
    ],

    variants: [
      {
        sku: String,
        size: Number,
        weight: Number,
        color: String,
        colorHex: String,

        basePrice: Number,
        comparePrice: Number,

        available: {
          type: String,
          enum: [
            "available",
            "out of stock",
            "coming soon",
            "discontinued",
          ],
          default: "available",
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
