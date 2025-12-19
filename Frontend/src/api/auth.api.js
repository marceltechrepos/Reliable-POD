export const registerAPi = async (payload, setLoading) => {
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
        console.log(data, "<<<< response");
        setLoading(false)

        if (data.success) {
            alert(data.message);
            navigate("/login")
        } else {
            alert(data.message || "something went wrong");
        }

    } catch (error) {
        setLoading(false)
        console.log(error, "<<<< error");
    }
}


export const loginApi = async (payload, setLoading) => {
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
        console.log(data, "<<<< login response");

        if (!data.success) {
            alert(data.message || "invalid credentials");
            setLoading(false);
            return;
        }

        // ✅ save token
        localStorage.setItem("token", data.token);

    } catch (error) {
        console.log(error, "<<<< error");
        alert("server error");
    } finally {
        setLoading(false);
    }
}