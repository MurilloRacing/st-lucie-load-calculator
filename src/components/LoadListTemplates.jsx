import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import CreateTemplateModal from './CreateTemplateModal';

export default function LoadListTemplates() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_list_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const loadTemplateItems = async (templateId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_list_items')
        .select('*')
        .eq('list_id', templateId);

      if (error) throw error;
      setSelectedTemplate(templateId);
      setItems(data);
    } catch (error) {
      toast.error('Failed to load template items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📋 Load List Templates</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          ➕ New Template
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <ul className="space-y-2 mb-6">
            {templates.map((tpl) => (
              <li
                key={tpl.id}
                className="flex items-center justify-between border p-3 rounded bg-white shadow-sm hover:shadow transition-shadow"
              >
                <div>
                  <strong>{tpl.name}</strong>
                  <span className="text-sm text-gray-500 ml-2">
                    ({tpl.category})
                  </span>
                </div>
                <button
                  onClick={() => loadTemplateItems(tpl.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  View Items
                </button>
              </li>
            ))}
          </ul>

          {selectedTemplate && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-4 border-b">
                <h2 className="text-xl font-semibold">🧱 Template Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">
                        Name
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">
                        Power (W)
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">
                        Voltage
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">
                        Type
                      </th>
                      <th className="px-4 py-3 text-center font-medium text-gray-600">
                        Motor?
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3 text-right">{item.power} W</td>
                        <td className="px-4 py-3 text-center">{item.voltage} V</td>
                        <td className="px-4 py-3 text-center">{item.type}</td>
                        <td className="px-4 py-3 text-center">
                          {item.is_motor ? '✓' : '–'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
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
