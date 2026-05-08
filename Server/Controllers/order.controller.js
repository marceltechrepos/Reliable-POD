import OrderService from "../Services/order.service.js";
import { validateOrderPayload } from "../Validations/order.validation.js";

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
