// Controllers/Store.Controller.js

import Store from "../Models/Stores.Model.js";
import crypto from "crypto";

// Create store with unique token
export const createStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shopDomain, type } = req.body;

        // Check if store already exists
        const existingStore = await Store.findOne({
            shopDomain,
            userId,
            isActive: true
        });

        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: "Store already exists"
            });
        }

        // Generate unique token/key
        const uniqueKey = crypto.randomBytes(32).toString('hex');

        // Generate API key format: exp_ + first 16 chars of unique key
        const apiKey = `exp_${uniqueKey.substring(0, 16)}`;

        const store = await Store.create({
            userId,
            name: shopDomain,
            shopDomain,
            type,
            token: uniqueKey,
            apiKey: apiKey,
            isActive: true,
            validated: false
        });

        return res.status(201).json({
            success: true,
            data: {
                storeId: store._id,
                shopDomain: store.shopDomain,
                apiKey: store.apiKey,
                message: "Store created. Share this API key with Shopify app"
            },
            message: "Store created successfully"
        });
    } catch (error) {
        console.error("CreateStore Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Validate store with API key (called from Shopify app)
export const validateStoreWithApiKey = async (req, res) => {
    try {
        const { apiKey, storeDomain } = req.body;

        if (!apiKey || !storeDomain) {
            return res.status(400).json({
                success: false,
                message: "API Key and Store Domain are required"
            });
        }

        // Find store by apiKey and shopDomain
        const store = await Store.findOne({
            apiKey: apiKey,
            shopDomain: storeDomain,
            isActive: true
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Invalid API Key or Store Domain"
            });
        }

        // Mark store as validated
        store.validated = true;
        store.validatedAt = new Date();
        await store.save();

        return res.status(200).json({
            success: true,
            message: "Store validated successfully!",
            data: {
                storeId: store._id,
                shopDomain: store.shopDomain,
                type: store.type
            }
        });
    } catch (error) {
        console.error("ValidateStore Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get store by ID
export const getStoreById = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;

        const store = await Store.findOne({ _id: storeId, userId });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        res.json({
            success: true,
            data: store
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getStoreByDomain = async (req, res) => {
    try {
        const { domain } = req.body;

        console.log("Getting store by domain:", domain);

        const store = await Store.findOne({
            shopDomain: domain,
            isActive: true
        });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "Store not found in ExpressPOD"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                domain: store.shopDomain,
                name: store.name,
                apiKey: store.apiKey,
                validated: store.validated,
                validatedAt: store.validatedAt,
                type: store.type,
                storeId: store._id
            }
        });
    } catch (error) {
        console.error("GetStoreByDomain Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all stores for user
export const getUserStores = async (req, res) => {
    try {
        const userId = req.user.id;

        const stores = await Store.find({ userId, isActive: true })
            .sort({ createdAt: -1 });

        const formattedStores = stores.map(store => ({
            id: store._id,
            name: store.name,
            type: store.type,
            shopDomain: store.shopDomain,
            apiKey: store.apiKey,
            validated: store.validated,
            validatedAt: store.validatedAt,
            isActive: store.isActive,
            createdAt: store.createdAt,
            products: 0,
            orders: 0,
            revenue: 0
        }));

        res.json({
            success: true,
            data: formattedStores,
            count: formattedStores.length
        });
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Disconnect store
export const disconnectStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const userId = req.user.id;

        const store = await Store.findOne({ _id: storeId, userId });

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        store.isActive = false;
        store.disconnectedAt = new Date();
        await store.save();

        res.json({
            success: true,
            message: 'Store disconnected successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create manual store (non-Shopify)
export const createManualStore = async (req, res) => {
    try {
        const { name, type } = req.body;
        const userId = req.user.id;

        const existingStore = await Store.findOne({
            userId,
            name,
            type,
            isActive: true
        });

        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: 'Store with this name already exists'
            });
        }

        const newStore = await Store.create({
            userId,
            name,
            type,
            isActive: true,
            validated: true // Manual stores are auto-validated
        });

        res.status(201).json({
            success: true,
            data: newStore,
            message: `${type} store created successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
