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
