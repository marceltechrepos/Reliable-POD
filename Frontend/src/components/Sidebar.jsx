import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    <aside id='sidebar' className='w-1/6 h-screen p-5 bg-white shadow-sm'>
      <ul>
        {menuItems.map((item, index) => (
          <li 
            key={index}
            onClick={() => handleItemClick(index)}
            className={`py-3 px-4 mb-2 nav-item cursor-pointer transition-all duration-200 hover:bg-tiger hover:text-white rounded-lg ${
              index === activeIndex ? 'active-list-item bg-tiger shadow-lg text-white' : ''
            }`}
          >
            <Link to={item.path} className='flex items-center gap-3'>
              {item.icon}
              <span 
                className={`text-base font-normal ${index === activeIndex ? 'font-medium' : 'text-base/normal'}`}>
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;