import { useEffect, useState } from 'react';
import LoadList from './LoadList';
import { supabase } from '../lib/supabaseClient';

export default function TemplateEditor({ templateId }) {
  const [loads, setLoads] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('load_list_items')
        .select('*')
        .eq('list_id', templateId);

      if (error) console.error(error);
      else setLoads(data);
    };

    if (templateId) fetchItems();
  }, [templateId]);

  const saveLoadItem = async (updatedLoad) => {
    const { error } = await supabase
      .from('load_list_items')
      .update(updatedLoad)
      .eq('id', updatedLoad.id);

    if (error) console.error(error);
    else {
      setLoads((prev) => prev.map((l) => (l.id === updatedLoad.id ? updatedLoad : l)));
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📝 Edit Load Items</h2>
      <LoadList
        loads={loads}
        setLoads={setLoads}
        templateId={templateId}
        onEdit={saveLoadItem}
        onDelete={deleteLoadItem}
        showCheckboxes={false}
      />
    </div>
  );
}
