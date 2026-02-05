// Supabase client helper (optional). This uses dynamic import so the project
// does not require `@supabase/supabase-js` to be installed if you don't use it.
let supabase: any = null;

export async function initSupabase(url?: string, key?: string) {
  const SUPA_URL = url || (globalThis as any).VITE_SUPABASE_URL;
  const SUPA_KEY = key || (globalThis as any).VITE_SUPABASE_ANON_KEY;
  if (!SUPA_URL || !SUPA_KEY) throw new Error('Supabase URL/Key not provided');
  const { createClient } = await import('@supabase/supabase-js');
  supabase = createClient(SUPA_URL, SUPA_KEY);
  return supabase;
}

export function getSupabase() {
  if (!supabase) throw new Error('Supabase not initialized. Call initSupabase() first.');
  return supabase;
}
