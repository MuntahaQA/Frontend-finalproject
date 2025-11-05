export default async function sendRequest(url, method = 'GET', payload) {
  const options = { method, headers: {} };

  if (payload) {
    // If caller passed a FormData (file uploads), don't set JSON header or stringify
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      options.body = payload;
      // Let the browser set the multipart/form-data boundary
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
  }

  // Accept common token keys so login pages that store accessToken still work
  const token =
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken') ||
    localStorage.getItem('access');

  if (token) options.headers['Authorization'] = `Bearer ${token}`;

  try {
    // allow absolute URLs (for proxies or remote APIs) or relative API paths
    const fetchUrl = String(url).startsWith('http') ? url : `http://localhost:8000${url}`;
    const resp = await fetch(fetchUrl, options);
    if (!resp.ok) {
      // clear any known token keys on 401 to force re-login
      if (resp.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('access');
      }
      const txt = await resp.text().catch(() => '');
      // try to parse JSON error if present
      try {
        const jsonErr = JSON.parse(txt || '{}');
        const message = jsonErr.detail || jsonErr.error || txt;
        throw new Error(message || `HTTP ${resp.status}`);
      } catch {
        throw new Error(txt || `HTTP ${resp.status}`);
      }
    }
    return resp.status === 204 ? null : resp.json();
  } catch (error) {
    console.log(error, 'error in send-request');
    throw error;
  }
}
