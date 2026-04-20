import mongoose from "mongoose";

const layerSchema = new mongoose.Schema(
  {
    // Add type field to distinguish between image and text layers
    type: {
      type: String,
      enum: ['image', 'text'],
      default: 'image'
    },

    printArea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Layer",
      required: false
    },

    // imageUrl ab conditional required hoga
    imageUrl: {
      type: String,
      trim: true,
      required: function () {
        // Sirf tab required hai jab type 'image' ho
        return this.type === 'image';
      }
    },

    // Text specific fields
    text: {
      type: String,
      default: 'Your Text',
      required: function () {
        return this.type === 'text';
      }
    },

    fontSize: {
      type: Number,
      default: 24
    },

    fontFamily: {
      type: String,
      default: 'Arial'
    },

    fontWeight: {
      type: String,
      default: 'normal'
    },

    fontStyle: {
      type: String,
      default: 'normal'
    },

    fill: {
      type: String,
      default: '#000000'
    },

    align: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center'
    },

    lineHeight: {
      type: Number,
      default: 1.2
    },

    letterSpacing: {
      type: Number,
      default: 0
    },

    textDecoration: {
      type: String,
      default: 'none'
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

    locked: {
      type: Boolean,
      default: false
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

    verticalAlign: {
      type: String,
      enum: ['top', 'middle', 'bottom'],
      default: 'middle'
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

customerDesignSchema.index(
  { user: 1, product: 1, mockup: 1 },
  { unique: true }
);

export default mongoose.model("CustomerDesign", customerDesignSchema);