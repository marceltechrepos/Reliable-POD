// const BASE_URL = import.meta.env.VITE_BASE_URL;
// import { authFetch } from "./product.api";


// const createLayer = async (productId, payload) => {
//     try {
//         const token = localStorage.getItem("token");
//         const res = await fetch(`${BASE_URL}/api/layers`, {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify(payload)
//         })
//     } catch (error) {
//         console.log(error)
//     }
// }

// const getLayersByProductId = async (productId) => {
//     try {
//         const res = await fetch(`${BASE_URL}/api/layers/${productId}`);

//         return await res.json()
//     } catch (error) {
//         console.log("Error fetching layers:", error);
//         throw error;
//     }
// }

// // layers.api.js mein add karo
// // export const updateLayers = async (productId, layersData) => {
// //   try {
// //     const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
// //       method: "PUT",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ layers: layersData })
// //     });
// //     return await response.json();
// //   } catch (error) {
// //     console.error("Error updating layers:", error);
// //     throw error;
// //   }
// // };
//  const updateLayers = async (productId, layersData) => {
//     try {
//         const response = await fetch(`${BASE_URL}/layers/${productId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ layers: layersData })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("Error updating layers:", error);
//         throw error;
//     }
// };

// export const createOrUpdateLayers = async (productId, layersData) => {
//     try {
//         // Try update first
//         return await updateLayers(productId, layersData);
//     } catch (updateError) {
//         console.log("Update failed, trying create:", updateError);
//         // Fallback to create
//         return await createLayer(productId, layersData);
//     }
// };

//  const updateLayersSimple = async (productId, layersData) => {
//     try {
//         const response = await fetch(`${BASE_URL}/api/layers/${productId}`, {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ layers: layersData })
//         });
//         return await response.json();
//     } catch (error) {
//         console.error("Error updating layers:", error);
//         throw error;
//     }
// };

// export {
//     createLayer,
//     getLayersByProductId,
//     updateLayersSimple,
//     updateLayers
// }




// // layers.api.js
// const BASE_URL = import.meta.env.VITE_BASE_URL;

// // Create layer (POST)
// export const createLayer = async (productId, layers) => {
//   try {
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${BASE_URL}/api/layers`, {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ productId, layers })
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error("Error creating layers:", error);
//     throw error;
//   }
// };

// // Get layers by product ID
// export const getLayersByProductId = async (productId) => {
//   try {
//     const res = await fetch(`${BASE_URL}/api/layers/${productId}`);

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }
//     console.log("LAYERS", res);
//     return await res.json();
//   } catch (error) {
//     console.error("Error fetching layers:", error);
//     throw error;
//   }
// };

// // Update layers (PUT)
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

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating layers:", error);
//     throw error;
//   }
// };

// // Simple update (PATCH)
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



// layers.api.js
const BASE_URL = import.meta.env.VITE_BASE_URL;

// ==================== CREATE OPERATIONS ====================
// Create layer (POST) - Single layer
export const createLayer = async (productId, layers) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/layers`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, layers })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating layers:", error);
    throw error;
  }
};

// Create layers bulk (POST) - Multiple layers
export const createLayers = async (productId, layers) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/api/layers`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, layers })
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error creating layers:", error);
    throw error;
  }
};

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