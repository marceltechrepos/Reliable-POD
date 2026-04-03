
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Create Shopify store (generates API key)
export const createShopifyStore = async (shopDomain) => {
    try {
        const response = await api.post('/api/create-store', {
            shopDomain,
            type: 'Shopify'
        });
        return response.data;
    } catch (error) {
        console.error('Error creating store:', error);
        throw error;
    }
};

// Get all stores
export const getUserStores = async () => {
    try {
        const response = await api.get('/api/get-stores');
        return response.data;
    } catch (error) {
        console.error('Error fetching stores:', error);
        throw error;
    }
};

// Create manual store
export const createManualStore = async (data) => {
    try {
        const response = await api.post('/api/manual-store', data);
        return response.data;
    } catch (error) {
        console.error('Error creating manual store:', error);
        throw error;
    }
};

// Disconnect store
export const disconnectStore = async (storeId) => {
    try {
        const response = await api.delete(`/api/disconnect/${storeId}`);
        return response.data;
    } catch (error) {
        console.error('Error disconnecting store:', error);
        throw error;
    }
};

// Validate store with API key (called from Shopify app)
export const validateStore = async (apiKey, storeDomain) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/validate`, {
            apiKey,
            storeDomain
        });
        return response.data;
    } catch (error) {
        console.error('Error validating store:', error);
        throw error;
    }
};