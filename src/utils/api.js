// src/utils/api.js
import { supabase } from '@/supabase/client';

/**
 * Fetch all template entries from `load_lists` where category is 'Template'
 */
export async function fetchTemplates() {
  const { data, error } = await supabase
    .from('load_lists')
    .select('*')
    .eq('category', 'Template')
    .order('name');

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch items for a given template from `load_list_items`
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
      is_motor
    `)
    .eq('list_id', templateId)
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
 * Fetch individual load items from `master_loads`
 */
export async function fetchIndividualLoads() {
  const { data, error } = await supabase
    .from('master_loads')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching individual loads:', error);
    return [];
  }

  return data.map(item => ({
    ...item,
    templateSource: 'Individual',
    enabled: true
  }));
}
