export const registerAPi = async (payload, setLoading, navigate) => {
    try {
        setLoading(true)
        const res = await fetch("/api/User/CreateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        setLoading(false)

        if (data.success === true) {
            alert(data.message);
            navigate("/")
        } else {
            alert(data.message || "something went wrong");
        }

    } catch (error) {
        setLoading(false)
        console.log(error, "<<<< error");
    }
}


export const loginApi = async (payload, setLoading , navigate) => {
    try {
        setLoading(true);

        const res = await fetch("/api/User/Login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "invalid credentials");
            setLoading(false);
            return;
        } else {
            alert(data.message)
            localStorage.setItem("token", data.token);
            setLoading(false);
            navigate("/admin/dashboard")
        }

        // ✅ save token

    } catch (error) {
        console.log(error, "<<<< error");
        alert("server error");
    } finally {
        setLoading(false);
    }
}

// User Info Update API (FormData)
// export const userInfoApi = async (formData) => {
//     try {
//         const token = localStorage.getItem("token"); // token required
//         if (!token) throw new Error("User not authenticated");

//         const res = await fetch("/api/User/Update", {
//             method: "POST", // ya PUT depending on backend
//             headers: {
//                 "Authorization": `Bearer ${token}`, // JWT token
//                 // "Content-Type": multipart/form-data nahi lagana, browser automatically set karega
//             },
//             body: formData, // FormData object
//         });

//         const data = await res.json();

//         if (!data.success) {
//             alert(data.message || "Failed to update user info");
//             return null;
//         }

//         // update localStorage
//         localStorage.setItem("user", JSON.stringify(data.user));

//         alert(data.message || "User info updated successfully");
//         return data.user;

//     } catch (error) {
//         console.error(error);
//         alert("Server error");
//         return null;
//     }
// };

export const userInfoApi = async (payload, setLoading) => {
    try {
        setLoading(true);

        const formData = new FormData();

        // loop through payload keys
        for (const key in payload) {
            if (payload[key] !== null && payload[key] !== undefined) {
                if (key === "profileImage") {
                    formData.append("profileImage", payload[key]); // file object
                } else {
                    formData.append(key, payload[key]);
                }
            }
        }

        const token = localStorage.getItem("token");

        const res = await fetch("/api/User/AddUserInfo", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, // token required
            },
            body: formData,
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.message || "Failed to update user info");
            return null;
        }

        alert(data.message || "User info updated successfully");
        return data.user;

    } catch (error) {
        console.log(error);
        alert("Server error");
        return null;
    } finally {
        setLoading(false);
    }
};
