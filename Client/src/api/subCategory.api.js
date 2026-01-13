import { authFetch } from "./product.api";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 🔹 CREATE SUB CATEGORY
const createSubCategory = async ({ name, description, thumbnail, parent }) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description || "");
    formData.append("parent", parent); // categoryId
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await authFetch(
      `${BASE_URL}/api/Category/create-category`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Create sub category error:", error);
    return { success: false };
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

export { createSubCategory ,getSubCategoriesByParent };
