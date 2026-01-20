// src/api/mockupApi.js

import { authFetch } from "./product.api";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getMockups = async () => {
    try {
        const res = await authFetch(`${BASE_URL}/api/get-mockup-image`);
        const json = await res.json();

        if (json.success) {
            return json.data.map(item => ({
                id: item._id,
                url: item.mockupImage.url,
                title: item.name,
                category: 'Uploaded',
                dimensions: '1500 × 1500',
                status: 'uploaded',
            }));
        }

        return [];
    } catch (err) {
        console.error('Failed to load mockups', err);
        return [];
    }
};

export const uploadMockupImage = async (file, categoryId) => {
    const formData = new FormData();
    formData.append("mockupImage", file);
    formData.append("name", file.name);

    // ✅ Pass valid ObjectId for category
    formData.append("category", categoryId);

    formData.append("size", Math.round(file.size / 1024));

    try {
        const res = await authFetch(`${BASE_URL}/api/create-mockup-image`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Server error:", text);
            return null;
        }

        return await res.json();
    } catch (error) {
        console.error("Upload failed", error);
        return null;
    }
};


export const deleteMockupImage = async (id) => {
    try {
        const res = await authFetch(`${BASE_URL}/api/delete-mockup-image/${id}`, {
            method: "DELETE",
        })

        if (!res.ok) {
            const text = await res.text();
            console.error("SERVER ERROR", text)
            return {
                success: false,
                message: `Server error: ${res.status}`
            };
        }
        return await res.json();
    } catch (error) {
        console.error("Network error:", error);
        return {
            success: false,
            message: "Network error occurred"
        };
    }
}