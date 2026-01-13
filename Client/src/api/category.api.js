import { authFetch } from "./product.api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
}


const createCategory = async (payload) => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Category/create-category`, {
      method: 'POST',
      body: payload, // FormData
    });

    const data = await response.json();
    console.log('Create category response:', data);
    return data;
  } catch (error) {
    console.error('Create category error:', error);
    return { success: false };
  }
};

const updateCategory = async (id, payload) => {
  try {
    const response = await authFetch(
      `${BASE_URL}/api/Category/update-category/${id}`,
      {
        method: "PUT",
        body: payload,
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false };
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await authFetch(
      `${BASE_URL}/api/Category/delete-category/${id}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false };
  }
};

const getCategoryDropdown = async () => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Category/get-category-dropdown`);
    const data = await response.json();
    if (data.success) return data.data;
    return [];
  } catch (err) {
    console.error("getCategoryDropdown error:", err);
    return [];
  }
};


export {
  getAllCategory, createCategory, updateCategory,
  deleteCategory,getCategoryDropdown
};
