import mongoose, { Types } from "mongoose";

const StoreSchema = new mongoose.Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    shopDomain: { type: String, required: true },
    type: { type: String, Enum: ['Shopify', 'Etsy', 'WooCommerce', 'Anywhere POD', 'Manual Order'] },
    Validated: { type: Boolean, default: false },
    token: { type: String, default: null },
},
    { timestamps: true }
)

const Store = mongoose.model("Store", StoreSchema);
export default Store;
