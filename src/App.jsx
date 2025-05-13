import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Calculator from './components/Calculator'; // Existing live version

// Phase 2 placeholder imports – create these in components folder for now
import NewCalculator from './components/NewCalculator'; // Make this soon
import SavedLists from './components/SavedLists';       // Make this soon
import Admin from './components/Admin';                 // Optional admin

import './index.css';

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/new" element={<NewCalculator />} />
        <Route path="/saved-lists" element={<SavedLists />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <div className="container mx-auto p-6 text-center">
              <h1 className="text-2xl font-bold">404 – Page Not Found</h1>
              <a href="/" className="text-blue-600 underline mt-4 inline-block">
                Go to Home
              </a>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
