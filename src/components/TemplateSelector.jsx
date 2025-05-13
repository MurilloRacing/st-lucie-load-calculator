// TemplateSelector.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function TemplateSelector() {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase.from('load_list_templates').select('*');
      if (error) console.error('Error fetching templates:', error);
      else setTemplates(data);
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = async (templateId) => {
    const { data, error } = await supabase
      .from('load_list_items')
      .select('*')
      .eq('template_id', templateId);

    if (error) {
      console.error('Error fetching template items:', error);
    } else {
      localStorage.setItem('loadedLoads', JSON.stringify(data));
      navigate('/new'); // Redirect to the NewCalculator page
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Load Template</h1>
      <ul>
        {templates.map(template => (
          <li key={template.id}>
            <button
              onClick={() => handleTemplateSelect(template.id)}
              className="text-blue-500 underline hover:text-blue-700"
            >
              {template.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplateSelector;