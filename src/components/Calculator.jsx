// ... all imports remain the same
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadList from './LoadList';
import Results from './Results';
import LoadModal from './LoadModal';
import html2pdf from 'html2pdf.js';

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

const necessityIDs = [1, 5, 6, 11, 16, 26];

function Calculator() {
  const [loads, setLoads] = useState(() => {
    const saved = localStorage.getItem("custom_loads");
    return saved ? JSON.parse(saved) : initialLoads;
  });

  const [selectedLoads, setSelectedLoads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState(null);
  const [autoSelect, setAutoSelect] = useState(false);

  useEffect(() => {
    localStorage.setItem("custom_loads", JSON.stringify(loads));
  }, [loads]);

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

  const handleReset = () => {
    setLoads(initialLoads);
    setSelectedLoads([]);
    setAutoSelect(false);
    const input = document.getElementById("unitDescription");
    if (input) input.value = "";
  };

  const handleAutoSelectChange = () => {
    setAutoSelect(prev => {
      const next = !prev;
      setSelectedLoads(next ? necessityIDs : []);
      return next;
    });
  };

  const exportToPDF = () => {
    const element = document.getElementById("results-to-pdf").cloneNode(true);
    const input = document.getElementById("unitDescription");
    const summaryCell = document.createElement("p");
    summaryCell.innerText = `Unit # or Description: ${input?.value || ""}`;
    summaryCell.style.fontSize = "14px";
    summaryCell.style.marginBottom = "12px";
    element.insertBefore(summaryCell, element.children[1]);

    html2pdf()
      .set({
        margin: 0.5,
        filename: 'load-results.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  return (
    <div className="container mx-auto p-6 bg-[#121212] text-white min-h-screen">
      <nav className="mb-6">
        <Link to="/" className="text-blue-500 mr-4 hover:underline">Home</Link>
        <Link to="/calculator" className="text-blue-500 hover:underline">Calculator</Link>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Electrical Load Calculator</h1>
        <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
      </div>

      <p className="text-center mb-4">Manage and calculate electrical loads for St. Lucie Auto Facility.</p>

      <div className="mb-4 space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoSelectNecessities"
            checked={autoSelect}
            onChange={handleAutoSelectChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="autoSelectNecessities" className="text-sm">
            Auto Select Power Necessities (pre-installed)
          </label>
        </div>

        <div>
          <label htmlFor="unitDescription" className="block text-sm font-medium text-white mb-1">
            Unit # or Description
          </label>
          <input
            type="text"
            id="unitDescription"
            placeholder="e.g., Unit B2 – Paint Shop"
            className="w-full p-2 rounded border border-gray-300 text-black"
          />
        </div>
      </div>

      <div className="flex justify-end mb-4 space-x-4">
        <button onClick={() => openModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Custom Load</button>
        <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Reset to Default</button>
        <button onClick={exportToPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Export as PDF</button>
      </div>

      {isModalOpen && (
        <div className="mb-6 border border-gray-300 bg-white rounded p-4 shadow">
          <LoadModal
            closeModal={closeModal}
            addLoad={addLoad}
            updateLoad={updateLoad}
            editingLoad={editingLoad}
          />
        </div>
      )}

      <div id="results-to-pdf" className="p-4 bg-white text-black">
        <h2 className="text-xl font-semibold mb-2">Selected Loads</h2>
        <table className="w-full border text-sm mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1">Power (W)</th>
              <th className="border px-2 py-1">Voltage</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Motor?</th>
            </tr>
          </thead>
          <tbody>
            {loads.filter(load => selectedLoads.includes(load.id)).map(load => (
              <tr key={load.id}>
                <td className="border px-2 py-1">{load.name}</td>
                <td className="border px-2 py-1 text-center">{load.power}</td>
                <td className="border px-2 py-1 text-center">{load.voltage}V</td>
                <td className="border px-2 py-1 text-center">{load.type}</td>
                <td className="border px-2 py-1 text-center">{load.isMotor ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Results selectedLoads={loads.filter(load => selectedLoads.includes(load.id))} />
      </div>

      <LoadList
        loads={loads}
        selectedLoads={selectedLoads}
        toggleLoad={toggleLoad}
        editLoad={openModal}
        deleteLoad={deleteLoad}
      />
    </div>
  );
}

export default Calculator;
