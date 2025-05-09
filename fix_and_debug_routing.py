import os

# Define main directory
MAIN_DIR = r"C:\Users\Ken Murillo\Documents\P1_East_Paddock_Garage_01\st_lucie_load_calculator"
SRC_DIR = os.path.join(MAIN_DIR, "src")

# Ensure src and src/components directories exist
print("Ensuring src and src/components directories exist...")
os.makedirs(os.path.join(SRC_DIR, "components"), exist_ok=True)

# Define updated file contents (from debug_routing.bat)
files = {
    "main.jsx": """import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
""",
    "App.jsx": """import { Routes, Route, useLocation } from 'react-router-dom';
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
""",
    "components/Home.jsx": """import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <nav className="mb-6">
        <Link to="/" className="text-blue-500 mr-4 hover:underline">Home</Link>
        <Link to="/calculator" className="text-blue-500 hover:underline">Calculator</Link>
      </nav>
      <h1 className="text-3xl font-bold text-center mb-6">Welcome to St. Lucie Auto Facility</h1>
      <p className="text-center mb-4">This application helps you manage and calculate electrical loads for your facility.</p>
      <div className="flex justify-center">
        <Link to="/calculator" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Electrical Load Calculator
        </Link>
      </div>
    </div>
  );
}

export default Home;
""",
    "components/Calculator.jsx": """import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadList from './LoadList';
import Results from './Results';
import LoadModal from './LoadModal';

const initialLoads = [
  { id: 1, name: "Lighting", power: 7500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 2, name: "Lifts (x2)", power: 6000, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 3, name: "Compressor", power: 5600, voltage: 208, type: "Non-Continuous", isMotor: true },
  { id: 4, name: "2000 PSI Electric Power Washer", power: 1500, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 5, name: "Security Systems", power: 500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 6, name: "Battery Backup for Security", power: 300, voltage: 120, type: "Continuous", isMotor: false },
  { id: 7, name: "Electric Car Charging", power: 7000, voltage: 208, type: "Continuous", isMotor: false },
  { id: 8, name: "Welder", power: 7500, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 9, name: "Washer and Dryer", power: 6500, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 10, name: "Heat Pump Water Heater", power: 4000, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 11, name: "HVAC Climate Control", power: 22500, voltage: 208, type: "Continuous", isMotor: false },
  { id: 12, name: "Office Space", power: 1500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 13, name: "Racing Simulators (x2)", power: 2000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 14, name: "Large Plug-In Cooling Fans (x2)", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 15, name: "Extra Outlets for Displays/Catering", power: 1800, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 16, name: "Exhaust Fans (x2)", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 17, name: "Shop Vacuums (x2)", power: 2000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 18, name: "Paint Booth", power: 12000, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 19, name: "Employee Amenities (Break Room)", power: 2000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 20, name: "Exterior Lighting", power: 1000, voltage: 120, type: "Continuous", isMotor: false },
  { id: 21, name: "IT Infrastructure", power: 1000, voltage: 120, type: "Continuous", isMotor: false },
  { id: 22, name: "Emergency Lighting", power: 500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 23, name: "Tool Charging Stations", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 24, name: "Electric Forklift Charger", power: 5000, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 25, name: "Dust Collection System", power: 2000, voltage: 208, type: "Non-Continuous", isMotor: false },
  { id: 26, name: "Electric Gate/Door Operators", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 27, name: "Water Treatment System", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 28, name: "Vending Machines", power: 1000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 29, name: "Signage Lighting", power: 500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 30, name: "Electric Vehicle Diagnostic Equipment", power: 2000, voltage: 120, type: "Non-Continuous", isMotor: false },
  { id: 31, name: "Energy Management System", power: 500, voltage: 120, type: "Continuous", isMotor: false },
  { id: 32, name: "Temporary Event Equipment", power: 5000, voltage: 120, type: "Non-Continuous", isMotor: false }
];

function Calculator() {
  const [loads, setLoads] = useState(initialLoads);
  const [selectedLoads, setSelectedLoads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState(null);

  const addLoad = (newLoad) => {
    setLoads([...loads, { ...newLoad, id: loads.length + 1 }]);
  };

  const updateLoad = (updatedLoad) => {
    setLoads(loads.map(load => load.id === updatedLoad.id ? updatedLoad : load));
    setSelectedLoads(selectedLoads.map(id => id === updatedLoad.id ? updatedLoad.id : id));
  };

  const deleteLoad = (id) => {
    setLoads(loads.filter(load => load.id !== id));
    setSelectedLoads(selectedLoads.filter(selectedId => selectedId !== id));
  };

  const toggleLoad = (id) => {
    setSelectedLoads(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const openModal = (load = null) => {
    setEditingLoad(load);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingLoad(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <nav className="mb-6">
        <Link to="/" className="text-blue-500 mr-4 hover:underline">Home</Link>
        <Link to="/calculator" className="text-blue-500 hover:underline">Calculator</Link>
      </nav>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Electrical Load Calculator</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>
      <p className="text-center mb-4">Manage and calculate electrical loads for St. Lucie Auto Facility.</p>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Custom Load
        </button>
      </div>
      <LoadList
        loads={loads}
        selectedLoads={selectedLoads}
        toggleLoad={toggleLoad}
        editLoad={openModal}
        deleteLoad={deleteLoad}
      />
      <Results selectedLoads={loads.filter(load => selectedLoads.includes(load.id))} />
      <LoadModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        addLoad={addLoad}
        updateLoad={updateLoad}
        editingLoad={editingLoad}
      />
    </div>
  );
}

export default Calculator;
"""
}

# Write files to src directory
for file_path, content in files.items():
    full_path = os.path.join(SRC_DIR, file_path)
    print(f"Writing {file_path}...")
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)

# Instruct user to stop the running Vite server
print("\nThe Vite development server may be running. Please stop it by following these steps:")
print("1. Go to the Command Prompt window where the server is running (showing http://localhost:5173).")
print("2. Press Ctrl+C to stop the server. You may need to press Ctrl+C twice or type 'y' and press Enter to confirm.")
print("3. Once the server is stopped, press Enter to continue...")
input()

# Instruct user to manually start the Vite server
print("\nPlease start the Vite development server manually by following these steps:")
print(f"1. Open a new Command Prompt window.")
print(f"2. Navigate to the project directory:")
print(f"   cd \"{MAIN_DIR}\"")
print(f"3. Start the Vite server:")
print(f"   npm run dev")

# Print instructions for the user
print("\nAfter starting the server, follow these steps:")
print("1. Wait for the server to start (you'll see 'Local: http://localhost:5173/' in the Command Prompt window).")
print("2. Clear your browser cache to ensure the latest version loads:")
print("   - In Chrome: Press Ctrl+Shift+Delete, select 'Cached images and files', and click 'Clear data'.")
print("   - In Firefox: Press Ctrl+Shift+Delete, select 'Cache', and click 'Clear'.")
print("3. Open http://localhost:5173 in your browser.")
print("4. You should see the landing page with 'Welcome to St. Lucie Auto Facility' and navigation links.")
print("5. Use the navigation bar to go to the calculator at http://localhost:5173/calculator.")
print("6. Check the browser console (F12 > Console) for the 'Current path' log:")
print("   - At http://localhost:5173, it should log 'Current path: /'")
print("   - At http://localhost:5173/calculator, it should log 'Current path: /calculator'")
print("7. Test the calculator:")
print("   - View the list of predefined loads.")
print("   - Add, edit, and delete loads.")
print("   - Verify calculations (e.g., selecting all predefined loads should yield ~100.6 kW demand load).")
print("8. Stop the server with Ctrl+C in Command Prompt when done.")
print("Note: If the landing page doesn't appear, check the browser console for errors.")
print("Use an IDE like VS Code for easier development and debugging.")
