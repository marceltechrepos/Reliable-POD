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


export {
  getAllCategory, createCategory, updateCategory,
  deleteCategory,
};
