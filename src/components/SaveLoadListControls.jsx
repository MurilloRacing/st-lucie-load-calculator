import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const SaveLoadListControls = ({ loads, onSaveSuccess, onLoadList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    buildingId: '',
    spaceNumber: '',
  });
  const [savedLists, setSavedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_load_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedLists(data);
    } catch (error) {
      console.error('Error fetching saved lists:', error);
      toast.error('Failed to fetch saved lists');
    }
  };

  const handleListSelect = async (e) => {
    const listId = e.target.value;
    setSelectedListId(listId);
    if (!listId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_load_items')
        .select('*')
        .eq('list_id', listId);

      if (error) throw error;
      onLoadList?.(data);
    } catch (error) {
      console.error('Failed to load list:', error);
      toast.error('Error loading list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || loads.length === 0) {
      toast.error('Template name and loads are required');
      return;
    }

    setIsLoading(true);
    try {
      // Create new template
      const { data: listData, error: listError } = await supabase
        .from('load_lists')
        .insert([
          {
            name: form.name.trim(),
            building_id: form.buildingId,
            space_number: form.spaceNumber,
          },
        ])
        .select()
        .single();

      if (listError) throw listError;

      // Save load items
      const items = loads.map((load) => ({
        load_list_id: listData.id,
        name: load.name,
        power: load.power,
        voltage: load.voltage,
        type: load.type,
        is_motor: load.is_motor,
      }));

      const { error: itemError } = await supabase
        .from('load_items')
        .insert(items);

      if (itemError) throw itemError;

      toast.success('Template saved successfully!');
      setForm({ name: '', buildingId: '', spaceNumber: '' });
      onSaveSuccess?.();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedListId}
          onChange={handleListSelect}
          className="p-2 rounded border focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">Select Existing Load List</option>
          {savedLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.name} - {list.building_id} {list.space_number}
            </option>
          ))}
        </select>

        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="New Template Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <input
          type="text"
          placeholder="Building ID"
          value={form.buildingId}
          onChange={(e) => handleChange('buildingId', e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <input
          type="text"
          placeholder="Space Number"
          value={form.spaceNumber}
          onChange={(e) => handleChange('spaceNumber', e.target.value)}
          className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <button
          onClick={handleSave}
          disabled={isLoading || !form.name || loads.length === 0}
          className={`
            px-4 py-2 rounded text-white transition-colors
            ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }
          `}
        >
          {isLoading ? 'Saving...' : 'Save Template'}
        </button>
      </div>
    </div>
  );
};

export default SaveLoadListControls;
