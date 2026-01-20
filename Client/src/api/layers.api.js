const BASE_URL = import.meta.env.VITE_BASE_URL;
import { authFetch } from "./product.api";


const createLayer = async (productId, payload) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/layers`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload)
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    createLayer
}
