import { getCookie, deleteCookie } from '@/presentation/utils/cookies';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);

    if (!parsed.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return parsed.exp <= currentTime + 5;
  } catch {
    return true;
  }
}

export function handleAutoLogout(reason = 'expired'): void {
  if (typeof window !== 'undefined') {
    deleteCookie('sipenta_token');
    deleteCookie('sipenta_role');
    deleteCookie('sipenta_user');
    deleteCookie('sipenta_bidangId');
    deleteCookie('sipenta_bidang');
    deleteCookie('sipenta_isApproved');

    // Clean any legacy localStorage keys
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('bidangId');
      localStorage.removeItem('bidang');
      localStorage.removeItem('isApproved');
    } catch {}

    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?reason=${reason}`;
    }
  }
}

export function getAuthHeaders(isJson = false): Record<string, string> {
  const headers: Record<string, string> = {};
  // Note: We don't manually append the Authorization header here
  // because the backend handles it via HttpOnly cookies and credentials='include'
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // We can't check the HttpOnly token's expiration directly from JS.
  // We rely on the role cookie as a proxy for 'is logged in'.
  if (typeof window !== 'undefined') {
    const role = getCookie('sipenta_role');
    if (!role) {
      handleAutoLogout('expired');
      throw new Error('Session missing or expired');
    }
  }

  const fetchInit: RequestInit = {
    ...init,
    credentials: init?.credentials || 'include',
  };

  const response = await fetch(input, fetchInit);
  if (response.status === 401) {
    handleAutoLogout('unauthorized');
  }
  return response;
}

export const API_ENDPOINTS = {
  get AUTH() { return `${getApiBaseUrl()}/Auth`; },
  get DOCUMENTS() { return `${getApiBaseUrl()}/Documents`; },
  get USER() { return `${getApiBaseUrl()}/User`; },
  get CHAT() { return `${getApiBaseUrl()}/Chat`; },
  get BIDANG() { return `${getApiBaseUrl()}/bidang`; },
  get DASHBOARD() { return `${getApiBaseUrl()}/Dashboard`; },
};
