import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Calculator from './components/Calculator';         // Existing calculator

import NewCalculator from './components/NewCalculator';   // Modular version
import SavedLists from './components/SavedLists';         // Saved estimates
import LoadListTemplates from './components/LoadListTemplates'; // NEW: Load List Template Manager
import Admin from './components/Admin';                   // Optional admin view

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
        <Route path="/load-lists" element={<LoadListTemplates />} />
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

