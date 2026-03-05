import { authFetch } from "./auth.api.js";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllCategory = async () => {
    console.log("getAllCategory", BASE_URL);
    try {
        const response = await authFetch(`${BASE_URL}/api/Category/get-all-category`);
        const data = await response.json();

        if (data.success) {
            console.log(data.data);
            return data.data;
        }
        return [];
    } catch (error) {
        console.log(error, "<<<<< error");
        return [];
    }
}

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
export { getAllCategory, getSubCategoriesByParent };