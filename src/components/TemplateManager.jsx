// src/components/TemplateManager.jsx
import React, { useEffect, useState } from 'react';
import {
  fetchTemplates,
  fetchTemplateItems,
  fetchIndividualLoads
} from '@/utils/api';

const TemplateManager = ({ onLoadTemplate, onRemoveTemplate, activeTemplates }) => {
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [individualMenuOpen, setIndividualMenuOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [individualLoads, setIndividualLoads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesData, loadsData] = await Promise.all([
          fetchTemplates(),
          fetchIndividualLoads()
        ]);
        setTemplates(templatesData);
        setIndividualLoads(loadsData);
      } catch (error) {
        console.error('Failed to load templates:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleLoadTemplate = async (template) => {
    try {
      const items = await fetchTemplateItems(template.id);
      onLoadTemplate({
        label: template.name,
        items: items.map(item => ({ ...item, templateSource: template.name }))
      });
      setTemplateMenuOpen(false);
    } catch (error) {
      console.error('Failed to load template items:', error);
    }
  };

  const handleLoadIndividual = (load) => {
    onLoadTemplate({
      label: 'Individual',
      items: [{ ...load, templateSource: 'Individual' }]
    });
    setIndividualMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setTemplateMenuOpen(false);
        setIndividualMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-20 mb-4 space-y-4">
      <div className="flex gap-4">
        {/* Template Dropdown */}
        <div className="relative dropdown-menu">
          <button
            onClick={() => setTemplateMenuOpen(prev => !prev)}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '+ Load Template ▼'}
          </button>
          {templateMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded border border-gray-300 z-30">
              {templates.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No templates available</div>
              ) : (
                templates.map((tpl) => (
                  <div key={tpl.id} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                    <span className="truncate">{tpl.name}</span>
                    <button
                      onClick={() => handleLoadTemplate(tpl)}
                      className="text-blue-600 hover:underline"
                    >
                      + Load
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Individual Loads Dropdown */}
        <div className="relative dropdown-menu">
          <button
            onClick={() => setIndividualMenuOpen(prev => !prev)}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition-all"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '+ Individual Loads ▼'}
          </button>
          {individualMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white shadow-lg rounded border border-gray-300 z-30 p-2">
              {individualLoads.length === 0 ? (
                <div className="px-2 py-1 text-gray-500">No loads available</div>
              ) : (
                individualLoads.map((load) => (
                  <div key={load.id} className="flex justify-between items-center px-2 py-1 hover:bg-gray-100">
                    <span className="truncate text-sm">{load.name}</span>
                    <button
                      onClick={() => handleLoadIndividual(load)}
                      className="text-green-600 hover:underline text-sm"
                    >
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active Templates Display */}
      {activeTemplates?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTemplates.map((tpl, idx) => (
            <div
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center shadow-sm hover:bg-blue-200 cursor-pointer transition-all"
              onClick={() => onRemoveTemplate(tpl)}
              title="Click to remove"
            >
              {tpl} <span className="ml-2 font-bold text-blue-600">×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateManager;
