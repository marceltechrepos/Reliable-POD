// import ShopifyStore from '../Models/ShopifyStore.js';
// import Store from '../Models/Stores.Model.js';
// import axios from 'axios';
// import crypto from 'crypto';

// // Helper to verify HMAC
// const verifyHmac = (query, secret) => {
//     const { hmac, ...params } = query;
//     const sorted = Object.keys(params)
//         .sort()
//         .map(key => `${key}=${params[key]}`)
//         .join('&');
//     const generated = crypto
//         .createHmac('sha256', secret)
//         .update(sorted)
//         .digest('hex');
//     return generated === hmac;
// };

// // 1️⃣ Initiate Shopify OAuth
// export const initiateShopifyAuth = (req, res) => {
//     const { shop } = req.query;

//     if (!shop) {
//         return res.status(400).json({ error: 'Shop parameter required' });
//     }

//     const nonce = crypto.randomBytes(16).toString('base64');
//     const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/stores/shopify/callback`;
//     const scopes = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory';
//     const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}`;

//     // Store nonce in session or cookie
//     res.cookie('shopify_nonce', nonce, { httpOnly: true, maxAge: 10 * 60 * 1000 });
//     res.cookie('shopify_shop', shop, { maxAge: 10 * 60 * 1000 });

//     res.redirect(authUrl);
// };

// // 2️⃣ Shopify OAuth Callback
// export const shopifyCallback = async (req, res) => {
//     const { shop, code, state, hmac } = req.query;
//     const nonce = req.cookies.shopify_nonce;

//     if (state !== nonce) {
//         return res.status(403).send('Invalid state');
//     }

//     if (!verifyHmac(req.query, process.env.SHOPIFY_API_SECRET)) {
//         return res.status(403).send('Invalid HMAC');
//     }

//     try {
//         // Exchange code for access token
//         const response = await axios.post(
//             `https://${shop}/admin/oauth/access_token`,
//             {
//                 client_id: process.env.SHOPIFY_API_KEY,
//                 client_secret: process.env.SHOPIFY_API_SECRET,
//                 code: code,
//             }
//         );

//         const { access_token, scope } = response.data;
//         const userId = req.user?._id || req.session?.userId;

//         if (!userId) {
//             return res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_error=auth_required`);
//         }

//         // Save to ShopifyStore model
//         const shopifyStore = await ShopifyStore.findOneAndUpdate(
//             { shopDomain: shop },
//             {
//                 shopDomain: shop,
//                 accessToken: access_token,
//                 scope: scope,
//                 userId,
//                 storeName: shop.split('.')[0],
//                 isActive: true,
//                 connectedAt: new Date()
//             },
//             { upsert: true, new: true }
//         );

//         // Also save to Store model for unified view
//         await Store.findOneAndUpdate(
//             { userId, type: 'Shopify', 'shopifyStoreId': shopifyStore._id },
//             {
//                 userId,
//                 name: shopifyStore.storeName,
//                 type: 'Shopify',
//                 shopifyStoreId: shopifyStore._id,
//                 isActive: true
//             },
//             { upsert: true, new: true }
//         );

//         // Clear cookies
//         res.clearCookie('shopify_nonce');
//         res.clearCookie('shopify_shop');

//         res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_success=${shop}`);
//     } catch (error) {
//         console.error('Shopify OAuth error:', error.response?.data || error.message);
//         res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_error=1`);
//     }
// };

// // 3️⃣ Get all stores for user
// export const getUserStores = async (req, res) => {
//     try {
//         const userId = req.user?._id || req.session?.userId;

//         if (!userId) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         const stores = await Store.find({ userId, isActive: true })
//             .populate('shopifyStoreId')
//             .sort({ createdAt: -1 });

//         // Transform to frontend format
//         const formattedStores = stores.map(store => ({
//             id: store._id,
//             name: store.name,
//             type: store.type,
//             shopDomain: store.shopifyStoreId?.shopDomain,
//             connectedAt: store.shopifyStoreId?.connectedAt,
//             isActive: store.isActive,
//             products: 0, // TODO: fetch from Shopify API
//             orders: 0,
//             revenue: 0
//         }));

//         res.json(formattedStores);
//     } catch (error) {
//         console.error('Error fetching stores:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

// // 4️⃣ Get single store details
// export const getStoreById = async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         const userId = req.user?._id || req.session?.userId;

//         const store = await Store.findOne({ _id: storeId, userId })
//             .populate('shopifyStoreId');

//         if (!store) {
//             return res.status(404).json({ error: 'Store not found' });
//         }

//         res.json(store);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // 5️⃣ Disconnect store
// export const disconnectStore = async (req, res) => {
//     try {
//         const { storeId } = req.params;
//         const userId = req.user?._id || req.session?.userId;

//         const store = await Store.findOne({ _id: storeId, userId });
//         if (!store) {
//             return res.status(404).json({ error: 'Store not found' });
//         }

//         // Update Store model
//         store.isActive = false;
//         await store.save();

//         // Update ShopifyStore if exists
//         if (store.shopifyStoreId) {
//             await ShopifyStore.findByIdAndUpdate(store.shopifyStoreId, {
//                 isActive: false,
//                 disconnectedAt: new Date()
//             });
//         }

//         res.json({ message: 'Store disconnected successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // 6️⃣ Create manual store (non-Shopify)
// export const createManualStore = async (req, res) => {
//     try {
//         const { name, type } = req.body;
//         const userId = req.user?._id || req.session?.userId;

//         if (!userId) {
//             return res.status(401).json({ error: 'Unauthorized' });
//         }

//         const newStore = await Store.create({
//             userId,
//             name,
//             type,
//             isActive: true
//         });

//         res.status(201).json(newStore);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


import ShopifyStore from '../Models/ShopifyStore.js';
import Store from '../Models/Stores.Model.js';
import axios from 'axios';
import crypto from 'crypto';

const verifyHmac = (query, secret) => {
    const { hmac, ...params } = query;
    const sorted = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');
    const generated = crypto
        .createHmac('sha256', secret)
        .update(sorted)
        .digest('hex');
    return generated === hmac;
};

// 1️⃣ Initiate Shopify OAuth
export const initiateShopifyAuth = (req, res) => {
    const { shop } = req.query;

    if (!shop) {
        return res.status(400).json({ error: 'Shop parameter required' });
    }

    // ✅ Store userId in session for callback
    if (req.session?.userId) {
        req.session.pendingShopifyUserId = req.session.userId;
    }

    const nonce = crypto.randomBytes(16).toString('base64');
    const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/shopify/callback`;
    const scopes = 'read_products,write_products,read_orders,write_orders,read_inventory,write_inventory';
    const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${nonce}`;

    req.session.shopifyNonce = nonce;
    req.session.shopifyShop = shop;

    res.redirect(authUrl);
};

// 2️⃣ Shopify OAuth Callback
export const shopifyCallback = async (req, res) => {
    const { shop, code, state, hmac } = req.query;
    const nonce = req.session.shopifyNonce;

    if (state !== nonce) {
        return res.status(403).send('Invalid state');
    }

    if (!verifyHmac(req.query, process.env.SHOPIFY_API_SECRET)) {
        return res.status(403).send('Invalid HMAC');
    }

    try {
        const response = await axios.post(
            `https://${shop}/admin/oauth/access_token`,
            {
                client_id: process.env.SHOPIFY_API_KEY,
                client_secret: process.env.SHOPIFY_API_SECRET,
                code: code,
            }
        );

        const { access_token, scope } = response.data;

        // ✅ Get userId from session (set during initiate or login)
        const userId = req.session.pendingShopifyUserId || req.session.userId;

        if (!userId) {
            return res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_error=auth_required`);
        }

        // Save to ShopifyStore model
        const shopifyStore = await ShopifyStore.findOneAndUpdate(
            { shopDomain: shop },
            {
                shopDomain: shop,
                accessToken: access_token,
                scope: scope,
                userId,
                storeName: shop.split('.')[0],
                isActive: true,
                connectedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Save to Store model
        await Store.findOneAndUpdate(
            { userId, type: 'Shopify', shopifyStoreId: shopifyStore._id },
            {
                userId,
                name: shopifyStore.storeName,
                type: 'Shopify',
                shopifyStoreId: shopifyStore._id,
                isActive: true
            },
            { upsert: true, new: true }
        );

        // Clear session
        req.session.shopifyNonce = null;
        req.session.shopifyShop = null;
        req.session.pendingShopifyUserId = null;

        res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_success=${shop}`);
    } catch (error) {
        console.error('Shopify OAuth error:', error.response?.data || error.message);
        res.redirect(`${process.env.FRONTEND_URL}/user/stores?shopify_error=1`);
    }
};