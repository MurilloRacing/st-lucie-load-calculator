import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadList from './LoadList';
import Results from './Results';
import LoadModal from './LoadModal';
import SaveLoadListControls from './SaveLoadListControls';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabaseClient';

function Calculator() {
  const [selectedLoads, setSelectedLoads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState(null);
  const [autoSelect, setAutoSelect] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());
  const [toastMessage, setToastMessage] = useState(null);

  const openModal = (load = null) => {
    setEditingLoad(load);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLoad(null);
  };

  const handleLoadAdded = () => {
    setRefreshTrigger(Date.now());
    closeModal();
    setToastMessage('✅ Load saved successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleLoad = (load) => {
    const alreadySelected = selectedLoads.some(l => l.id === load.id);
    if (alreadySelected) {
      setSelectedLoads(selectedLoads.filter(l => l.id !== load.id));
    } else {
      setSelectedLoads([...selectedLoads, load]);
    }
  };

  const handleReset = () => {
    setSelectedLoads([]);
    setAutoSelect(false);
    const input = document.getElementById("unitDescription");
    if (input) input.value = "";
  };

  const handleAutoSelectChange = async () => {
    const next = !autoSelect;
    setAutoSelect(next);

    if (next) {
      const { data, error } = await supabase
        .from("Loads")
        .select("*")
        .eq("is_essential", true);

      if (!error) {
        setSelectedLoads(data);
      } else {
        console.error("Auto-select error:", error);
      }
    } else {
      setSelectedLoads([]);
    }
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

      <p className="text-center mb-4">Manage and calculate electrical loads for P1 Motor Club Facility.</p>

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
            placeholder="e.g., Unit B2 – East Garage"
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
            onLoadAdded={handleLoadAdded}
            onClose={closeModal}
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
            {selectedLoads.map(load => (
              <tr key={load.id}>
                <td className="border px-2 py-1">{load.name}</td>
                <td className="border px-2 py-1 text-center">{load.power}</td>
                <td className="border px-2 py-1 text-center">{load.voltage}V</td>
                <td className="border px-2 py-1 text-center">{load.type}</td>
                <td className="border px-2 py-1 text-center">{load.is_motor ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Results selectedLoads={selectedLoads} />
      </div>

      <div className="text-white text-xl font-semibold mb-2">Load List</div>

      <SaveLoadListControls
        loads={selectedLoads}
        onSaveSuccess={() => {
          setToastMessage('✅ Load list saved!');
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      <LoadList
        selectedLoads={selectedLoads}
        setSelectedLoads={setSelectedLoads}
        refreshTrigger={refreshTrigger}
        editLoad={openModal}
      />

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Calculator;
