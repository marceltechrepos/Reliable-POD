
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {menuItems} from "./MenuItems"

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  useEffect(() => {
    onClose(); // auto-close on route change (mobile UX)
  }, [location.pathname]);

  return (
    <>
      {/* Overlay → xs + sm */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* <aside
        className={`
    fixed md:static
    top-0 left-0 z-50
    h-auto
    w-[260px] lg:w-[280px] xl:w-[300px]
    bg-white shadow-md
    pt-14 sm:pt-16 md:pt-0
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      > */}

      <aside
        className={`
    fixed md:static
    top-14 sm:top-16 md:top-0
    bottom-0
    left-0 z-40
    w-[260px] lg:w-[280px] xl:w-[300px]
    bg-white shadow-md
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  `}
      >


        <div className="p-5 overflow-y-auto h-full">
          <ul className="lg:mt-15">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    ` mb-2 flex items-center gap-3 p-3 rounded-lg transition-all
                    ${isActive
                      ? "bg-tiger text-white shadow-md"
                      : "hover:bg-tiger hover:text-white"
                    }`
                  }
                >
                  {item.icon}
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;