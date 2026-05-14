import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    shopify_store_id: { type: String, required: true },
    shopify_order_id: { type: Number, required: true, unique: true, index: true },
    shopify_graphql_id: { type: String },
    order_number: { type: Number },
    order_name: { type: String },
    confirmation_number: { type: String },
    token: { type: String },
    payment_gateway: [{ type: String }],
    payment_status: { type: String },
    financial_status: { type: String },
    total_price: { type: String },
    subtotal_price: { type: String },
    total_tax: { type: String },
    total_discounts: { type: String },
    currency: { type: String },
    presentment_currency: { type: String },
    fulfillment_status: { type: String, default: null },
    customer: { type: Object, default: {} },
    shipping_address: { type: Object, default: {} },
    billing_address: { type: Object, default: {} },
    line_items: [
      {
        id: Number,
        sku: String,
        title: String,
        quantity: Number,
        price: String,
        product_id: Number,
        variant_id: Number,
        name: String,
        properties: { type: [Schema.Types.Mixed], default: [] },
      }
    ],
    test_order: { type: Boolean, default: false },
    confirmed: { type: Boolean, default: false },
    source_name: { type: String },
    browser_ip: { type: String },
    shopify_created_at: { type: Date },
    shopify_updated_at: { type: Date },
    processed_at: { type: Date }
  },
  { timestamps: true }
);

// Indexes for faster search and filtering
orderSchema.index({ shopify_store_id: 1, shopify_order_id: 1 });
orderSchema.index({ "line_items.sku": 1 });
orderSchema.index({ payment_status: 1 });
orderSchema.index({ fulfillment_status: 1 });
orderSchema.index({ order_number: 1 });
orderSchema.index({ "customer.email": 1 });

export default model("Order", orderSchema);
