import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const Admin = () => {
  const [loads, setLoads] = useState([]);
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [spaceNumber, setSpaceNumber] = useState("");

  useEffect(() => {
    async function fetchLoads() {
      const { data, error } = await supabase.from("master_loads").select("*");
      if (error) console.error(error);
      else {
        const withCheckbox = data.map(load => ({ ...load, selected: true }));
        setLoads(withCheckbox);
      }
    }
    fetchLoads();
  }, []);

  const toggleLoad = (id) => {
    setLoads(prev =>
      prev.map(load => load.id === id ? { ...load, selected: !load.selected } : load)
    );
  };

  const handleSaveTemplate = async () => {
    if (!templateName || !category) {
      toast.error("Template name and category are required.");
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
      console.error(listError);
      toast.error("Failed to save template.");
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
      console.error(itemsError);
      toast.error("Error saving load items.");
    } else {
      toast.success("Template saved successfully.");
      setTemplateName("");
      setCategory("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin: Create Template</h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="Office Space">Office Space</option>
          <option value="Auto Shop">Auto Shop</option>
          <option value="Break Room">Break Room</option>
          <option value="Entertainment Area">Entertainment Area</option>
        </select>
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
      </div>

      <button
        onClick={handleSaveTemplate}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Save Template
      </button>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Include</th>
            <th className="p-2">Name</th>
            <th className="p-2">Power</th>
            <th className="p-2">Voltage</th>
            <th className="p-2">Type</th>
            <th className="p-2">Motor?</th>
          </tr>
        </thead>
        <tbody>
          {loads.map(load => (
            <tr key={load.id}>
              <td className="p-2">
                <input
                  type="checkbox"
                  checked={load.selected}
                  onChange={() => toggleLoad(load.id)}
                />
              </td>
              <td className="p-2">{load.name}</td>
              <td className="p-2">{load.power}</td>
              <td className="p-2">{load.voltage}</td>
              <td className="p-2">{load.type}</td>
              <td className="p-2">{load.is_motor ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
