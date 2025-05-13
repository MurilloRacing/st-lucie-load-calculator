import { useEffect, useState } from 'react';
import LoadList from './LoadList';
import LoadModal from './LoadModal'; // 🧠 Using your existing component
import { supabase } from '../lib/supabaseClient';

export default function TemplateEditor({ templateId }) {
  const [loads, setLoads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('list_id', templateId);

    if (!error) setLoads(data);
    else console.error(error);
  };

  useEffect(() => {
    if (templateId) fetchItems();
  }, [templateId]);

  const saveLoadItem = async (updatedLoad) => {
    const { error } = await supabase
      .from('load_list_items')
      .update(updatedLoad)
      .eq('id', updatedLoad.id);

    if (error) console.error(error);
    else {
      setLoads((prev) =>
        prev.map((l) => (l.id === updatedLoad.id ? updatedLoad : l))
      );
    }
  };

  const deleteLoadItem = async (id) => {
    const { error } = await supabase
      .from('load_list_items')
      .delete()
      .eq('id', id);

    if (error) console.error(error);
    else setLoads((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAddCustomLoad = async (newLoad) => {
    const { data, error } = await supabase
      .from('load_list_items')
      .insert([{ ...newLoad, list_id: templateId }])
      .select();

    if (error) {
      console.error(error);
    } else {
      setLoads((prev) => [...prev, ...data]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📝 Edit Load Items</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Custom Load
        </button>
      </div>

      <LoadList
        loads={loads}
        setLoads={setLoads}
        onEdit={saveLoadItem}
        onDelete={deleteLoadItem}
        showCheckboxes={false}
      />

      {showAddModal && (
        <LoadModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCustomLoad}
        />
      )}
    </div>
  );
}
