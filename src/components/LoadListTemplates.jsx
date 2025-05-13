import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import CreateTemplateModal from './CreateTemplateModal';

export default function LoadListTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('load_list_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch templates');
    } else {
      setTemplates(data);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const loadTemplateItems = async (templateId) => {
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('list_id', templateId);

    if (error) {
      toast.error('Failed to load template items');
    } else {
      setSelectedTemplate(templateId);
      setItems(data);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📋 Load List Templates</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ New Template
        </button>
      </div>

      <ul className="space-y-2 mb-6">
        {templates.map((tpl) => (
          <li key={tpl.id} className="flex items-center justify-between border p-3 rounded bg-white shadow-sm">
            <div>
              <strong>{tpl.name}</strong> <span className="text-sm text-gray-500">({tpl.category})</span>
            </div>
            <button
              onClick={() => loadTemplateItems(tpl.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              View Items
            </button>
          </li>
        ))}
      </ul>

      {selectedTemplate && (
        <div className="bg-gray-100 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">🧱 Template Items</h2>
          <table className="w-full text-sm border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Power (W)</th>
                <th className="p-2 text-left">Voltage</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Motor?</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.power}</td>
                  <td className="p-2">{item.voltage}</td>
                  <td className="p-2">{item.type}</td>
                  <td className="p-2">{item.is_motor ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateTemplateModal
          onClose={() => setShowModal(false)}
          onCreated={fetchTemplates}
        />
      )}
    </div>
  );
}
