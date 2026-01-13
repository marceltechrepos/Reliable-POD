import { authFetch } from "./product.api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAllProvider = async () => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Provider/get-all-provider`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    }
    return []; // fallback agar success false ho
  } catch (error) {
    console.log(error, "<<<<< error");
    return []; // fallback agar fetch fail ho
  }
}


const createProvider = async (payload) => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Provider/create-provider`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};


// ---------- NEW: Update Provider ----------
const updateProvider = async (id, payload) => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Provider/update-provider/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Update provider error:", error);
    return { success: false };
  }
};

// ---------- NEW: Delete Provider ----------
const deleteProvider = async (id) => {
  try {
    const response = await authFetch(`${BASE_URL}/api/Provider/delete-provider/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Delete provider error:", error);
    return { success: false };
  }
};

export {
  getAllProvider,
  createProvider,
  updateProvider,
  deleteProvider,
}