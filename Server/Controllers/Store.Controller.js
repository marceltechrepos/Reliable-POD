import Store from "../Models/Stores.Model.js";

export const createStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shopDomain, type } = req.body;

        const existingShopDomain = await Store.findOne({ shopDomain });
        if (existingShopDomain) {
            return res.status(400).json({ success: false, message: "Shop domain already exists" });
        }

        const Token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const store = await Store.create({ userId, shopDomain, type, token: Token });

        return res.status(201).json({ success: true, data: store, status: 201, message: "Store created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.params;
        const store = await Store.findOne({ userId, type });
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }
        return res.status(200).json({ success: true, data: store, status: 200 });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const validateToken = async (req, res) => {
    try {
        const { secret_key, storeDomain } = req.body;
        const store = await Store.findOne({ token: secret_key, shopDomain: storeDomain });
        if (!store) {
            return res.status(404).json({ success: false, message: "Store not found" });
        }
        store.Validated = true;
        await store.save();

        return res.status(200).json({ success: true, data: store, status: 200, message: "Store validated successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}