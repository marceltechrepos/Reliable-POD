// src/api/product.api.js
const BASE_URL = import.meta.env.VITE_BASE_URL;

const createProduct = async (payload) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BASE_URL}/api/create-product`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error, '<<<< create product error');
        return { success: false };
    }
};


const getProductById = async (productId) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-product`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();

        if (data.success) {
            // product find by id
            const product = data.data.find(
                (item) => item._id === productId
            );

            return product || null;
        }
    } catch (error) {
        console.log(error, "<<<< getProductById error");
        return null;
    }
};


const deleteProductById = async (productId) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    //   const res = await axios.delete(`${BASE_URL}/api/delete-product/${productId}`);
    return res.data;
};


export const getProductsByCategory = async (categoryId) => {
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
        // if (res) {
        //     const data = await res?.json();

        //     if (data?.success) {
        //         return data.data; // ye array of products return karega
        //     }
        // }

        // return [];
    } catch (error) {
        console.log(error, "<<<< getProductsByCategory error");
        return [];
    }
};


const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
};



export {
    createProduct,
    getProductById,
    deleteProductById,
    authFetch
};
