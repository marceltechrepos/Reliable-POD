import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    shopDomain: {
        type: String,
        default: null
    },
    type: {
        type: String,
        enum: ['Shopify', 'Etsy', 'WooCommerce', 'Anywhere POD', 'Manual Order'],
        required: true
    },
    apiKey: {
        type: String,
        unique: true,
        sparse: true
    },
    token: {
        type: String,
        default: null
    },
    validated: {
        type: Boolean,
        default: false
    },
    validatedAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    disconnectedAt: Date,
    settings: {
        type: Object,
        default: {}
    }
}, { timestamps: true });


export default mongoose.model('Store', storeSchema);

