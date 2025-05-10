import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const LoadModal = ({ onClose, onLoadAdded, editingLoad = null }) => {
  const isEditing = editingLoad !== null;

  const [form, setForm] = useState({
    name: "",
    power: "",
    voltage: "",
    type: "Non-Continuous",
    is_motor: false,
    is_essential: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      setForm({
        name: editingLoad.name,
        power: editingLoad.power,
        voltage: editingLoad.voltage,
        type: editingLoad.type,
        is_motor: editingLoad.is_motor ?? editingLoad.isMotor ?? false,
        is_essential: editingLoad.is_essential ?? false,
      });
    }
  }, [editingLoad]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { name, power, voltage, type, is_motor, is_essential } = form;

    if (!name || !power || !voltage || !type) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const { error } = await supabase.from("Loads").update({
          name,
          power: parseInt(power),
          voltage: parseInt(voltage),
          type,
          is_motor,
          is_essential,
        }).eq("id", editingLoad.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("Loads").insert([
          {
            name,
            power: parseInt(power),
            voltage: parseInt(voltage),
            type,
            is_motor,
            is_essential,
          },
        ]);

        if (error) throw error;
      }

      onLoadAdded(); // close and refresh list
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">
        {isEditing ? "Edit Load" : "Add New Load"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Load Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="power"
          placeholder="Power (W)"
          value={form.power}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <input
          type="number"
          name="voltage"
          placeholder="Voltage (V)"
          value={form.voltage}
          onChange={handleChange}
          className="w-full border p-2"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="Continuous">Continuous</option>
          <option value="Non-Continuous">Non-Continuous</option>
        </select>

        <label className="block">
          <input
            type="checkbox"
            name="is_motor"
            checked={form.is_motor}
            onChange={handleChange}
          />
          <span className="ml-2">Is Motor Load</span>
        </label>

        <label className="block">
          <input
            type="checkbox"
            name="is_essential"
            checked={form.is_essential}
            onChange={handleChange}
          />
          <span className="ml-2">Essential Load (auto-select)</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : isEditing ? "Update Load" : "Add Load"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadModal;
