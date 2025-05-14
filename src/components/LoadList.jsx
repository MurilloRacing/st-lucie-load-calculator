import React, { useState } from 'react';

const LoadList = ({ loads, setLoads, toggleEnabled, deleteLoad }) => {
  const [editingId, setEditingId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  const handleEdit = (load) => {
    setEditingId(load.id);
    setEditedValues(load);
  };

  const handleSave = async (id) => {
    setLoads(prev => 
      prev.map(load => load.id === id ? editedValues : load)
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedValues({});
  };

  const handleChange = (field, value) => {
    setEditedValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1024px]">
        <table className="w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-center w-10">✔</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-center w-32">Power (W)</th>
              <th className="px-4 py-2 text-center w-32">Voltage</th>
              <th className="px-4 py-2 text-center w-32">Type</th>
              <th className="px-4 py-2 text-center w-20">Motor?</th>
              <th className="px-4 py-2 text-right w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loads.map((load, index) => (
              <tr key={load.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={load.enabled}
                    onChange={() => toggleEnabled(index)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  {editingId === load.id ? (
                    <input
                      type="text"
                      value={editedValues.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  ) : (
                    load.name
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === load.id ? (
                    <input
                      type="number"
                      value={editedValues.power}
                      onChange={(e) => handleChange('power', e.target.value)}
                      className="w-24 border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    `${load.power} W`
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === load.id ? (
                    <input
                      type="number"
                      value={editedValues.voltage}
                      onChange={(e) => handleChange('voltage', e.target.value)}
                      className="w-24 border rounded px-2 py-1 text-center"
                    />
                  ) : (
                    `${load.voltage} V`
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === load.id ? (
                    <select
                      value={editedValues.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="Non-Continuous">Non-Continuous</option>
                      <option value="Continuous">Continuous</option>
                    </select>
                  ) : (
                    load.type
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {editingId === load.id ? (
                    <input
                      type="checkbox"
                      checked={editedValues.is_motor}
                      onChange={(e) => handleChange('is_motor', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  ) : (
                    load.is_motor ? 'Yes' : 'No'
                  )}
                </td>
                <td className="px-4 py-2 text-right">
                  {editingId === load.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSave(load.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        💾
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(load)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteLoad(load.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoadList;
