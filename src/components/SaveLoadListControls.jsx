import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const SaveLoadListControls = ({ loads, onSaveSuccess, onLoadList }) => {
  const [listName, setListName] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');
  const [savedLists, setSavedLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState('');

  useEffect(() => {
    const fetchLists = async () => {
      const { data, error } = await supabase
        .from('saved_load_lists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lists:', error);
        toast.error('Failed to fetch saved lists.');
      } else {
        setSavedLists(data);
      }
    };

    fetchLists();
  }, []);

  const handleListSelect = async (e) => {
    const listId = e.target.value;
    setSelectedListId(listId);
    if (!listId) return;

    const { data, error } = await supabase
      .from('saved_load_items')
      .select('*')
      .eq('list_id', listId);

    if (error) {
      console.error('Failed to load list:', error);
      toast.error('Error loading list.');
    } else {
      onLoadList?.(data);
    }
  };

  const handleSave = async () => {
    if (!listName) return;

    const { data: listData, error: listError } = await supabase
      .from('saved_load_lists')
      .insert([
        {
          name: listName,
          building_id: buildingId,
          space_number: spaceNumber,
          user_id: null,
        },
      ])
      .select()
      .single();

    if (listError) {
      console.error('List creation failed:', listError);
      toast.error('Failed to create list.');
      return;
    }

    const items = loads.map((load) => ({
      list_id: listData.id,
      name: load.name,
      power: load.power,
      voltage: load.voltage,
      type: load.type,
      is_motor: load.is_motor,
    }));

    const { error: itemError } = await supabase
      .from('saved_load_items')
      .insert(items);

    if (itemError) {
      console.error('Items insert error:', itemError);
      toast.error('Failed to save load items.');
    } else {
      toast.success('Load list saved!');
      setListName('');
      setBuildingId('');
      setSpaceNumber('');
      setSelectedListId('');
      onSaveSuccess?.();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <select value={selectedListId} onChange={handleListSelect} className="p-2 rounded border">
        <option value="">Select Existing Load List</option>
        {savedLists.map((list) => (
          <option key={list.id} value={list.id}>{list.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="New List Name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Building ID"
        value={buildingId}
        onChange={(e) => setBuildingId(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Space Number"
        value={spaceNumber}
        onChange={(e) => setSpaceNumber(e.target.value)}
        className="p-2 border rounded"
      />
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!listName || loads.length === 0}
      >
        Save Load List
      </button>
    </div>
  );
};

export default SaveLoadListControls;
