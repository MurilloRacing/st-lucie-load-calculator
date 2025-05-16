// src/components/TemplateManager.jsx
import React, { useState, useEffect } from 'react';
import { fetchSamples, fetchSavedTemplates, fetchTemplateItems } from '@/utils/api';

const TemplateManager = ({ onTemplateLoad }) => {
  const [mode, setMode] = useState('samples'); // 'samples', 'saved', 'new'
  const [samples, setSamples] = useState([]);
  const [saved, setSaved] = useState([]);
  const [activeTemplateInfo, setActiveTemplateInfo] = useState(null);

  useEffect(() => {
    if (mode === 'samples') {
      fetchSamples().then(setSamples);
    } else if (mode === 'saved') {
      fetchSavedTemplates().then(setSaved);
    }
  }, [mode]);

  const handleLoadTemplate = async (template) => {
    let items;
    if (mode === 'samples') {
      items = template.items; // already included in fetch
      setActiveTemplateInfo(null);
    } else {
      items = await fetchTemplateItems(template.id);
      setActiveTemplateInfo({
        name: template.name,
        building_id: template.building_id,
        space_number: template.space_number,
      });
    }
    onTemplateLoad(items);
  };

  return (
    <div className="flex flex-col gap-2">
      <select value={mode} onChange={(e) => setMode(e.target.value)} className="border p-2">
        <option value="samples">Browse Sample Templates</option>
        <option value="saved">Load My Saved Templates</option>
        <option value="new">New Blank List</option>
      </select>

      {mode === 'samples' && (
        <div>
          <p className="text-xs text-yellow-600 italic">
            Sample templates cannot be saved until you choose “Save As…”
          </p>
          {samples.map((t, i) => (
            <button key={i} className="block text-blue-600" onClick={() => handleLoadTemplate(t)}>
              {t.label || `Sample ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {mode === 'saved' && (
        <div>
          {saved.map((t) => (
            <button key={t.id} className="block text-green-700" onClick={() => handleLoadTemplate(t)}>
              {t.name} – {t.building_id}/{t.space_number}
            </button>
          ))}
        </div>
      )}

      {mode === 'new' && (
        <button
          onClick={() => {
            onTemplateLoad([]);
            setActiveTemplateInfo(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Blank
        </button>
      )}

      {activeTemplateInfo && (
        <div className="text-sm text-gray-600">
          Loaded: <strong>{activeTemplateInfo.name}</strong> – {activeTemplateInfo.building_id} / {activeTemplateInfo.space_number}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
