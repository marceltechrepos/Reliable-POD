import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();

  // const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  const pathSegments = location.pathname
    .split('/')
    .filter(segment => segment !== '' && segment !== 'admin');

  const newPath = '/' + pathSegments.join('/');
  const breadcrumbs = [
    { name: 'Home', path: '/admin/dashboard' },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { name, path };
    })
  ];

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-500 font-medium">
                {crumb.name}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-gray-700 hover:text-blue-600"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;