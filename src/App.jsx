import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Calculator from './components/Calculator';
import './index.css';

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="*" element={<div className="container mx-auto p-6"><h1>404 - Page Not Found</h1><a href="/" className="text-blue-500">Go to Home</a></div>} />
      </Routes>
    </div>
  );
}

export default App;
