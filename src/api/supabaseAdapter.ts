import { initSupabase, getSupabase } from '@/lib/supabaseClient';

// Small adapter that exposes similar functions used by the frontend modules.
// Note: requires `@supabase/supabase-js` installed in the frontend project.

export async function initSupabaseFromEnv() {
  try {
    initSupabase();
  } catch (e) {
    // no-op if not configured
  }
}

export async function fetchEvacCentersFromSupabase() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('evac_centers').select('*');
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase evac centers fetch failed', e);
    return null;
  }
}

export async function fetchIncidentReportsFromSupabase() {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('incident_reports').select('*');
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase incident reports fetch failed', e);
    return null;
  }
}

export async function postMessageToSupabase(message: any) {
  try {
    const sb = getSupabase();
    const { data, error } = await sb.from('messages').insert([message]);
    if (error) throw error;
    return data;
  } catch (e) {
    console.warn('Supabase post message failed', e);
    return null;
  }
}
