import { Schema ,Types, model} from "mongoose";

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
    mockupImage: String,
    mockupIds: [
      {
        type: Types.ObjectId,
        ref: "MockupImage",
      },
    ],
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
    
    // 🔥 ADD THIS - Variant Attributes Configuration
    variantAttributes: {
      sizes: {
        type: [String],
        default: ['L', 'XS', 'S', 'M']
      },
      colors: {
        type: Map,
        of: String,
        default: {
          white: '#ffffff',
          black: '#000000'
        }
      },
      customFields: {
        type: [{
          name: String,
          type: {
            type: String,
            enum: ['text', 'number', 'select', 'checkbox']
          },
          options: [String]
        }],
        default: []
      }
    },

    Variants: [
      {
        sku: String,
        basePrice: Number,
        comparePrice: Number,
        size: { type: String, default: '' },
        color: { type: String, default: '' },
        colorHex: { type: String, default: '#ffffff' },
        weight: { type: Number, default: 0 },
        customAttributes: { type: Object, default: {} },
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