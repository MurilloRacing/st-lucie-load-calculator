import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const LoadModal = ({ onClose, onLoadSaved }) => {
  const [name, setName] = useState('');
  const [power, setPower] = useState('');
  const [unit, setUnit] = useState('Watts'); // or 'Amps'
  const [voltage, setVoltage] = useState('');
  const [type, setType] = useState('Non-Continuous');
  const [isMotor, setIsMotor] = useState(false);

  const calculateWatts = () => {
    if (unit === 'Watts') return parseFloat(power) || 0;
    if (unit === 'Amps') return (parseFloat(power) || 0) * (parseFloat(voltage) || 0);
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wattValue = calculateWatts();

    const { error } = await supabase.from('loads').insert([{
      name,
      power: wattValue,
      voltage: parseFloat(voltage) || null,
      type,
      is_motor: isMotor,
    }]);

    if (error) {
      console.error('Supabase insert error:', error);
      toast.error(`Error saving load: ${error.message}`);
    } else {
      toast.success('Load saved successfully!');
      onLoadSaved?.();
      onClose();
    }
  };

  return (
    <div className="modal p-4 bg-white shadow-md rounded">
      <h2 className="text-lg font-semibold mb-4">Add New Load</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex gap-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder={unit}
            value={power}
            onChange={(e) => setPower(e.target.value)}
            required
          />
          <select
            className="border rounded p-2"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option>Watts</option>
            <option>Amps</option>
          </select>
        </div>

        {unit === 'Amps' && (
          <input
            className="w-full p-2 border rounded"
            placeholder="Voltage (required for Amps)"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
            required
          />
        )}

        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Non-Continuous">Non-Continuous</option>
          <option value="Continuous">Continuous</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isMotor}
            onChange={(e) => setIsMotor(e.target.checked)}
          />
          Is Motor Load?
        </label>

        <div className="flex justify-between mt-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save Load
          </button>
          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadModal;
