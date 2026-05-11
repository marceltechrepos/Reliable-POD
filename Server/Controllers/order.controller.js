import OrderService from "../Services/order.service.js";
import { validateOrderPayload } from "../Validations/order.validation.js";
import Store from "../Models/Stores.Model.js";

export const createOrder = async (req, res) => {
    try {
        const errors = validateOrderPayload(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation Error", errors });
        }

        const order = await OrderService.createOrder(req.body);
        return res.status(201).json({
            success: true,
            data: order,
            message: "Order created successfully"
        });
    } catch (error) {
        console.error("CreateOrder Error:", error);
        return res.status(error.message.includes("already exists") ? 409 : 500).json({
            success: false,
            message: error.message
        });
    }
};

export const shopifyOrderWebhook = async (req, res) => {
    try {
        const shopDomain = req.headers['x-shopify-shop-domain'];
        const webhookId = req.headers['x-shopify-webhook-id'];
        const topic = req.headers['x-shopify-topic'];

        console.log(`[shopify-api/INFO] Receiving webhook request`);
        console.log(`🔔 Webhook received: ${topic} ${shopDomain} Webhook ID: ${webhookId}`);

        const body = req.body;
        console.log(`🟢 [Webhook] Order ID: ${body.id} Name: ${body.name}`);

        if (!shopDomain) {
            console.error("❌ Missing shop domain in webhook headers");
            return res.status(400).json({ success: false, message: "Missing shop domain" });
        }

        // Find the store in our database
        const store = await Store.findOne({ shopDomain, isActive: true });
        if (!store) {
            console.error(`❌ Store not found: ${shopDomain}`);
            return res.status(404).json({ success: false, message: "Store not found" });
        }

        const order = await OrderService.createOrderFromShopify(body, store._id);
        
        console.log(`✅ [Webhook] Order ${body.name} saved successfully with ID: ${order._id}`);
        console.log(`[shopify-app/INFO] Webhook processed, returned status code 200`);

        return res.status(200).json({
            success: true,
            message: "Webhook processed successfully"
        });
    } catch (error) {
        console.error("❌ ShopifyWebhook Error:", error.message);
        // Return 200 to Shopify even if it fails to avoid retries if it's a known error (like duplicate)
        if (error.message.includes("already exists")) {
            return res.status(200).json({ success: true, message: "Order already exists" });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrders = async (req, res) => {
    try {
        const result = await OrderService.getOrders(req.query);
        return res.status(200).json({
            success: true,
            data: result.orders,
            pagination: {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages
            },
            message: "Orders fetched successfully"
        });
    } catch (error) {
        console.error("GetOrders Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await OrderService.getOrderById(req.params.id);
        return res.status(200).json({
            success: true,
            data: order,
            message: "Order fetched successfully"
        });
    } catch (error) {
        console.error("GetOrderById Error:", error);
        return res.status(error.message === "Order not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await OrderService.updateOrder(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            data: order,
            message: "Order updated successfully"
        });
    } catch (error) {
        console.error("UpdateOrder Error:", error);
        return res.status(error.message === "Order not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await OrderService.deleteOrder(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("DeleteOrder Error:", error);
        return res.status(error.message === "Order not found" ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
};
