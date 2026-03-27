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
      },
    ],
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      default: null,
    },
    importedToShopify: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

customProductSchema.index({ user: 1, baseProduct: 1 }, { unique: false });

export default mongoose.model("CustomProduct", customProductSchema);