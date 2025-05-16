// src/utils/api.js
import { supabase } from '@/supabase/client';

/**
 * Fetch Load Templates from `load_lists` table
 */
export async function fetchTemplates() {
  const { data, error } = await supabase
    .from('load_lists')
    .select('*')
    .eq('category', 'Template')
    .order('name');

  if (error) {
    console.error('Error fetching template list:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch items for a given template ID from `load_list_items`
 */
export async function fetchTemplateItems(templateId) {
  const { data, error } = await supabase
    .from('load_list_items')
    .select(`
      id,
      name,
      power,
      voltage,
      type,
      is_motor,
      template_id,
      created_at
    `)
    .eq('template_id', templateId)
    .order('name');

  if (error) {
    console.error(`Error fetching items for template ${templateId}:`, error);
    return [];
  }

  return data.map(item => ({
    ...item,
    templateSource: templateId,
    enabled: true
  }));
}

/**
 * Fetch individual loads from `Loads` table
 */
export async function fetchIndividualLoads() {
  const { data, error } = await supabase
    .from('Loads')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching individual loads:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    templateSource: 'Individual'
  }));
}

/**
 * (Optional) Fetch saved load lists from `load_lists` if needed in another context
 */
export async function fetchSavedLoadLists() {
  const { data, error } = await supabase
    .from('load_lists') // ✅ correct table
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved load lists:', error);
    return [];
  }

  return data || [];
}
