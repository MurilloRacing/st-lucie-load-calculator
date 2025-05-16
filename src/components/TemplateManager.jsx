// src/components/TemplateManager.jsx
import React, { useState, useEffect } from 'react';
import { fetchSamples } from '@/utils/api';

const TemplateManager = ({ onLoadTemplate, onRemoveTemplate, activeTemplates }) => {
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [individualMenuOpen, setIndividualMenuOpen] = useState(false);
  const [samples, setSamples] = useState([]);

  useEffect(() => {
    fetchSamples().then(setSamples);
  }, []);

  const handleLoad = (template) => {
    onLoadTemplate(template);
    setTemplateMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.template-menu')) {
        setTemplateMenuOpen(false);
        setIndividualMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-20 mb-4 space-y-4">
      {/* Top Controls */}
      <div className="flex gap-4">
        {/* Template Dropdown */}
        <div className="relative template-menu">
          <button
            onClick={() => setTemplateMenuOpen((prev) => !prev)}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition-all"
          >
            + Load Template ▼
          </button>
          {templateMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white shadow-lg rounded border border-gray-300 z-30">
              {samples.map((template, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-2 hover:bg-gray-100">
                  <span className="truncate">{template.label || `Sample ${idx + 1}`}</span>
                  <button
                    onClick={() => handleLoad(template)}
                    className="text-blue-600 hover:underline"
                  >
                    + Load
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Individual Loads */}
        <div className="relative template-menu">
          <button
            onClick={() => setIndividualMenuOpen((prev) => !prev)}
            className="bg-gray-900 text-white px-4 py-2 rounded shadow hover:bg-gray-700 transition-all"
          >
            + Individual Loads ▼
          </button>
          {individualMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white shadow-lg rounded border border-gray-300 z-30 p-2">
              {samples.flatMap((t) => t.items || []).map((load, idx) => (
                <div key={idx} className="flex justify-between items-center px-2 py-1 hover:bg-gray-100">
                  <span className="truncate text-sm">{load.name}</span>
                  <button
                    onClick={() => {
                      onLoadTemplate({ ...load, templateSource: 'Individual' });
                      setIndividualMenuOpen(false);
                    }}
                    className="text-green-600 hover:underline text-sm"
                  >
                    + Add
                  </button>
                </div>
              ))}
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
