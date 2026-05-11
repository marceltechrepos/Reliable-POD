import express from "express";
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    shopifyOrderWebhook
} from "../Controllers/order.controller.js";

const orderRoute = express.Router();

orderRoute.post("/orders/shopify-webhook", shopifyOrderWebhook);
orderRoute.post("/orders", createOrder);
orderRoute.get("/orders", getOrders);
orderRoute.get("/orders/:id", getOrderById);
orderRoute.put("/orders/:id", updateOrder);
orderRoute.delete("/orders/:id", deleteOrder);

export default orderRoute;
