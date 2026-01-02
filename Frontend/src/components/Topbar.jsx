import React, { useState } from "react";
import logo from "/POD-logo.png";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Topbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login")
  };

  const profile = () => {
    navigate("/admin/settings")
  }


  return (
    <header className="  bg-ocean shadow-lg
  h-14 sm:h-16
  px-3 sm:px-4 md:px-6
  flex items-center justify-between
  w-full
  fixed top-0 left-0 z-50">

      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Menu Button → ONLY xs + sm */}
        <button
          className="md:hidden text-white"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <img
          src={logo}
          alt="ExpressPOD"
          className="h-7 sm:h-8 md:h-9 w-auto object-contain bg-white px-1 rounded"
        />
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4">
        <input
          type="text"
          placeholder="Search..."
          className="
            w-full px-4 py-2 rounded-lg text-sm
            outline-none
            border border-white/60
            bg-transparent text-white placeholder:text-white/70
            focus:ring-2 focus:ring-amber-600
          "
        />
      </div>

      {/* Profile */}
      <div className="relative ">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 bg-white/20 px-2 sm:px-3 py-1.5 rounded-lg text-white cursor-pointer"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <span className="hidden sm:block text-sm font-medium">
            Admin
          </span>
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50">
            <button onClick={profile} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer">
              Profile
            </button>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
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
