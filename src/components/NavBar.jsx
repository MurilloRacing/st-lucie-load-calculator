import { Link, useLocation } from 'react-router-dom';
import {
  Home as HomeIcon,
  SlidersHorizontal,
  Save,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';

const NavBar = () => {
  const { pathname } = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: <HomeIcon size={18} /> },
    { path: '/calculator', label: 'Calculator', icon: <SlidersHorizontal size={18} /> },
    { path: '/saved-lists', label: 'Saved Lists', icon: <Save size={18} /> },
    { path: '/load-lists', label: 'Templates', icon: <FolderOpen size={18} /> },
    { path: '/admin', label: 'Admin', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <nav className="bg-gray-100 border-b border-gray-300 px-6 py-3 flex justify-center space-x-6">
      {navLinks.map(({ path, label, icon }) => {
        const isActive = pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow'
                : 'text-blue-700 hover:bg-blue-200'
            }`}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
