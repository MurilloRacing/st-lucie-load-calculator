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
    const fetchSavedLists = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('saved_load_lists') // Make sure table name matches your Supabase schema
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSavedLists(data || []);
      } catch (error) {
        console.error('Error fetching saved lists:', error);
        toast.error('Failed to fetch saved lists');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedLists();
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
    setSelectedListId(id);
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('list_id', id);
    if (!error) {
      setLoads(data);
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
            {isLoading ? 'Loading...' : '📁 Load Saved Template'}
          </option>
          {savedLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name} – {list.building_id} {list.space_number}
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
