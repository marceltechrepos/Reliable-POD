import React, { useState } from "react";
// import logo from "../../public/expressPODLogo.png"; 

function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#81430085] shadow-lg px-6 py-3 flex items-center justify-between">

      {/* Left: Logo */}
      <div className="flex items-center">
        <img
          // src={logo}
          alt="ExpressPOD"
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg outline-none text-sm  focus:ring-2 border border-white focus:ring-amber-600 text-white placeholder:text-white"
        />
      </div>

      {/* Right: Profile */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg text-white"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="text-sm font-medium">Admin</span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden">
            <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => console.log("Logout")}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
