import { authFetch } from "./auth.api.js";
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Get all print area images
export const getAllPrintAreaImages = async () => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-printarea-images`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        return [];
    } catch (error) {
        console.log(error, "<<< getAllPrintAreaImages error");
        return [];
    }
};

// Upload new print area image
export const uploadPrintAreaImage = async (formData) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/create-printarea-image`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                // Don't set Content-Type for multipart/form-data
            },
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || "Upload failed");
    } catch (error) {
        console.log(error, "<<< uploadPrintAreaImage error");
        throw error;
    }
};

// Update print area image
export const updatePrintAreaImage = async (id, formData) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/upload-printarea-image/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || "Update failed");
    } catch (error) {
        console.log(error, "<<< updatePrintAreaImage error");
        throw error;
    }
};

// Delete print area image
export const deletePrintAreaImage = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/delete-printarea-image/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || "Delete failed");
    } catch (error) {
        console.log(error, "<<< deletePrintAreaImage error");
        throw error;
    }
};

// Get print area image by ID
export const getPrintAreaImageById = async (id) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/get-printarea-image/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.log(error, "<<< getPrintAreaImageById error");
        return null;
    }
};