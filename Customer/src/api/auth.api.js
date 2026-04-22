const BASE_URL = import.meta.env.VITE_BASE_URL;
import { toast } from 'react-toastify';

export const registerAPi = async (payload, setLoading, navigate) => {
    try {
        setLoading(true)
        const res = await fetch(`${BASE_URL}/api/User/CreateUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        setLoading(false)

        if (data.success === true) {
            toast.success(data.message);
            navigate("/")
        } else {
            toast.error(data.message || "something went wrong");
        }

    } catch (error) {
        setLoading(false)
        console.log(error, "<<<< error");
    }
}


export const loginApi = async (payload, setLoading, navigate) => {
    try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/User/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
            toast.error(data.message || "invalid credentials");
            setLoading(false);
            return;
        } else {
            toast.success(data.message)
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setLoading(false);
            navigate("/user/dashboard")
        }

        // ✅ save token

    } catch (error) {
        console.log(error, "<<<< error");
        toast.error("server error");
    } finally {
        setLoading(false);
    }
}


export const userInfoApi = async (payload, setLoading, profileImageFile) => {
    try {
        setLoading(true);

        const formData = new FormData();

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }
        for (const key in payload) {
            if (payload[key] !== null && payload[key] !== undefined) {

                if (key === "profileImage") {
                    if (payload[key] instanceof File) {
                        formData.append("profileImage", payload[key]);
                    } else {
                        formData.append("profileImage", payload[key].url);
                    }
                }

                else if (typeof payload[key] === "boolean") {
                    formData.append(key, payload[key].toString());
                }

                else {
                    formData.append(key, payload[key]);
                }
            }
        }

        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/api/User/AddUserInfo`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // token required
            },
            body: formData,
        });

        const data = await res.json();

        if (!data.success) {
            toast.error(data.message || "Failed to update user info");
            return null;
        }

        toast.success(data.message || "User info updated successfully");
        return data.user;

    } catch (error) {
        console.log(error);
        toast.error("Server error");
        return null;
    } finally {
        setLoading(false);
    }
};


export const getUserDetail = async (setLoading = () => { }) => {
    try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("no token in localStorage");
            setLoading(false);
            return null;
        }

        const res = await fetch(`${BASE_URL}/api/User/getUserDetail`, {
            headers: {
                Authorization: `Bearer ${token}`,

            },

        });

        const data = await res.json();

        if (!data || !data.success) {
            console.error("getUserDetail failed:", data);

            return null;
        }

        return data.user || null;
    } catch (err) {
        console.error("getUserDetail error:", err);
        return null;
    } finally {
        setLoading(false);
    }
};



export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("token");

    return fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
};