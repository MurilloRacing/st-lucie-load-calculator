// src/utils/api.js
import { supabase } from '@/supabase/client';

// 1. Fetch from `load_samples` (static templates)
export async function fetchSamples() {
  const { data, error } = await supabase.from('load_samples').select('*');
  if (error) {
    console.error('Error fetching samples:', error);
    return [];
  }
  return data;
}

// 2. Fetch saved template metadata from `load_lists`
export async function fetchSavedTemplates() {
  const { data, error } = await supabase.from('load_lists').select('*');
  if (error) {
    console.error('Error fetching saved templates:', error);
    return [];
  }
  return data;
}

// 3. Fetch saved items for a specific `load_list_id`
export async function fetchTemplateItems(loadListId) {
  const { data, error } = await supabase
    .from('load_items')
    .select('*')
    .eq('load_list_id', loadListId);

  if (error) {
    console.error('Error fetching template items:', error);
    return [];
  }
  return data;
}
