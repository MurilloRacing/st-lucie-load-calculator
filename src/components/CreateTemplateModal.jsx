import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';


export default function CreateTemplateModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  const handleSave = async () => {
    if (!name || !category) {
      toast.error("Name and category are required.");
      return;
    }

    const { error } = await supabase
      .from('load_list_templates')
      .insert([{ name, category }]);

    if (error) {
      toast.error("Failed to create template.");
      console.error(error);
    } else {
      toast.success("Template created!");
      onCreated(); // trigger refresh
      onClose();   // close modal
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">➕ New Load List Template</h2>

        <label className="block text-sm mb-1">Template Name</label>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="e.g., Office Default"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm mb-1">Category</label>
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="e.g., Office, Auto Shop"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:underline">Cancel</button>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
