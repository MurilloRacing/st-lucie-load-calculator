import { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // Add this import
import UnitInfoHeader from '@/components/UnitInfoHeader';
import LoadList from '@/components/LoadList';
import Results from '@/components/Results';
import SaveLoadListControls from '@/components/SaveLoadListControls';
import ExportPDFButton from '@/components/ExportPDFButton';
import { supabase } from '../lib/supabaseClient';

export default function Calculator() {
  const [unitName, setUnitName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');
  const [loads, setLoads] = useState([]);
  const [autoSelect, setAutoSelect] = useState(false);
  const [savedLists, setSavedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('Loads')  // Changed to Loads table
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;
        setSavedLists(data || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        toast.error('Failed to fetch load templates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleAutoSelectToggle = async () => {
    const next = !autoSelect;
    setAutoSelect(next);

    if (next) {
      const { data, error } = await supabase
        .from("Loads")
        .select("*")
        .eq("is_essential", true);

      if (!error) {
        const updated = data.map((item) => ({
          ...item,
          enabled: true,
        }));
        setLoads(updated);
      } else {
        console.error("Auto-select error:", error);
      }
    } else {
      setLoads([]);
    }
  };

  const handleSavedListSelect = async (id) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('Loads')  // Changed to Loads table
        .select('*')
        .eq('id', id);
      
      if (error) throw error;
      
      if (data?.[0]) {
        setLoads([{
          ...data[0],
          enabled: true
        }]);
        toast.success('Load template added');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
      setSelectedListId('');  // Reset selection
    }
  };

  const handleLoadFromSavedList = (loaded) => {
    setLoads(loaded);
  };

  const toggleEnabled = (index) => {
    setLoads(prev => prev.map((load, i) => 
      i === index ? { ...load, enabled: !load.enabled } : load
    ));
  };

  const deleteLoad = (id) => {
    setLoads(prev => prev.filter(load => load.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">
        P1 Electrical Load Calculator
      </h1>

      {/* Auto-select and template controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="autoSelect"
            checked={autoSelect}
            onChange={handleAutoSelectToggle}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="autoSelect" className="text-sm">
            Auto Select Essentials – Pre-installed
          </label>
        </div>

        <select
          className="border rounded px-3 py-2"
          value={selectedListId || ''}
          onChange={(e) => handleSavedListSelect(e.target.value)}
          disabled={isLoading}
        >
          <option value="">
            {isLoading ? 'Loading...' : '⚡ Load Saved Template'}
          </option>
          {savedLists.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name} ({template.voltage}V, {template.power}W)
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
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
              loads={loads}
              setLoads={setLoads}
              toggleEnabled={toggleEnabled}
              deleteLoad={deleteLoad}
            />
          </div>
        </div>

        <Results loads={loads} />
      </div>

      {/* Export and Save controls */}
      {loads.length > 0 && (
        <ExportPDFButton
          unitName={unitName}
          buildingId={buildingId}
          spaceNumber={spaceNumber}
          loads={loads}
        />
      )}

      <SaveLoadListControls
        loads={loads}
        onSaveSuccess={() => console.log('✅ List Saved')}
        onLoadList={handleLoadFromSavedList}
      />
    </div>
  );
}
