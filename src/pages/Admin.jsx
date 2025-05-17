import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import {
  Pencil,
  Trash2,
  Save,
  X
} from 'lucide-react';

export default function Admin() {
  const [loads, setLoads] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingForm, setEditingForm] = useState({});
  const [templateName, setTemplateName] = useState('');
  const [category, setCategory] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [spaceNumber, setSpaceNumber] = useState('');

  useEffect(() => {
    async function fetchLoads() {
      const { data, error } = await supabase.from('master_loads').select('*');
      if (error) {
        console.error(error);
        toast.error('Failed to load master list');
      } else {
        const withSelected = data.map(load => ({ ...load, selected: true }));
        setLoads(withSelected);
      }
    }
    fetchLoads();
  }, []);

  const toggleSelected = (id) => {
    setLoads(prev =>
      prev.map(load => load.id === id ? { ...load, selected: !load.selected } : load)
    );
  };

  const startEdit = (load) => {
    setEditingId(load.id);
    setEditingForm({ ...load });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingForm({});
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveEdit = async () => {
    const { error } = await supabase
      .from('master_loads')
      .update({
        name: editingForm.name,
        power: parseInt(editingForm.power),
        voltage: parseInt(editingForm.voltage),
        type: editingForm.type,
        is_motor: editingForm.is_motor
      })
      .eq('id', editingId);

    if (error) {
      toast.error('Update failed');
    } else {
      toast.success('Load updated');
      setLoads(prev =>
        prev.map(l => l.id === editingId ? editingForm : l)
      );
      cancelEdit();
    }
  };

  const deleteLoad = async (id) => {
    if (!window.confirm("Delete this load?")) return;
    const { error } = await supabase.from('master_loads').delete().eq('id', id);
    if (!error) {
      setLoads(prev => prev.filter(l => l.id !== id));
      toast.success("Deleted");
    } else {
      toast.error("Delete failed");
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !category) {
      toast.error("Template name and category are required");
      return;
    }

    const { data: list, error: listError } = await supabase
      .from("load_lists")
      .insert([{
        name: templateName,
        category,
        building_id: buildingId,
        space_number: spaceNumber
      }])
      .select()
      .single();

    if (listError) {
      toast.error("Failed to save template");
      return;
    }

    const selectedLoads = loads.filter(load => load.selected);

    const loadItems = selectedLoads.map(load => ({
      list_id: list.id,
      name: load.name,
      power: load.power,
      voltage: load.voltage,
      type: load.type,
      is_motor: load.is_motor
    }));

    const { error: itemsError } = await supabase.from("load_list_items").insert(loadItems);
    if (itemsError) {
      toast.error("Error saving load items");
    } else {
      toast.success("Template saved");
      setTemplateName('');
      setCategory('');
    }
  };

  const allChecked = loads.length > 0 && loads.every(load => load.selected);
  const someChecked = loads.some(load => load.selected);

  const handleToggleAll = () => {
    setLoads(prev => prev.map(load => ({ ...load, selected: !allChecked })));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Admin: Master Load Builder</h1>

      {/* Input Controls - Make more mobile friendly */}
      <div className="grid grid-cols-1 md:flex md:flex-wrap gap-4 items-center justify-between mb-4">
        <input
          className="border px-3 py-2 rounded w-full md:w-64"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded w-full md:w-64"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Office Space">Office Space</option>
          <option value="Auto Shop">Auto Shop</option>
          <option value="Break Room">Break Room</option>
          <option value="Entertainment Area">Entertainment Area</option>
        </select>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            className="border px-3 py-2 rounded flex-1 md:w-40"
            placeholder="Building ID"
            value={buildingId}
            onChange={(e) => setBuildingId(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded flex-1 md:w-40"
            placeholder="Space Number"
            value={spaceNumber}
            onChange={(e) => setSpaceNumber(e.target.value)}
          />
        </div>
        <button
          className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSaveTemplate}
        >
          💾 Save Template
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="min-w-[800px] md:w-full p-4 md:p-0">
          <table className="w-full border border-gray-300 text-sm rounded overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(input) => {
                      if (input) input.indeterminate = !allChecked && someChecked;
                    }}
                    onChange={handleToggleAll}
                    className="form-checkbox"
                  />
                </th>
                <th className="p-2">Name</th>
                <th className="p-2">Power (W)</th>
                <th className="p-2">Voltage</th>
                <th className="p-2">Type</th>
                <th className="p-2 text-center">Motor?</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loads.map(load => (
                <tr key={load.id} className="hover:bg-gray-50">
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={load.selected}
                      onChange={() => toggleSelected(load.id)}
                    />
                  </td>

                  {editingId === load.id ? (
                    <>
                      <td className="p-2">
                        <input
                          className="border px-2 py-1 w-full"
                          name="name"
                          value={editingForm.name}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border px-2 py-1 w-full"
                          name="power"
                          type="number"
                          value={editingForm.power}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          className="border px-2 py-1 w-full"
                          name="voltage"
                          type="number"
                          value={editingForm.voltage}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2">
                        <select
                          name="type"
                          value={editingForm.type}
                          onChange={handleEditChange}
                          className="border px-2 py-1 w-full"
                        >
                          <option value="Continuous">Continuous</option>
                          <option value="Non-Continuous">Non-Continuous</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          name="is_motor"
                          checked={editingForm.is_motor}
                          onChange={handleEditChange}
                        />
                      </td>
                      <td className="p-2 flex justify-center gap-2">
                        <button onClick={saveEdit} title="Save" className="text-green-600 hover:text-green-800">
                          <Save size={16} />
                        </button>
                        <button onClick={cancelEdit} title="Cancel" className="text-gray-600 hover:text-gray-800">
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{load.name}</td>
                      <td className="p-2">{load.power}</td>
                      <td className="p-2">{load.voltage}</td>
                      <td className="p-2">{load.type}</td>
                      <td className="p-2 text-center">{load.is_motor ? 'Yes' : 'No'}</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button onClick={() => startEdit(load)} title="Edit" className="text-blue-600 hover:text-blue-800">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => deleteLoad(load.id)} title="Delete" className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
