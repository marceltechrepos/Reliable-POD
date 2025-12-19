import React from 'react'
import { Link } from 'react-router-dom';

function Signup() {
    const SubmitHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div className="signup-container min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md sm:max-w-2xl bg-white shadow-xl p-6 sm:p-10 rounded-lg border-l-4 border-tiger">

                {/* Header */}
                <div className="mb-5 pb-3 border-b border-silver text-center sm:text-left">
                    <h1 className="text-2xl sm:text-4xl font-semibold mb-2">
                        Signup Form
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Lorem ipsum dolor sit amet, tenetur! Architecto tempore veritatis corrupti fugit.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={SubmitHandler}>

                    {/* Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                First Name
                            </label>
                            <input
                                type="text"
                                className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Last Name
                            </label>
                            <input
                                type="text"
                                className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                        />
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="mt-6 text-center">
                        <button
                            type="submit"
                            className="w-full sm:w-auto bg-tiger hover:bg-hoverTiger text-white py-3 px-16 rounded-full transition-all"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-center gap-1 mt-5 text-sm">
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
