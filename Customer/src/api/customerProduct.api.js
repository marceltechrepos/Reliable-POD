const BASE_URL = import.meta.env.VITE_BASE_URL;

// ============= CREATE =============
export const createCustomProduct = async (payload) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/custom-product/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("createCustomProduct API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};

// ============= GET ALL (with pagination & filters) =============
export const getCustomProducts = async (params = {}) => {
    try {
        const token = localStorage.getItem("token");
        
        // Build query string
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page);
        if (params.limit) queryParams.append("limit", params.limit);
        if (params.productId) queryParams.append("productId", params.productId);
        
        const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

        const res = await fetch(`${BASE_URL}/api/custom-product/${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getCustomProducts API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};

// ============= GET SINGLE =============
export const getCustomProductById = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/custom-product/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("getCustomProductById API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};

// ============= UPDATE =============
export const updateCustomProduct = async (id, payload) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/custom-product/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("updateCustomProduct API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};

// ============= DELETE SINGLE =============
export const deleteCustomProduct = async (id) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/custom-product/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("deleteCustomProduct API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};

// ============= BULK DELETE =============
export const bulkDeleteCustomProducts = async (ids) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/custom-product/bulk-delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("bulkDeleteCustomProducts API error:", error);
        return {
            success: false,
            message: "Network error",
        };
    }
};