export const addPrintArea = async (productId, payload) => {

    console.log("addPrintArea ," ,productId )
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
