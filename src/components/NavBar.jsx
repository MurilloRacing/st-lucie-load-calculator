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
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 overflow-x-auto">
      <ul className="flex flex-wrap justify-center gap-x-4 sm:gap-x-6 whitespace-nowrap text-sm font-medium">
        {navLinks.map(({ path, label, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <li key={path}>
              <Link
                to={path}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavBar;
