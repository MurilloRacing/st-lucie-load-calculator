import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoadList from '@/components/LoadList';
import CreateTemplateModal from '@/components/CreateTemplateModal';

export default function TemplateEditor({ templateId }) {
  const [loads, setLoads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch items for this template
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('list_id', templateId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching template loads:', error);
    } else {
      setLoads(data);
    }
  };

  useEffect(() => {
    if (templateId) fetchItems();
  }, [templateId]);

  // Called after CreateTemplateModal inserts a new item
  const handleLoadAdded = () => {
    setShowAddModal(false);
    fetchItems();
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📝 Edit Template Loads</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Custom Load
        </button>
      </div>

      {/* Create Custom Load Form */}
      {showAddModal && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <CreateTemplateModal
            templateId={templateId}
            onLoadAdded={handleLoadAdded}
          />
        </div>
      )}

      {/* Editable Load List */}
      <LoadList
        loads={loads}
        setLoads={setLoads}
        templateId={templateId}
      />
    </div>
  );
}
