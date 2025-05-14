import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LoadList from '@/components/LoadList';
import CreateTemplateModal from '@/components/CreateTemplateModal';
import toast from 'react-hot-toast';

export default function TemplateEditor({ templateId }) {
  const [loads, setLoads] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch items for this template
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_list_items')
        .select('*')
        .eq('list_id', templateId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLoads(data);
    } catch (error) {
      console.error('Error fetching template loads:', error);
      toast.error('Failed to load template items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) fetchItems();
  }, [templateId]);

  // Called after CreateTemplateModal inserts a new item
  const handleLoadAdded = async () => {
    setShowAddModal(false);
    await fetchItems();
    toast.success('Load added successfully');
  };

  // Handle load deletion
  const handleDeleteLoad = async (loadId) => {
    try {
      const { error } = await supabase
        .from('load_list_items')
        .delete()
        .eq('id', loadId);

      if (error) throw error;
      
      setLoads(prev => prev.filter(load => load.id !== loadId));
      toast.success('Load deleted successfully');
    } catch (error) {
      console.error('Error deleting load:', error);
      toast.error('Failed to delete load');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📝 Edit Template Loads</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded 
                   hover:bg-green-700 transition-colors"
        >
          ➕ Add Custom Load
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 
                        border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Create Custom Load Form */}
          {showAddModal && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <CreateTemplateModal
                templateId={templateId}
                onLoadAdded={handleLoadAdded}
                onClose={() => setShowAddModal(false)}
              />
            </div>
          )}

          {/* Editable Load List */}
          {loads.length > 0 ? (
            <LoadList
              loads={loads}
              setLoads={setLoads}
              templateId={templateId}
              onDelete={handleDeleteLoad}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No loads added to this template yet.
              Click "Add Custom Load" to get started.
            </div>
          )}
        </>
      )}
    </div>
  );
}
