import React from 'react'
import { Link } from 'react-router-dom';

function Signup() {
    const SubmitHandler = (e) => {
        e.preventDefault();
    }
    return (
        <div className="sigup-container flex items-center justify-center h-screen">
            <div className="w-lg bg-white shadow-xl p-10 rounded-lg border-s-5 border-tiger border-solid">
                <div className="mb-5 pb-3 border-b border-silver">
                    <h1 className="text-4xl font-semibold leading-15 mb-2">Signup Form</h1>
                    <p>Lorem ipsum dolor sit amet,  tenetur! Architecto tempore veritatis corrupti fugit.</p>
                </div>
                <form className="signup-fields" onSubmit={SubmitHandler}>
                    <div className="flex gap-2">
                        <div className="mb-3 w-1/2">
                            <label 
                                className="block mb-2 text-sm font-medium" 
                                htmlFor="firstName">
                                First Name
                            </label>
                            <input 
                                type="text" 
                                name="firstName" 
                                className="block w-full border border-silver border-solid rounded-sm p-2" 
                                id="firstName" 
                            />
                        </div>
                        <div className="mb-3 w-1/2">
                        <label 
                            className="block mb-2 text-sm font-medium"
                            htmlFor="lastName"
                        >
                            Last Name
                        </label>
                        <input 
                            type="text" 
                            name="lastName"
                            className="block w-full border border-silver border-solid rounded-sm p-2" 
                            id="lastName" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label 
                        className="block mb-2 text-sm font-medium"
                        htmlFor="userEmail"
                        >
                        Email
                        </label>
                        <input 
                        type="email" 
                        name="userEmail"
                        className="block w-full border border-silver border-solid rounded-sm p-2" 
                        id="userEmail" 
                        />
                    </div>
                    <div className="mb-3">
                        <label 
                        className="block mb-2 text-sm font-medium"
                        htmlFor="userPhoneNum"
                        >
                        Phone Number
                        </label>
                        <input 
                        type="number" 
                        name="userPhoneNum"
                        className="block w-full border border-silver border-solid rounded-sm p-2" 
                        id="userPhoneNum" 
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="mb-3 w-1/2">
                        <label 
                            className="block mb-2 text-sm font-medium"
                            htmlFor="userPassword"
                        >
                            Password
                        </label>
                        <input 
                            type="password" 
                            name="userPassword"
                            className="block w-full border border-silver border-solid rounded-sm p-2" 
                            id="userPassword" 
                        />
                        </div>
                        <div className="mb-5 w-1/2">
                        <label 
                            className="block mb-2 text-sm font-medium"
                            htmlFor="userCPassword"
                        >
                            Confrim Password
                        </label>
                        <input 
                            type="password" 
                            name="userCPassword"
                            className="block w-full border border-silver border-solid rounded-sm p-2" 
                            id="userCPassword" 
                        />
                        </div>
                    </div>
                    <div className="text-center">
                        <input 
                        type="submit" 
                        className="bg-tiger hover:bg-hoverTiger text-white py-3 px-20 rounded-full cursor-pointer" 
                        id="signupBtn" 
                        value="Sign up" 
                        />
                    </div>
                </form>
                <div className='flex items-center justify-center gap-1 mt-5'>
                    <p>Already Account?</p>
                     <Link to="/login" className="text-tiger hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

export default Signup