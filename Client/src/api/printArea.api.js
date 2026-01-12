import { authFetch } from "./product.api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ADD PRINT AREA
export const addPrintArea = async (productId, payload) => {
  try {
    const response = await authFetch(`${BASE_URL}/api/${productId}/print-areas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error, "<<<< addPrintArea error");
  }
};

// UPDATE PRINT AREA
export const updatePrintArea = async (productId, areaId, payload) => {
  try {
    const res = await authFetch(`/api/${productId}/print-areas/${areaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("updatePrintArea error", error);
    return null;
  }
};

// DELETE PRINT AREA
export const deletePrintArea = async (productId, areaId) => {
  try {
    const res = await authFetch(`${BASE_URL}/api/${productId}/print-areas/${areaId}`, {
      method: "DELETE",
      headers: {
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("deletePrintArea error", error);
    return null;
  }
};
