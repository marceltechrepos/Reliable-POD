import Order from "../Models/order.model.js";
import Product from "../Models/product.model.js";

class OrderService {
    async createOrder(orderData) {
        // Handle duplicate Shopify orders
        const existingOrder = await Order.findOne({ shopify_order_id: orderData.shopify_order_id });
        if (existingOrder) {
            throw new Error(`Order with shopify_order_id ${orderData.shopify_order_id} already exists.`);
        }

        const order = new Order(orderData);
        await order.save();
        return order;
    }

    async createOrderFromShopify(shopifyData, shopifyStoreId) {
        // Map Shopify data to Order schema
        const orderData = {
            shopify_store_id: shopifyStoreId,
            shopify_order_id: shopifyData.id,
            shopify_graphql_id: shopifyData.admin_graphql_api_id,
            order_number: shopifyData.order_number,
            order_name: shopifyData.name,
            confirmation_number: shopifyData.confirmation_number,
            token: shopifyData.token,
            payment_gateway: shopifyData.payment_gateway_names,
            financial_status: shopifyData.financial_status,
            total_price: shopifyData.total_price,
            subtotal_price: shopifyData.subtotal_price,
            total_tax: shopifyData.total_tax,
            total_discounts: shopifyData.total_discounts,
            currency: shopifyData.currency,
            presentment_currency: shopifyData.presentment_currency,
            fulfillment_status: shopifyData.fulfillment_status,
            customer: shopifyData.customer,
            shipping_address: shopifyData.shipping_address,
            billing_address: shopifyData.billing_address,
            line_items: shopifyData.line_items.map(item => ({
                id: item.id,
                sku: item.sku,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                product_id: item.product_id,
                variant_id: item.variant_id,
                name: item.name
            })),
            test_order: shopifyData.test,
            confirmed: shopifyData.confirmed,
            source_name: shopifyData.source_name,
            browser_ip: shopifyData.browser_ip,
            shopify_created_at: shopifyData.created_at,
            shopify_updated_at: shopifyData.updated_at,
            processed_at: shopifyData.processed_at
        };

        return await this.createOrder(orderData);
    }

    async getOrders(query = {}) {
        const { 
            page = 1, 
            limit = 10, 
            sortBy = "createdAt", 
            order = "desc", 
            search = "", 
            payment_status, 
            fulfillment_status 
        } = query;

        const filter = {};

        if (search) {
            filter.$or = [
                { order_name: { $regex: search, $options: "i" } },
                { "customer.email": { $regex: search, $options: "i" } },
                { "line_items.sku": { $regex: search, $options: "i" } }
            ];
            // If search is a number, we can search by order_number
            if (!isNaN(search)) {
                filter.$or.push({ order_number: Number(search) });
            }
        }

        if (payment_status) filter.payment_status = payment_status;
        if (fulfillment_status) filter.fulfillment_status = fulfillment_status;

        const sortOptions = {};
        sortOptions[sortBy] = order === "asc" ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Order.countDocuments(filter);

        return {
            orders,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        };
    }

    async getOrderById(id) {
        const order = await Order.findById(id).lean();
        if (!order) {
            throw new Error("Order not found");
        }

        // Fetch related products using SKU from line_items
        const enrichedLineItems = await Promise.all(
            order.line_items.map(async (item) => {
                let product = null;
                if (item.sku) {
                    product = await Product.findOne({ "Variants.sku": item.sku }).lean();
                }
                return {
                    ...item,
                    product: product || null
                };
            })
        );

        order.line_items = enrichedLineItems;
        return order;
    }

    async updateOrder(id, updateData) {
        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
        if (!order) throw new Error("Order not found");
        return order;
    }

    async deleteOrder(id) {
        const order = await Order.findByIdAndDelete(id);
        if (!order) throw new Error("Order not found");
        return order;
    }
}

export default new OrderService();
