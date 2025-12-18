import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { menuItems } from './MenuItems';

function Sidebar() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <aside id="sidebar" className="w-1/6 h-screen p-5 bg-white shadow-sm"
    >
      <ul>
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `mb-2  nav-item flex items-center gap-3 p-3 rounded-lg transition-all duration-200
            ${isActive ? "bg-tiger text-white shadow-lg" : "hover:bg-tiger hover:text-white"}`
              }
            >
              {item.icon}
              <span className="text-base font-normal">
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>

  );
}

export default Sidebar;