import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

export default function EditLoadModal({ load, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...load });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    const { error } = await supabase
      .from('master_loads')
      .update({
        name: form.name,
        power: parseInt(form.power),
        voltage: parseInt(form.voltage),
        type: form.type,
        is_motor: form.is_motor
      })
      .eq('id', form.id);

    if (error) {
      toast.error('Failed to update load');
    } else {
      toast.success('Load updated');
      onUpdate(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Edit Load</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Name"
          />
          <input
            type="number"
            name="power"
            value={form.power}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Power"
          />
          <input
            type="number"
            name="voltage"
            value={form.voltage}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Voltage"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Continuous">Continuous</option>
            <option value="Non-Continuous">Non-Continuous</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="is_motor"
              checked={form.is_motor}
              onChange={handleChange}
              className="form-checkbox"
            />
            <span>Is Motor</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
