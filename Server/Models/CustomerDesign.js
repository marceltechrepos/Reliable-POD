import mongoose from "mongoose";

const layerSchema = new mongoose.Schema(
  {
    printArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layer",
      required: false
    },

    imageUrl: {
      type: String,
      required: true,
      trim: true
    },

    publicId: {
      type: String,
      trim: true
    },

    positionX: {
      type: Number,
      default: 0,

    },

    positionY: {
      type: Number,
      default: 0,
    },

    width: {
      type: Number,
      default: 30,
    },

    height: {
      type: Number,
      default: 30,
    },

    rotation: {
      type: Number,
      default: 0
    },

    opacity: {
      type: Number,
      default: 1,
    },

    visible: {
      type: Boolean,
      default: true
    },

    zIndex: {
      type: Number,
      default: 1
    },
    horizontalAlign: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center'
    },

    enablePerspective: {
      type: Boolean,
      default: false
    },
    corners: {
      type: [{
        x: { type: Number, required: true },
        y: { type: Number, required: true }
      }],
      default: []
    },
    fit: {
      type: String,
      enum: ['cover', 'contain', 'fill'],
      default: 'cover'
    },
    perspective: { type: Number, default: 0 },
    rotateX: { type: Number, default: 0 },
    rotateY: { type: Number, default: 0 },
    rotateZ: { type: Number, default: 0 },
    skewX: { type: Number, default: 0 },
    skewY: { type: Number, default: 0 },
    transformOrigin: { type: String, default: 'center center' },

    verticalAlign: {
      type: String,
      enum: ['top', 'middle', 'bottom'],
      default: 'middle'
    }
  },
  {
    _id: true
  }
);

const customerDesignSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    finalDesignImage: {
      type: String,
      default: ''
    },
    finalDesignPublicId: {
      type: String,
      default: ''
    },

    mockup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MockupImage",
      required: true
    },

    // optional canvas size
    canvasWidth: {
      type: Number,
      default: 100
    },

    canvasHeight: {
      type: Number,
      default: 100
    },

    layers: [layerSchema]
  },
  {
    timestamps: true
  }
);

// one design per user per product per mockup
customerDesignSchema.index(
  { user: 1, product: 1, mockup: 1 },
  { unique: true }
);

export default mongoose.model("CustomerDesign", customerDesignSchema);