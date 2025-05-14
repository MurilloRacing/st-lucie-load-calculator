import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

const LoadModal = ({ onClose, onLoadSaved, onSave, templateId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    power: '',
    unit: 'Watts',
    voltage: '120',
    customVoltage: '',
    type: 'Non-Continuous',
    isMotor: false
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ 
      ...prev, 
      [field]: value,
      // Reset custom voltage if voltage selection changes
      ...(field === 'voltage' && value !== 'custom' && { customVoltage: '' })
    }));
  };

  const getVoltage = () => form.voltage === 'custom'
    ? parseFloat(form.customVoltage)
    : parseFloat(form.voltage);

  const calculateWatts = () => {
    const volts = getVoltage();
    if (form.unit === 'Watts') return parseFloat(form.power) || 0;
    if (form.unit === 'Amps') return (parseFloat(form.power) || 0) * (volts || 0);
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const volts = getVoltage();
      const wattValue = calculateWatts();

      if (isNaN(wattValue) || wattValue <= 0) {
        throw new Error('Invalid power value');
      }

      const newLoad = {
        name: form.name.trim(),
        power: wattValue,
        voltage: isNaN(volts) ? 120 : volts,
        type: form.type,
        is_motor: form.isMotor,
      };

      if (onSave) {
        await onSave(templateId ? { ...newLoad, list_id: templateId } : newLoad);
        toast.success('Load added to template!');
        onClose();
        return;
      }

      const { error } = await supabase.from('Loads').insert([newLoad]);
      if (error) throw error;

      toast.success('Load saved successfully!');
      onLoadSaved?.();
      onClose();
    } catch (error) {
      console.error('Error saving load:', error);
      toast.error(error.message || 'Failed to save load');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-6">➕ Add New Load</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Load Name</label>
          <input
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter load name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <label className="text-sm text-gray-600">Power</label>
            <input
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              type="number"
              step="0.1"
              min="0"
              placeholder={form.unit}
              value={form.power}
              onChange={(e) => handleChange('power', e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Unit</label>
            <select
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={form.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
            >
              <option>Watts</option>
              <option>Amps</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Voltage</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={form.voltage}
            onChange={(e) => handleChange('voltage', e.target.value)}
            required
          >
            <option value="">Select Voltage</option>
            <option value="120">120V</option>
            <option value="208">208V</option>
            <option value="240">240V</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {form.voltage === 'custom' && (
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Custom Voltage</label>
            <input
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              type="number"
              min="0"
              placeholder="Enter voltage"
              value={form.customVoltage}
              onChange={(e) => handleChange('customVoltage', e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Load Type</label>
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            <option value="Non-Continuous">Non-Continuous</option>
            <option value="Continuous">Continuous</option>
          </select>
        </div>

        <label className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={form.isMotor}
            onChange={(e) => handleChange('isMotor', e.target.checked)}
          />
          <span className="text-sm text-gray-600">Is Motor Load?</span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded text-white transition-colors
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Load'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoadModal;
