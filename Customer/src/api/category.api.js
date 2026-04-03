import { authFetch } from "./auth.api.js";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllProducts = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-product`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.log(error, "<<< error");
        return [];
    }
};

const getAllCategory = async () => {
    try {
        const response = await authFetch(`${BASE_URL}/api/Category/get-all-category`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.log(error, "<<<<< error");
        return [];
    }
};

const getSubCategoriesByParent = async (parentId) => {
    try {
        const response = await authFetch(
            `${BASE_URL}/api/Category/get-category-children?parentId=${parentId}`
        );

        const data = await response.json();

        if (data.success) {
            return data.data;
        }

        return [];
    } catch (error) {
        console.error("Get sub categories error:", error);
        return [];
    }
};

const getProductsByCategory = async (categoryId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-product-by-category/${categoryId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.warn(data.message);
            return [];
        }

        return data.success ? data.data : [];
    } catch (error) {
        console.log(error, "<<<< getProductsByCategory error");
        return [];
    }
};

const getProductById = async (productId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-product-By-Id/${productId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            console.warn(data.message);
            return null;
        }

        return data.success ? data.data : null;
    } catch (error) {
        console.log(error, "<<<< getProductById error");
        return null;
    }
};

export { getAllCategory, getSubCategoriesByParent, getAllProducts, getProductsByCategory, getProductById };