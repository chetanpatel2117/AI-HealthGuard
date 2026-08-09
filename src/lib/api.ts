const rawApiBase = (import.meta as any).env?.VITE_API_BASE_URL || '';

export const API_BASE = rawApiBase.replace(/\/$/, '');

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith('/')) {
    return `${API_BASE}${path}`;
  }

  return `${API_BASE}/${path}`;
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const url = apiUrl(input);
  return fetch(url, init);
}
