// src/api/order.api.js
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getOrders = async (params = {}) => {
    try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${BASE_URL}/api/orders?${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return await response.json();
    } catch (error) {
        console.error('getOrders error:', error);
        return { success: false, message: error.message };
    }
};

export const getOrderById = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return await response.json();
    } catch (error) {
        console.error('getOrderById error:', error);
        return { success: false, message: error.message };
    }
};

export const updateOrder = async (id, payload) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error('updateOrder error:', error);
        return { success: false, message: error.message };
    }
};

export const deleteOrder = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return await response.json();
    } catch (error) {
        console.error('deleteOrder error:', error);
        return { success: false, message: error.message };
    }
};
