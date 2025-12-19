// import React from 'react'
// import { Link, useNavigate } from "react-router-dom";

// function Signin() {
//     const navigate = useNavigate();

//     const SubmitHandler = (e) => {
//         e.preventDefault();
//         try {
//             localStorage.setItem("token", "LORaA LEhSUN");
//             navigate('/admin/dashboard');
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     return (
//         <div className="signup-container min-h-screen flex items-center justify-center px-4 bg-gray-50">
//             <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl p-6 sm:p-10 rounded-lg border-l-4 border-tiger">

//                 {/* Header */}
//                 <div className="mb-5 pb-3 border-b border-silver text-center sm:text-left">
//                     <h1 className="text-2xl sm:text-4xl font-semibold mb-2">
//                         Sign in Form
//                     </h1>
//                     <p className="text-sm sm:text-base text-gray-600">
//                         Lorem ipsum dolor sit amet, tenetur! Architecto tempore veritatis corrupti fugit.
//                     </p>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={SubmitHandler}>
//                     <div className="mb-4">
//                         <label
//                             className="block mb-2 text-sm font-medium"
//                             htmlFor="userEmail"
//                         >
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="userEmail"
//                             name="userEmail"
//                             className="block w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label
//                             className="block mb-2 text-sm font-medium"
//                             htmlFor="userPassword"
//                         >
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             id="userPassword"
//                             name="userPassword"
//                             className="block w-full border border-silver rounded-sm p-2 focus:outline-none focus:ring-2 focus:ring-tiger"
//                         />
//                     </div>

//                     <div className="mb-5">
//                         <button
//                             type="submit"
//                             className="w-full sm:w-auto bg-tiger hover:bg-hoverTiger text-white py-3 px-16 rounded-full transition-all"
//                         >
//                             Sign in
//                         </button>
//                     </div>
//                 </form>

//                 {/* Footer */}
//                 <div className="flex flex-wrap items-center justify-center gap-1 text-sm">
//                     <p>Create New Account?</p>
//                     <Link to="/signup" className="text-tiger hover:underline">
//                         Sign up
//                     </Link>
//                 </div>

//             </div>
//         </div>
//     );
// }

// export default Signin;




import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from '../api/auth.api';

function Signin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const SubmitHandler = async (e) => {
        e.preventDefault();

        if (email.trim() === "" || password.trim() === "") {
            alert("all fields are required");
            return;
        }

        const payload = {
            email,
            password,
        }

        loginApi(payload , setLoading)

    };

    return (
        <div className="signup-container min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md sm:max-w-lg bg-white shadow-xl p-6 sm:p-10 rounded-lg border-l-4 border-tiger">

                {/* Header */}
                <div className="mb-5 pb-3 border-b border-silver">
                    <h1 className="text-2xl sm:text-4xl font-semibold mb-2">
                        Sign in Form
                    </h1>
                    <p className="text-sm text-gray-600">
                        Welcome back! Please login to continue.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={SubmitHandler}>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full border border-silver rounded-sm p-2 focus:ring-2 focus:ring-tiger"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full border border-silver rounded-sm p-2 focus:ring-2 focus:ring-tiger"
                        />
                    </div>

                    {/* Button */}
                    <div className="mb-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full sm:w-auto text-white py-3 px-16 rounded-full transition-all
                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-tiger hover:bg-hoverTiger"}
                            `}
                        >
                            {loading ? "signing in..." : "sign in"}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex justify-center gap-1 text-sm">
                    <p>Create New Account?</p>
                    <Link to="/signup" className="text-tiger hover:underline">
                        Sign up
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Signin;
