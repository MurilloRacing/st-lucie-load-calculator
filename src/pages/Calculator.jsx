import { useState } from 'react';
import TemplateManager from '@/components/TemplateManager';
import LoadList from '@/components/LoadList';
import Results from '@/components/Results';
import SaveLoadListControls from '@/components/SaveLoadListControls';
import UnitInfoHeader from '@/components/UnitInfoHeader';
import ExportPDFButton from '@/components/ExportPDFButton';

export default function Calculator() {
  const [unitName, setUnitName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');
  const [loadList, setLoadList] = useState([]);
  const [activeTemplates, setActiveTemplates] = useState([]);

  const loadTemplate = (template) => {
    const source = template.label || template.templateSource || 'Individual';
    const newItems = (template.items || [template]).map(item => ({
      ...item,
      templateSource: source,
    }));
    setLoadList(prev => [...prev, ...newItems]);
    if (!activeTemplates.includes(source)) {
      setActiveTemplates(prev => [...prev, source]);
    }
  };

  const removeTemplate = (templateName) => {
    setLoadList(prev => prev.filter(item => item.templateSource !== templateName));
    setActiveTemplates(prev => prev.filter(name => name !== templateName));
  };

  const toggleEnabled = (index) => {
    setLoadList(prev => prev.map((load, i) =>
      i === index ? { ...load, enabled: !load.enabled } : load
    ));
  };

  const deleteLoad = (id) => {
    setLoadList(prev => prev.filter(load => load.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        P1 Electrical Load Calculator
      </h1>

      <TemplateManager 
        onLoadTemplate={loadTemplate}
        onRemoveTemplate={removeTemplate}
        activeTemplates={activeTemplates}
      />

      <div id="export-content" className="space-y-6">
        <UnitInfoHeader
          unitName={unitName}
          setUnitName={setUnitName}
          buildingId={buildingId}
          setBuildingId={setBuildingId}
          spaceNumber={spaceNumber}
          setSpaceNumber={setSpaceNumber}
        />

        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-[1024px]">
            <LoadList
              loads={loadList}
              setLoads={setLoadList}
              toggleEnabled={toggleEnabled}
              deleteLoad={deleteLoad}
            />
          </div>
        </div>

        <Results loads={loadList.filter(load => load.enabled)} />
      </div>

      {loadList.length > 0 && (
        <ExportPDFButton
          unitName={unitName}
          buildingId={buildingId}
          spaceNumber={spaceNumber}
          loads={loadList}
        />
      )}

      <SaveLoadListControls
        loads={loadList}
        onSaveSuccess={() => console.log('✅ List Saved')}
        onLoadList={setLoadList}
      />
    </div>
  );
}
