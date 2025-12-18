import React from 'react'
import { Link } from "react-router-dom";

 
function Signin() {
    const SubmitHandler = (e) => {
        e.preventDefault();
    }
    return (
        <div className="sigup-container flex items-center justify-center h-screen">
            <div className="w-lg bg-white shadow-xl p-10 rounded-lg border-s-5 border-tiger border-solid">
                <div className="mb-5 pb-3 border-b border-silver">
                    <h1 className="text-4xl font-semibold leading-15 mb-2">Sign in Form</h1>
                    <p>Lorem ipsum dolor sit amet,  tenetur! Architecto tempore veritatis corrupti fugit.</p>
                </div>
                <form className="signup-fields" onSubmit={SubmitHandler}>
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

                    <div className="mb-5 text-center">
                        <input 
                        type="submit" 
                        className="bg-tiger hover:bg-hoverTiger text-white py-3 px-20 rounded-full cursor-pointer" 
                        id="signinBtn" 
                        value="Sign in" 
                        />
                    </div>
                </form>
                <div className='flex items-center justify-center gap-1'>
                    <p>Create New Account?</p>
                     <Link to="/signup" className="text-tiger hover:underline">Sign up</Link>
                </div>
            </div>
        </div>
    )
}

export default Signin