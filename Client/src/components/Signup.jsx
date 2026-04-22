import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { registerAPi } from '../api/auth.api';
import {toast} from "react-toastify"

function Signup() {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()



    const SubmitHandler = async (e) => {
        e.preventDefault();

        if (
            firstName.trim() === "" ||
            lastName.trim() === "" ||
            email.trim() === "" ||
            phoneNumber.trim() === "" ||
            password.trim() === "" ||
            confirmPassword.trim() === ""
        ) {
            toast.info("all fields are required");
            return;
        }

        if (password.length < 6) {
            toast.info("password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("password do not match");
            return;
        }

        const payload = {
            firstName,
            lastName,
            email,
            phoneNumber,
            UpdatedEmail: updatedEmail,
            password,
            confirmPassword,
        }

        registerAPi(payload, setLoading, navigate);
    };

    return (
        <div className="signup-container min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md sm:max-w-2xl bg-white shadow-xl p-6 sm:p-10 rounded-lg border-l-4 border-tiger">

                <div className="mb-5 pb-3 border-b border-silver">
                    <h1 className="text-2xl sm:text-4xl font-semibold mb-2">
                        Signup Form
                    </h1>
                </div>

                <form onSubmit={SubmitHandler}>

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full border border-silver rounded-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full border border-silver rounded-sm p-2"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-silver rounded-sm p-2"
                        />
                    </div>

                    {/* Email Updates Checkbox */}
                    <div className="mt-3 flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="updatedEmail"
                            checked={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.checked)}
                            className="cursor-pointer"
                        />
                        <label htmlFor="updatedEmail" className="text-sm cursor-pointer">
                            I want to receive updates via email
                        </label>
                    </div>

                    {/* Phone */}
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium">Phone Number</label>
                        <input
                            type="number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full border border-silver rounded-sm p-2"
                        />
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-silver rounded-sm p-2"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-silver rounded-sm p-2"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-6 text-center">

                        <button
                            type="submit"
                            className="cursor-pointer w-full sm:w-auto bg-tiger text-white py-3 px-16 rounded-full"
                        >
                            {loading ? "Loading" : "SignUp"}
                        </button>
                    </div>
                </form>

                <div className="flex justify-center gap-1 mt-5 text-sm">
                    <p>Already have an account?</p>
                    <Link to="/" className="text-tiger hover:underline">
                        Sign in
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Signup;
