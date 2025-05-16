import { supabase } from '@/supabase/client';

/**
 * Fetch Load Templates from `load_list_templates` (e.g., Core120, Breakroom)
 */
export async function fetchTemplates() {
  const { data, error } = await supabase
    .from('load_list_templates')
    .select('*');

  if (error) {
    console.error('Error fetching template list:', error);
    return [];
  }

  return data;
}

/**
 * Fetch items for a given template ID from `load_list_items`
 */
export async function fetchTemplateItems(templateId) {
  const { data, error } = await supabase
    .from('load_list_items')
    .select('*')
    .eq('list_id', templateId);

  if (error) {
    console.error(`Error fetching items for template ${templateId}:`, error);
    return [];
  }

  return data.map(item => ({
    ...item,
    templateSource: templateId,
  }));
}

/**
 * Fetch individual loads from `Loads` table
 */
export async function fetchIndividualLoads() {
  const { data, error } = await supabase
    .from('Loads')
    .select('*');

  if (error) {
    console.error('Error fetching individual loads:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    templateSource: 'Individual',
  }));
}
