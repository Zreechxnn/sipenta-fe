import { getCookie, setCookie, deleteCookie } from '@/presentation/utils/cookies';

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  if (token === 'hidden-httponly-token' || token === 'session-active') {
    if (typeof window !== 'undefined') {
      const expStr = sessionStorage.getItem('sipenta_expires_at') || getCookie('sipenta_expires_at');
      if (expStr) {
        const expTime = new Date(expStr).getTime();
        if (!isNaN(expTime)) {
          // Token is considered expired 30 seconds before actual expiration for proactive refresh
          return Date.now() >= expTime - 30000;
        }
      }
    }
    return false;
  }
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
    deleteCookie('sipenta_refresh_token');
    deleteCookie('sipenta_csrf');
    deleteCookie('sipenta_role');
    deleteCookie('sipenta_user');
    deleteCookie('sipenta_bidangId');
    deleteCookie('sipenta_bidang');
    deleteCookie('sipenta_isApproved');
    deleteCookie('sipenta_expires_at');

    // Clean client storage keys
    try {
      sessionStorage.clear();
      localStorage.removeItem('sipenta_token');
      localStorage.removeItem('sipenta_role');
      localStorage.removeItem('sipenta_user');
      localStorage.removeItem('sipenta_bidangId');
      localStorage.removeItem('sipenta_bidang');
      localStorage.removeItem('sipenta_isApproved');
      localStorage.removeItem('sipenta_expires_at');
      localStorage.removeItem('sipenta_refresh_token');
      sessionStorage.removeItem('sipenta_refresh_token');
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

export function getCsrfHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-Protection': '1',
  };

  if (typeof window !== 'undefined') {
    const csrfToken = getCookie('sipenta_csrf');
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
  }

  return headers;
}

let refreshPromise: Promise<boolean> | null = null;

export async function tryRefreshToken(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const currentRefreshToken = sessionStorage.getItem('sipenta_refresh_token') || getCookie('sipenta_refresh_token') || '';
      const response = await fetch(`${API_ENDPOINTS.AUTH}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json().catch(() => ({}));
      if (result && (result.token || result.Token || result.user || result.User)) {
        const token = result.token || result.Token;
        const refreshToken = result.refreshToken || result.RefreshToken;
        const user = result.user || result.User;

        if (token && token !== 'hidden-httponly-token') {
          setCookie('sipenta_token', token);
          try { sessionStorage.setItem('sipenta_token', token); } catch {}
        }
        if (refreshToken) {
          setCookie('sipenta_refresh_token', refreshToken);
          try { sessionStorage.setItem('sipenta_refresh_token', refreshToken); } catch {}
        }
        if (user) {
          const role = user.role || user.Role || 'user';
          setCookie('sipenta_role', role);
          setCookie('sipenta_user', JSON.stringify(user));
          try {
            sessionStorage.setItem('sipenta_role', role);
            sessionStorage.setItem('sipenta_user', JSON.stringify(user));
          } catch {}

          if (user.bidangId) {
            setCookie('sipenta_bidangId', String(user.bidangId));
            try { sessionStorage.setItem('sipenta_bidangId', String(user.bidangId)); } catch {}
          }
          if (user.bidang) {
            setCookie('sipenta_bidang', user.bidang);
            try { sessionStorage.setItem('sipenta_bidang', user.bidang); } catch {}
          }
          setCookie('sipenta_isApproved', String(user.isApproved ?? false));
          try { sessionStorage.setItem('sipenta_isApproved', String(user.isApproved ?? false)); } catch {}
        }
        if (result.expiresAt || result.ExpiresAt) {
          const exp = String(result.expiresAt || result.ExpiresAt);
          setCookie('sipenta_expires_at', exp);
          try { sessionStorage.setItem('sipenta_expires_at', exp); } catch {}
        }
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export function getAuthHeaders(isJson = false): Record<string, string> {
  const headers: Record<string, string> = {
    ...getCsrfHeaders(),
  };
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('sipenta_token') || getCookie('sipenta_token');
    if (token && token !== 'hidden-httponly-token' && token !== 'session-active') {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let currentToken: string | null = null;
  if (typeof window !== 'undefined') {
    currentToken = sessionStorage.getItem('sipenta_token') || getCookie('sipenta_token');
    const role = getCookie('sipenta_role') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sipenta_role') : null);

    // If neither token nor role exists, user is unauthenticated
    if (!role && !currentToken) {
      handleAutoLogout('expired');
      throw new Error('Session missing or expired');
    }
  }

  const headers = new Headers(init?.headers || {});
  const csrf = getCsrfHeaders();
  for (const [k, v] of Object.entries(csrf)) {
    if (!headers.has(k)) {
      headers.set(k, v);
    }
  }

  if (currentToken && currentToken !== 'hidden-httponly-token' && currentToken !== 'session-active' && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${currentToken}`);
  }

  const fetchInit: RequestInit = {
    ...init,
    headers,
    credentials: init?.credentials || 'include',
  };

  let response = await fetch(input, fetchInit);

  // If 401 received (e.g. 30-min JWT expired), attempt silent refresh and retry request
  if (response.status === 401 && typeof window !== 'undefined') {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const retryCsrf = getCsrfHeaders();
      for (const [k, v] of Object.entries(retryCsrf)) {
        headers.set(k, v);
      }
      const refreshedToken = sessionStorage.getItem('sipenta_token') || getCookie('sipenta_token');
      if (refreshedToken && refreshedToken !== 'hidden-httponly-token' && refreshedToken !== 'session-active') {
        headers.set('Authorization', `Bearer ${refreshedToken}`);
      }
      response = await fetch(input, {
        ...init,
        headers,
        credentials: init?.credentials || 'include',
      });
    }

    if (response.status === 401) {
      handleAutoLogout('unauthorized');
    }
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
