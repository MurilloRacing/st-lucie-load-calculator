import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const CreateTemplateModal = ({ templateId, onLoadAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    power: '',
    voltage: '',
    is_motor: false,
    useAmps: false,
    amps: ''
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let power = Number(form.power);

      if (form.useAmps) {
        const amps = parseFloat(form.amps);
        const volts = parseFloat(form.voltage);
        
        if (isNaN(amps) || isNaN(volts)) {
          throw new Error('Invalid amps or voltage values');
        }
        
        power = amps * volts;
      } else if (isNaN(power) || power <= 0) {
        throw new Error('Invalid power value');
      }

      const { error } = await supabase
        .from('load_list_items')
        .insert({
          list_id: templateId,
          name: form.name.trim(),
          power,
          voltage: parseFloat(form.voltage),
          type: 'Non-Continuous',
          is_motor: form.is_motor
        });

      if (error) throw error;

      toast.success('Load created successfully!');
      onLoadAdded();
      
      // Reset form
      setForm({
        name: '',
        power: '',
        voltage: '',
        is_motor: false,
        useAmps: false,
        amps: ''
      });
    } catch (error) {
      console.error('Error creating load:', error);
      toast.error(error.message || 'Failed to create load');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="bg-white rounded-lg shadow-sm p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">➕ Add Custom Load</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Load Name</label>
          <input
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter load name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-600">Voltage</label>
          <input
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            type="number"
            placeholder="e.g. 120"
            value={form.voltage}
            onChange={(e) => handleChange('voltage', e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useAmps"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={form.useAmps}
            onChange={(e) => handleChange('useAmps', e.target.checked)}
          />
          <label htmlFor="useAmps" className="text-sm">Use Amps Instead of Watts</label>
        </div>

        {form.useAmps ? (
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Amps</label>
            <input
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              step="0.1"
              placeholder="Enter amps"
              value={form.amps}
              onChange={(e) => handleChange('amps', e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Power (Watts)</label>
            <input
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              placeholder="Enter watts"
              value={form.power}
              onChange={(e) => handleChange('power', e.target.value)}
              required
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isMotor"
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            checked={form.is_motor}
            onChange={(e) => handleChange('is_motor', e.target.checked)}
          />
          <label htmlFor="isMotor" className="text-sm">Is Motor?</label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-6 px-4 py-2 rounded text-white transition-colors
          ${isSubmitting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {isSubmitting ? 'Saving...' : 'Save Load'}
      </button>
    </form>
  );
};

export default CreateTemplateModal;
