import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

const CreateTemplateModal = ({ templateId, onLoadAdded }) => {
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

    let power = Number(form.power);

    if (form.useAmps) {
      const amps = parseFloat(form.amps);
      const volts = parseFloat(form.voltage);
      if (isNaN(amps) || isNaN(volts)) {
        toast.error('Invalid amps or voltage');
        return;
      }
      power = amps * volts;
    }

    const { data, error } = await supabase
      .from('load_list_items')
      .insert({
        list_id: templateId,
        name: form.name,
        power,
        voltage: form.voltage,
        type: 'Non-Continuous',
        is_motor: form.is_motor
      });

    if (error) {
      console.error('Insert failed:', error);
      toast.error('Failed to create load.');
    } else {
      toast.success('Load created!');
      onLoadAdded();
      setForm({
        name: '',
        power: '',
        voltage: '',
        is_motor: false,
        useAmps: false,
        amps: ''
      });
    }
  };

  return (
    <form className="mb-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-2">➕ Add Custom Load</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border rounded p-2"
          placeholder="Load Name"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Voltage (e.g. 120)"
          value={form.voltage}
          onChange={(e) => handleChange('voltage', e.target.value)}
          required
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.useAmps}
            onChange={(e) => handleChange('useAmps', e.target.checked)}
          />
          <label>Use Amps Instead of Watts</label>
        </div>

        {form.useAmps ? (
          <input
            className="border rounded p-2"
            placeholder="Amps"
            value={form.amps}
            onChange={(e) => handleChange('amps', e.target.value)}
            required
          />
        ) : (
          <input
            className="border rounded p-2"
            placeholder="Power (Watts)"
            value={form.power}
            onChange={(e) => handleChange('power', e.target.value)}
            required
          />
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={form.is_motor}
            onChange={(e) => handleChange('is_motor', e.target.checked)}
          />
          <label>Is Motor?</label>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save Load
      </button>
    </form>
  );
};

export default CreateTemplateModal;
