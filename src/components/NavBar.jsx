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
        <div className="flex flex-wrap justify-center gap-4 py-4">
          {navLinks.map(({ path, label, icon: Icon }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={path}
                to={path}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isActive
                    ? 'bg-blue-600 text-white shadow focus:ring-blue-500'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 focus:ring-gray-500'
                  }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
