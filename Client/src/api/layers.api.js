// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // ==================== CREATE OPERATIONS ====================

// // Create layer (POST) - Single layer
// // ON EDITOR  PAGE ONLY

// // Create layers bulk (POST) - Multiple layers
// // ON EDITOR  PAGE ONLY

// // ==================== READ OPERATIONS ====================
// // Get layers by product ID
// export const getLayersByProductId = async (productId) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${BASE_URL}/api/layers/${productId}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (res.status === 401) {
//       console.error("getLayersByProductId - 401 Unauthorized");
//       // Don't remove token here - let interceptor handle it
//       return { success: false, message: "Unauthorized" };
//     }

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching layers:", error);
//     throw error;
//   }
// };

// // ==================== UPDATE OPERATIONS ====================
// // Update layers (PUT) - Full replacement
// export const updateLayers = async (productId, layers) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ layers })
//     });

//     if (response.status === 401) {
//       console.error("updateLayers - 401 Unauthorized");
//       return { success: false, message: "Unauthorized" };
//     }

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating layers:", error);
//     throw error;
//   }
// };

// // Simple update (PATCH) - Partial update
// export const updateLayersSimple = async (productId, layers) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ layers })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating layers:", error);
//     throw error;
//   }
// };

// // ==================== DELETE OPERATIONS ====================
// // Delete layer by ID
// export const deleteLayer = async (layerId) => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`${BASE_URL}/api/layers/${layerId}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error deleting layer:", error);
//     throw error;
//   }
// };


const BASE_URL = import.meta.env.VITE_BASE_URL;

// ==================== READ OPERATIONS ====================
// Get layers by product ID
export const getLayersByProductId = async (productId, mockupId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/layers/${productId}/${mockupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ 'res' use karo, 'response' nahi
    if (res.status === 401) {
      console.error("getLayersByProductId - 401 Unauthorized");
      return { success: false, message: "Unauthorized" };
    }

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
export const updateLayers = async (productId, mockupId, layers) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/api/layers/${productId}/${mockupId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ layers })
    });

    if (response.status === 401) {
      console.error("updateLayers - 401 Unauthorized");
      return { success: false, message: "Unauthorized" };
    }

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

    if (response.status === 401) {
      console.error("updateLayersSimple - 401 Unauthorized");
      return { success: false, message: "Unauthorized" };
    }

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

    if (response.status === 401) {
      console.error("deleteLayer - 401 Unauthorized");
      return { success: false, message: "Unauthorized" };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting layer:", error);
    throw error;
  }
};