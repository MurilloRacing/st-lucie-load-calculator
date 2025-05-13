import { useEffect, useState } from 'react';
import UnitInfoHeader from '@/components/UnitInfoHeader';
import LoadList from '@/components/LoadList';
import Results from '@/components/Results';
import SaveLoadListControls from '@/components/SaveLoadListControls';
import ExportPDFButton from '@/components/ExportPDFButton';
import LoadModal from '@/components/LoadModal'; // optional modal integration
import { supabase } from '../lib/supabaseClient';

export default function Calculator() {
  const [unitName, setUnitName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');
  const [loads, setLoads] = useState([]);
  const [autoSelect, setAutoSelect] = useState(false);

  // Load previously selected loads if redirected from SavedLists.jsx
  useEffect(() => {
    const saved = localStorage.getItem('loadedLoads');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoads(parsed);
        localStorage.removeItem('loadedLoads');
      } catch (err) {
        console.error("Failed to parse saved loads:", err);
      }
    }
  }, []);

  // Load handler for saved list dropdown
  const handleLoadFromSavedList = (loaded) => {
    setLoads(loaded);
  };

  // Toggle and fetch essential loads from Supabase
  const handleAutoSelectToggle = async () => {
    const next = !autoSelect;
    setAutoSelect(next);

    if (next) {
      const { data, error } = await supabase
        .from("Loads")
        .select("*")
        .eq("is_essential", true);

      if (!error) {
        setLoads(data);
      } else {
        console.error("Auto-select error:", error);
      }
    } else {
      setLoads([]);
    }
  };

  // Hardcoded test loads for quick demo
  const loadSampleTemplate = () => {
    setLoads([
      {
        name: "Lighting",
        power: 7500,
        voltage: 120,
        type: "Continuous",
        is_motor: false,
      },
      {
        name: "Lift",
        power: 6000,
        voltage: 208,
        type: "Non-Continuous",
        is_motor: true,
      },
    ]);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🛠️ New Load Calculator</h1>

      <ExportPDFButton
        unitName={unitName}
        buildingId={buildingId}
        spaceNumber={spaceNumber}
        loads={loads}
      />

      {/* Toggle + Sample Loader */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoSelect"
            checked={autoSelect}
            onChange={handleAutoSelectToggle}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="autoSelect" className="text-sm">Auto Select Essentials</label>
        </div>

        <button
          onClick={loadSampleTemplate}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          🔁 Load Sample Template
        </button>
      </div>

      {/* Exportable Section */}
      <div id="export-content" className="space-y-6">
        <UnitInfoHeader
          unitName={unitName}
          setUnitName={setUnitName}
          buildingId={buildingId}
          setBuildingId={setBuildingId}
          spaceNumber={spaceNumber}
          setSpaceNumber={setSpaceNumber}
        />
        <LoadList loads={loads} setLoads={setLoads} />
        <Results loads={loads} />
      </div>

      <SaveLoadListControls
        loads={loads}
        onSaveSuccess={() => console.log('✅ List Saved')}
        onLoadList={handleLoadFromSavedList}
      />
    </div>
  );
}
