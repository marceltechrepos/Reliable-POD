import { authFetch } from "./product.api";

const getAllProvider = async () => {
  try {
    const response = await authFetch("/api/Provider/get-all-provider");
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
    const response = await authFetch("/api/Provider/create-provider", {
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


export {
  getAllProvider,
  createProvider
}