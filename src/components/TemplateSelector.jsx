// TemplateSelector.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

function TemplateSelector() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_list_templates')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('load_list_items')
        .select('*')
        .eq('template_id', templateId);

      if (error) throw error;

      localStorage.setItem('loadedLoads', JSON.stringify(data));
      toast.success('Template loaded successfully');
      navigate('/new');
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📋 Load Templates</h1>
          <Link
            to="/templates/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            ➕ New Template
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : templates.length > 0 ? (
          <ul className="space-y-2">
            {templates.map(template => (
              <li 
                key={template.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleTemplateSelect(template.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded 
                             hover:bg-blue-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Use Template'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No templates available. Click "New Template" to create one.
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateSelector;