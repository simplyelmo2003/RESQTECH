declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any;
  export type SupabaseClient = any;
}
