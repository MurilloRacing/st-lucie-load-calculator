import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedListId, setSelectedListId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('load_lists')
        .select('category')
        .neq('category', null);
      if (data) {
        const unique = [...new Set(data.map((d) => d.category))];
        setCategories(unique);
      }
    };
    fetchCategories();
  }, []);

  // Fetch templates when category is selected
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchTemplates = async () => {
      const { data } = await supabase
        .from('load_lists')
        .select('id, name')
        .eq('category', selectedCategory);
      if (data) setTemplates(data);
    };
    fetchTemplates();
  }, [selectedCategory]);

  // Load selected template and append to loads
  const handleTemplateSelect = async (listId) => {
    setSelectedListId(listId);
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('list_id', listId);

    if (error) {
      toast.error("Failed to load template");
      return;
    }

    const newItems = data.map(item => ({
      ...item,
      enabled: true
    }));

    setLoads(prev => [...prev, ...newItems]);
    toast.success("Template added to list");
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

      {/* Template category + template selection */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedListId('');
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">📂 Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedListId}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          disabled={!selectedCategory}
          className="border px-3 py-2 rounded"
        >
          <option value="">📁 Load Template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
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
