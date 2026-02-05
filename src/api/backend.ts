// Determine API base URL. Prefer Vite env, then global var, then sensible default for local dev.
let API_BASE = '';
const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_URL) || null;
const globalEnv = (globalThis as any).VITE_API_URL || null;
if (viteEnv) API_BASE = viteEnv;
else if (globalEnv) API_BASE = globalEnv;
else {
  // If running on localhost (frontend dev), default to backend on port 4000
  try {
    if (typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      API_BASE = 'http://localhost:4000';
    } else {
      API_BASE = '';
    }
  } catch (e) {
    API_BASE = '';
  }
}

let _backendAvailable: boolean | null = null;

async function safeFetch(path: string, opts?: RequestInit) {
  try {
    const res = await fetch(`${API_BASE}${path}`, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn('[api] fetch failed for', path, e);
    throw e;
  }
}

async function checkBackend(timeoutMs = 2000): Promise<boolean> {
  if (_backendAvailable !== null) return _backendAvailable;
  if (!API_BASE) {
    _backendAvailable = false;
    return _backendAvailable;
  }
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${API_BASE}/api/health`, { signal: controller.signal });
    clearTimeout(id);
    _backendAvailable = res.ok;
    return _backendAvailable;
  } catch (e) {
    _backendAvailable = false;
    return _backendAvailable;
  }
}

async function probeBackendOnce(timeoutMs = 1500): Promise<boolean> {
  if (!API_BASE) return false;
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${API_BASE}/api/health`, { signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (e) {
    return false;
  }
}

function backendAvailableCached(): boolean | null {
  return _backendAvailable;
}

function invalidateBackendCache() {
  _backendAvailable = null;
}

export { API_BASE, safeFetch, checkBackend, backendAvailableCached, invalidateBackendCache };

// Helper wrappers that prefer backend when available or when forced via env.
const FORCE_BACKEND = ((typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_FORCE_BACKEND === 'true') || (globalThis as any).VITE_FORCE_BACKEND === 'true');

async function apiGet(path: string) {
  let ok = FORCE_BACKEND ? true : await checkBackend();
  if (!ok) {
    // try a quick probe in case cache is stale
    ok = await probeBackendOnce();
    _backendAvailable = ok;
  }
  if (!ok) throw new Error('backend-not-available');
  return safeFetch(path);
}

async function apiPost(path: string, body: any) {
  console.log('🔵 apiPost called for path:', path);
  let ok = FORCE_BACKEND ? true : await checkBackend();
  console.log('   Backend available check:', ok, '(FORCE_BACKEND=' + FORCE_BACKEND + ')');
  if (!ok) {
    ok = await probeBackendOnce();
    _backendAvailable = ok;
    console.log('   Probe result:', ok);
  }
  if (!ok) {
    console.error('   Backend NOT available, throwing error');
    throw new Error('backend-not-available');
  }
  console.log('   Sending to', API_BASE + path, 'with body:', body);
  try {
    const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    console.log('   Response status:', res.status, res.ok);
    if (!res.ok) {
      let errMsg = `HTTP ${res.status}`;
      try {
        const errJson = await res.json();
        if (errJson && (errJson.error || errJson.message)) errMsg = errJson.error || errJson.message;
        else errMsg = JSON.stringify(errJson);
      } catch (e) {
        try { errMsg = await res.text(); } catch { /* ignore */ }
      }
      console.error('   apiPost non-ok response:', res.status, errMsg);
      throw new Error(errMsg || `HTTP ${res.status}`);
    }
    const json = await res.json();
    console.log('   Response body:', json);
    return json;
  } catch (e) {
    console.error('   apiPost error:', e);
    throw e;
  }
}

async function apiPut(path: string, body: any) {
  let ok = FORCE_BACKEND ? true : await checkBackend();
  if (!ok) {
    ok = await probeBackendOnce();
    _backendAvailable = ok;
  }
  if (!ok) throw new Error('backend-not-available');
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

async function apiDelete(path: string) {
  let ok = FORCE_BACKEND ? true : await checkBackend();
  if (!ok) {
    ok = await probeBackendOnce();
    _backendAvailable = ok;
  }
  if (!ok) throw new Error('backend-not-available');
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return null; // No content
  return await res.json();
}

export { apiGet, apiPost, apiPut, apiDelete, FORCE_BACKEND };
