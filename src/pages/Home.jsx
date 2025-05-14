import { Link } from 'react-router-dom';

const NavButton = ({ to, color, hoverColor, icon, children }) => (
  <Link
    to={to}
    className={`
      flex items-center justify-center gap-3 py-3 px-6 rounded-lg
      ${color} text-white font-medium
      transform transition-all duration-200
      hover:${hoverColor} hover:scale-[1.02]
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}
      w-full
    `}
  >
    <span className="text-xl" aria-hidden="true">{icon}</span>
    <span className="flex-1">{children}</span>
  </Link>
);

const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        📊 P1 Load Calculator
      </h1>
      
      <p className="mb-8 text-gray-600 text-center leading-relaxed">
        Use this app to estimate power requirements for P1 Motor Club's new commercial spaces. 
        Select, modify, or create custom electrical load templates for equipment and devices 
        to determine the necessary panel and power infrastructure.
      </p>

      <div className="space-y-4">
        <NavButton 
          to="/calculator" 
          color="bg-blue-600" 
          hoverColor="bg-blue-700" 
          icon="⚙️"
        >
          Start New Calculation
        </NavButton>

        <NavButton 
          to="/saved-lists" 
          color="bg-green-600" 
          hoverColor="bg-green-700" 
          icon="💾"
        >
          View Saved Lists
        </NavButton>

        <NavButton 
          to="/load-lists" 
          color="bg-purple-600" 
          hoverColor="bg-purple-700" 
          icon="📂"
        >
          View Load Templates
        </NavButton>

        <NavButton 
          to="/admin" 
          color="bg-gray-800" 
          hoverColor="bg-gray-900" 
          icon="🔐"
        >
          Admin Tools
        </NavButton>
      </div>
    </div>
  </div>
);

export default Home;
