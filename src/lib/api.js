const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function submitSurveyResponse(payload) {
  return request('/api/responses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
