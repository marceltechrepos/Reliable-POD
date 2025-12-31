export const addPrintArea = async (productId, payload) => {

  console.log("addPrintArea ,", productId)
  try {
    const response = await fetch(`/api/${productId}/print-areas`, {
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
    const res = await fetch(`/api/${productId}/print-areas/${areaId}`, {
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
    const res = await fetch(`/api/${productId}/print-areas/${areaId}`, {
      method: "DELETE",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("deletePrintArea error", error);
    return null;
  }
};
