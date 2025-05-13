import { useEffect, useState } from 'react';
import UnitInfoHeader from './UnitInfoHeader';
import LoadList from './LoadList';
import Results from './Results';
import SaveLoadListControls from './SaveLoadListControls';
import ExportPDFButton from './ExportPDFButton';

export default function NewCalculator() {
  const [unitName, setUnitName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');
  const [loads, setLoads] = useState([]);

  // Load from localStorage if redirected from SavedLists.jsx
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

  const handleLoadFromSavedList = (loaded) => {
    setLoads(loaded);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">🛠️ New Load Calculator</h1>
      {/* 📄 Export PDF Button */}
      <ExportPDFButton
        unitName={unitName}
        buildingId={buildingId}
        spaceNumber={spaceNumber}
        loads={loads}
      />
      {/* 🧾 Exportable Content */}
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