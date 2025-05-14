import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoadList = ({ loads, setLoads, templateId }) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  useEffect(() => {
    const fetchTemplateLoads = async () => {
      const { data, error } = await supabase
        .from('load_list_items')
        .select('*')
        .eq('list_id', templateId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching template loads:', error);
        toast.error('Failed to load items.');
      } else {
        setLoads(data);
      }
    };

    if (templateId) fetchTemplateLoads();
  }, [templateId, setLoads]);

  const deleteLoad = async (id) => {
    const confirmed = window.confirm('Delete this load?');
    if (!confirmed) return;

    const { error } = await supabase.from('load_list_items').delete().eq('id', id);
    if (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete load.');
    } else {
      setLoads((prev) => prev.filter((l) => l.id !== id));
      toast.success('Load deleted');
    }
  };

  const handleEditRow = (load) => {
    setEditingRowId(load.id);
    setEditedRow(load);
  };

  const handleInputChange = (field, value) => {
    setEditedRow((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveRow = async (id) => {
    const { error } = await supabase
      .from('load_list_items')
      .update({
        name: editedRow.name,
        power: editedRow.power,
        voltage: editedRow.voltage,
        type: editedRow.type,
        is_motor: editedRow.is_motor,
      })
      .eq('id', id);

    if (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update load.');
    } else {
      toast.success('Load updated!');
      setEditingRowId(null);
      setEditedRow({});
      setLoads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...editedRow } : l))
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditedRow({});
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">📝 Template Items</h2>

      {loads.length === 0 ? (
        <p className="text-gray-500">No loads defined for this template.</p>
      ) : (
        <>
          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 font-semibold text-sm bg-gray-100 p-2 border-b gap-2 md:gap-0">
            <div>Name</div>
            <div className="text-center">Power (W)</div>
            <div className="text-center">Voltage</div>
            <div className="text-center">Type</div>
            <div className="text-center">Motor?</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Data Rows */}
          <div className="divide-y border rounded">
            {loads.map((load) => (
              <div
                key={load.id}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 items-center gap-2 md:gap-0 p-2"
              >
                <div>
                  {editingRowId === load.id ? (
                    <input
                      className="w-full border rounded p-1"
                      value={editedRow.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    load.name
                  )}
                </div>
                <div className="text-center">
                  {editingRowId === load.id ? (
                    <input
                      type="number"
                      className="w-full border rounded p-1"
                      value={editedRow.power}
                      onChange={(e) => handleInputChange('power', e.target.value)}
                    />
                  ) : (
                    `${load.power} W`
                  )}
                </div>
                <div className="text-center">
                  {editingRowId === load.id ? (
                    <input
                      type="number"
                      className="w-full border rounded p-1"
                      value={editedRow.voltage}
                      onChange={(e) => handleInputChange('voltage', e.target.value)}
                    />
                  ) : (
                    `${load.voltage} V`
                  )}
                </div>
                <div className="text-center">
                  {editingRowId === load.id ? (
                    <select
                      className="w-full border rounded p-1"
                      value={editedRow.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                      <option value="Non-Continuous">Non-Continuous</option>
                      <option value="Continuous">Continuous</option>
                    </select>
                  ) : (
                    load.type
                  )}
                </div>
                <div className="text-center">
                  {editingRowId === load.id ? (
                    <input
                      type="checkbox"
                      checked={editedRow.is_motor}
                      onChange={(e) =>
                        handleInputChange('is_motor', e.target.checked)
                      }
                    />
                  ) : load.is_motor ? (
                    'Yes'
                  ) : (
                    'No'
                  )}
                </div>
                <div className="flex justify-end space-x-2">
                  {editingRowId === load.id ? (
                    <>
                      <button
                        className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleSaveRow(load.id)}
                      >
                        <FaSave /> Save
                      </button>
                      <button
                        className="inline-flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 ml-2"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes /> Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditRow(load)}
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteLoad(load.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LoadList;
