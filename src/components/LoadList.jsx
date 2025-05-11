import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const LoadList = ({ selectedLoads, setSelectedLoads, refreshTrigger, editLoad }) => {
  const [loads, setLoads] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editedRow, setEditedRow] = useState({});

  useEffect(() => {
    const fetchLoads = async () => {
      const { data, error } = await supabase
        .from("Loads")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching loads:", error);
      } else {
        setLoads(data);
      }
    };

    fetchLoads();
  }, [refreshTrigger]);

  const toggleLoad = (load) => {
    const alreadySelected = selectedLoads.some((l) => l.id === load.id);
    if (alreadySelected) {
      setSelectedLoads(selectedLoads.filter((l) => l.id !== load.id));
    } else {
      setSelectedLoads([...selectedLoads, load]);
    }
  };

  const deleteLoad = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this load?");
    if (!confirmed) return;

    const { error } = await supabase.from("Loads").delete().eq("id", id);
    if (error) {
      console.error("Error deleting load:", error.message);
    } else {
      setLoads((prev) => prev.filter((l) => l.id !== id));
      setSelectedLoads((prev) => prev.filter((l) => l.id !== id));
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
      .from("Loads")
      .update({
        name: editedRow.name,
        power: editedRow.power,
        voltage: editedRow.voltage,
        type: editedRow.type,
        is_motor: editedRow.is_motor,
      })
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update load.");
    } else {
      toast.success("Load updated!");
      setEditingRowId(null);
      setEditedRow({});
      setLoads((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...editedRow } : l))
      );
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Load List</h2>
      {loads.length === 0 ? (
        <p className="text-gray-500">No loads available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-2">Select</th>
                <th className="p-2">Name</th>
                <th className="p-2">Power (W)</th>
                <th className="p-2">Voltage</th>
                <th className="p-2">Type</th>
                <th className="p-2">Motor?</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loads.map((load) => (
                <tr key={load.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedLoads.some((l) => l.id === load.id)}
                      onChange={() => toggleLoad(load)}
                    />
                  </td>
                  <td className="p-2">
                    {editingRowId === load.id ? (
                      <input
                        className="w-full border rounded p-1"
                        value={editedRow.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    ) : (
                      load.name
                    )}
                  </td>
                  <td className="p-2">
                    {editingRowId === load.id ? (
                      <input
                        className="w-full border rounded p-1"
                        type="number"
                        value={editedRow.power}
                        onChange={(e) => handleInputChange("power", e.target.value)}
                      />
                    ) : (
                      load.power
                    )}
                  </td>
                  <td className="p-2">
                    {editingRowId === load.id ? (
                      <input
                        className="w-full border rounded p-1"
                        type="number"
                        value={editedRow.voltage}
                        onChange={(e) => handleInputChange("voltage", e.target.value)}
                      />
                    ) : (
                      `${load.voltage}V`
                    )}
                  </td>
                  <td className="p-2">
                    {editingRowId === load.id ? (
                      <select
                        className="w-full border rounded p-1"
                        value={editedRow.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                      >
                        <option value="Non-Continuous">Non-Continuous</option>
                        <option value="Continuous">Continuous</option>
                      </select>
                    ) : (
                      load.type
                    )}
                  </td>
                  <td className="p-2">
                    {editingRowId === load.id ? (
                      <input
                        type="checkbox"
                        checked={editedRow.is_motor}
                        onChange={(e) => handleInputChange("is_motor", e.target.checked)}
                      />
                    ) : (
                      load.is_motor ? "Yes" : "No"
                    )}
                  </td>
                  <td className="p-2 text-right space-x-2">
                    {editingRowId === load.id ? (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleSaveRow(load.id)}
                      >
                        ✅
                      </button>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editingRowId && (
            <div className="mt-3 text-sm text-blue-700 bg-blue-100 p-2 rounded">
              Editing load: <strong>{editedRow.name}</strong>. Click ✅ to save your changes.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadList;
