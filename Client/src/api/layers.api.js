const BASE_URL = import.meta.env.VITE_BASE_URL;

// ==================== CREATE OPERATIONS ====================

// Create layer (POST) - Single layer
// ON EDITOR  PAGE ONLY

// Create layers bulk (POST) - Multiple layers
// ON EDITOR  PAGE ONLY

// ==================== READ OPERATIONS ====================
// Get layers by product ID
export const getLayersByProductId = async (productId) => {
  try {
    const res = await fetch(`${BASE_URL}/api/layers/${productId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching layers:", error);
    throw error;
  }
};

// ==================== UPDATE OPERATIONS ====================
// Update layers (PUT) - Full replacement
export const updateLayers = async (productId, layers) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layers })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating layers:", error);
    throw error;
  }
};

// Simple update (PATCH) - Partial update
export const updateLayersSimple = async (productId, layers) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layers })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating layers:", error);
    throw error;
  }
};

// ==================== DELETE OPERATIONS ====================
// Delete layer by ID
export const deleteLayer = async (layerId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/layers/${layerId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting layer:", error);
    throw error;
  }
};