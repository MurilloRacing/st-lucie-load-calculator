import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  SlidersHorizontal,
  Save,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';

const NavBar = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calculator', label: 'Calculator', icon: SlidersHorizontal },
    { path: '/saved-lists', label: 'Saved Lists', icon: Save },
    { path: '/load-lists', label: 'Templates', icon: FolderOpen },
    { path: '/admin', label: 'Admin', icon: ShieldCheck },
  ];

  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center h-auto py-4">
          <ul className="flex flex-col gap-y-2 list-none p-0 m-0 w-full max-w-xs">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isActive = pathname === path;
              return (
                <li key={path} className="w-full">
                  <Link
                    to={path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`
                      inline-flex items-center w-full gap-3 px-4 py-2 rounded-md
                      text-sm font-medium transition-all duration-150
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${isActive
                        ? 'bg-blue-600 text-white shadow-md focus:ring-blue-500'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:ring-gray-500'
                      }
                    `}
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
