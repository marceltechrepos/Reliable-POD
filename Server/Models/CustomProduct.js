import mongoose from "mongoose";

const customProductSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    baseProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // ✅ ADD THIS INSTEAD (usi jagah par):
    variantPrices: [
      {
        variantId: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],

    selectedDefaultVariants: [
      {
        type: String,
      },
    ],

    customVariant: {
      enabled: {
        type: Boolean,
        default: false,
      },
      imageUrl: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
      name: {
        type: String,
        default: "",
      },
      description: {
        type: String,
        default: "",
      },
      tags: [
        {
          type: String,
        },
      ],
    },

    customVariants: [
      {
        enabled: {
          type: Boolean,
          default: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          default: "",
        },
        fileName: {
          type: String,
          default: "",
        },
        // Common fields - same for all variants
        name: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        tags: [
          {
            type: String,
          },
        ],
      },
    ],

    customerDesign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerDesign",
      default: null,
    },

    selectedMockup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockupImage",
      default: null,
    },

    customerLayers: [
      {
        printArea: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Layer",
        },
        imageUrl: String,
        publicId: String,
        positionX: Number,
        positionY: Number,
        width: Number,
        height: Number,
        rotation: Number,
        opacity: Number,
        visible: Boolean,
        zIndex: Number,
        horizontalAlign: String,
        verticalAlign: String,
        // Text properties
        type: { type: String, default: "image" },
        text: String,
        fontSize: Number,
        fontFamily: String,
        fontWeight: String,
        fontStyle: String,
        fill: String,
        align: String,
        lineHeight: Number,
        letterSpacing: Number,
        textDecoration: String,
        wrapMode: String,
        name: String,
        isPlaceholder: { type: Boolean, default: false },
      },
    ],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },

    deleted: {
      type: Boolean,
      default: false
    },
    importedToShopify: {
      type: Boolean,
      default: false,
    },
    shopifyProductId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

customProductSchema.index({ user: 1, baseProduct: 1 }, { unique: false });

export default mongoose.model("CustomProduct", customProductSchema);