import mongoose from 'mongoose';

const shopifyStoreSchema = new mongoose.Schema({
    shopDomain: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    accessToken: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    storeName: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    connectedAt: {
        type: Date,
        default: Date.now
    },
    disconnectedAt: Date
}, { timestamps: true });

export default mongoose.model('ShopifyStore', shopifyStoreSchema);