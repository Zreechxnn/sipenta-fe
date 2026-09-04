import { IAuthRepository } from '@/core/repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/core/domain/auth';
import { API_ENDPOINTS, getCsrfHeaders, tryRefreshToken, getAccessToken, setAccessToken } from '../api/apiClient';
import { getCookie, setCookie, deleteCookie } from '@/presentation/utils/cookies';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        message: result.message || result.pesan || 'Login gagal',
        isLockedOut: result.isLockedOut || response.status === 429,
        retryAfterSeconds: result.retryAfterSeconds,
        remainingAttempts: result.remainingAttempts,
      };
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { message: result.message || result.pesan || 'Login dengan Google gagal' };
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfHeaders(),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        sukses: false,
        message: result.message || result.pesan || 'Registrasi gagal',
      };
    }
    return {
      sukses: true,
      message: result.message || result.pesan || 'Registrasi berhasil',
      ...result,
    };
  }

  async refreshToken(): Promise<boolean> {
    return await tryRefreshToken();
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // 1. Check in-memory access token first (RAM)
    const inMem = getAccessToken();
    if (inMem) return inMem;

    // 2. Fallback check from storage if present (e.g. legacy session)
    const storedToken = sessionStorage.getItem('sipenta_token') || getCookie('sipenta_token');
    if (storedToken && storedToken !== 'hidden-httponly-token' && storedToken !== 'session-active') {
      setAccessToken(storedToken);
      return storedToken;
    }

    // 3. If session role exists, session is active (silent refresh will populate in-memory token)
    const role = getCookie('sipenta_role') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sipenta_role') : null);
    if (role) {
      return 'session-active';
    }

    return null;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const role = getCookie('sipenta_role') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sipenta_role') : null);
    if (!role) {
      return null;
    }
    return role;
  }

  getUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = getCookie('sipenta_user') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('sipenta_user') : null);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, role: string, user?: any, expiresAt?: string, _refreshToken?: string): void {
    if (typeof window === 'undefined') return;

    // 1. Store JWT strictly in memory (RAM), NEVER in sessionStorage / localStorage / document.cookie
    if (token && token !== 'hidden-httponly-token' && token !== 'session-active') {
      setAccessToken(token);
    }

    // 2. Purge tokens and legacy items from client-accessible storage
    try {
      sessionStorage.removeItem('sipenta_token');
      sessionStorage.removeItem('sipenta_refresh_token');
      deleteCookie('sipenta_token');
      deleteCookie('sipenta_refresh_token');

      localStorage.removeItem('sipenta_token');
      localStorage.removeItem('sipenta_role');
      localStorage.removeItem('sipenta_user');
      localStorage.removeItem('sipenta_bidangId');
      localStorage.removeItem('sipenta_bidang');
      localStorage.removeItem('sipenta_isApproved');
      localStorage.removeItem('sipenta_refresh_token');
      localStorage.removeItem('sipenta_expires_at');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    } catch {}

    // 3. Keep non-sensitive session metadata for UI routing & role guards
    setCookie('sipenta_role', role);
    try {
      sessionStorage.setItem('sipenta_role', role);
    } catch {}

    if (expiresAt) {
      const exp = String(expiresAt);
      setCookie('sipenta_expires_at', exp);
      try {
        sessionStorage.setItem('sipenta_expires_at', exp);
      } catch {}
    }

    if (user) {
      const userJson = JSON.stringify(user);
      setCookie('sipenta_user', userJson);
      try {
        sessionStorage.setItem('sipenta_user', userJson);
      } catch {}

      if (user.bidangId) {
        setCookie('sipenta_bidangId', String(user.bidangId));
        try { sessionStorage.setItem('sipenta_bidangId', String(user.bidangId)); } catch {}
      } else {
        deleteCookie('sipenta_bidangId');
        try { sessionStorage.removeItem('sipenta_bidangId'); } catch {}
      }

      if (user.bidang) {
        setCookie('sipenta_bidang', user.bidang);
        try { sessionStorage.setItem('sipenta_bidang', user.bidang); } catch {}
      } else {
        deleteCookie('sipenta_bidang');
        try { sessionStorage.removeItem('sipenta_bidang'); } catch {}
      }

      setCookie('sipenta_isApproved', String(user.isApproved ?? false));
      try { sessionStorage.setItem('sipenta_isApproved', String(user.isApproved ?? false)); } catch {}
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;

    setAccessToken(null);

    // Call backend to revoke refresh token and clear session cookie
    fetch(`${API_ENDPOINTS.AUTH}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getCsrfHeaders(),
      },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify({}),
    }).catch(() => {});

    // Clear client session cookies
    deleteCookie('sipenta_token');
    deleteCookie('sipenta_refresh_token');
    deleteCookie('sipenta_csrf');
    deleteCookie('sipenta_role');
    deleteCookie('sipenta_user');
    deleteCookie('sipenta_bidangId');
    deleteCookie('sipenta_bidang');
    deleteCookie('sipenta_isApproved');
    deleteCookie('sipenta_expires_at');

    // Clean sessionStorage and legacy localStorage
    try {
      sessionStorage.clear();
      localStorage.removeItem('sipenta_token');
      localStorage.removeItem('sipenta_role');
      localStorage.removeItem('sipenta_user');
      localStorage.removeItem('sipenta_bidangId');
      localStorage.removeItem('sipenta_bidang');
      localStorage.removeItem('sipenta_isApproved');
      localStorage.removeItem('sipenta_refresh_token');
      localStorage.removeItem('sipenta_expires_at');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('bidangId');
      localStorage.removeItem('bidang');
    } catch {}
  }
}

export const authRepository = new AuthRepository();
