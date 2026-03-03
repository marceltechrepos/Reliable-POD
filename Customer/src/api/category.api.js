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

export { getAllCategory, getSubCategoriesByParent };