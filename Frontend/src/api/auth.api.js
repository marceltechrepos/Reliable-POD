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