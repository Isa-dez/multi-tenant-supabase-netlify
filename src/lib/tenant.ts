import { supabase } from './supabaseClient'

export async function resolveOrganizationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}
