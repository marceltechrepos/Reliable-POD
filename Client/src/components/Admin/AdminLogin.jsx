// components/Admin/AdminLogin.js
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from '../../api/auth.api';
import { toast } from 'react-toastify';

const BRAND = {
    primary: "#3b6d92",
    secondary: "#f05a28",
    dark: "#747474",
    light: "#bfbfbf",
};

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const SubmitHandler = async (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            toast.error("All fields are required");
            return;
        }

        const payload = { email, password };
        loginApi(payload, setLoading, navigate);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#f1f5f9]">
            <div className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl p-8 sm:p-12 rounded-lg border-l-4" style={{ borderColor: BRAND.secondary }}>

                {/* Header */}
                <div className="mb-6 pb-4 border-b" style={{ borderColor: BRAND.light, textAlign: 'center' }}>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: BRAND.primary }}>
                        Admin Login
                    </h1>
                    <p className="text-sm" style={{ color: BRAND.dark }}>
                        Sign in to access the admin panel.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={SubmitHandler}>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium" style={{ color: BRAND.dark }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="block w-full rounded-md p-3 text-sm transition"
                            style={{
                                border: `1px solid ${BRAND.light}`,
                                outline: "none",
                            }}
                            onFocus={(e) => e.target.style.borderColor = BRAND.primary}
                            onBlur={(e) => e.target.style.borderColor = BRAND.light}
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium" style={{ color: BRAND.dark }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="block w-full rounded-md p-3 text-sm transition"
                            style={{
                                border: `1px solid ${BRAND.light}`,
                                outline: "none",
                            }}
                            onFocus={(e) => e.target.style.borderColor = BRAND.primary}
                            onBlur={(e) => e.target.style.borderColor = BRAND.light}
                        />
                    </div>

                    {/* Button */}
                    <div className="mb-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full text-white py-3 rounded-md text-lg font-semibold transition-all"
                            style={{
                                backgroundColor: loading ? BRAND.light : BRAND.primary,
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = BRAND.secondary)}
                            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = BRAND.primary)}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}

export default AdminLogin;