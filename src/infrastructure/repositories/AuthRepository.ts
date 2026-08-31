import { IAuthRepository } from '@/core/repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/core/domain/auth';
import { API_ENDPOINTS } from '../api/apiClient';
import { getCookie, setCookie, deleteCookie } from '@/presentation/utils/cookies';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
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

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const cookieToken = getCookie('sipenta_token');
    if (cookieToken) return cookieToken;

    try {
      const localToken = localStorage.getItem('sipenta_token');
      if (localToken) return localToken;
    } catch {}

    const role = getCookie('sipenta_role');
    if (role) {
      return 'session-active';
    }
    return null;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const role = getCookie('sipenta_role') || (typeof localStorage !== 'undefined' ? localStorage.getItem('sipenta_role') : null);
    if (!role) {
      this.logout();
      return null;
    }
    return role;
  }

  getUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = getCookie('sipenta_user') || (typeof localStorage !== 'undefined' ? localStorage.getItem('sipenta_user') : null);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, role: string, user?: any): void {
    if (typeof window === 'undefined') return;

    if (token && token !== 'hidden-httponly-token' && token !== 'session-active') {
      setCookie('sipenta_token', token, 7);
      try {
        localStorage.setItem('sipenta_token', token);
      } catch {}
    }

    setCookie('sipenta_role', role, 7);
    try {
      localStorage.setItem('sipenta_role', role);
    } catch {}

    if (user) {
      const userJson = JSON.stringify(user);
      setCookie('sipenta_user', userJson, 7);
      try {
        localStorage.setItem('sipenta_user', userJson);
      } catch {}

      if (user.bidangId) {
        setCookie('sipenta_bidangId', String(user.bidangId), 7);
        try { localStorage.setItem('sipenta_bidangId', String(user.bidangId)); } catch {}
      } else {
        deleteCookie('sipenta_bidangId');
        try { localStorage.removeItem('sipenta_bidangId'); } catch {}
      }

      if (user.bidang) {
        setCookie('sipenta_bidang', user.bidang, 7);
        try { localStorage.setItem('sipenta_bidang', user.bidang); } catch {}
      } else {
        deleteCookie('sipenta_bidang');
        try { localStorage.removeItem('sipenta_bidang'); } catch {}
      }

      setCookie('sipenta_isApproved', String(user.isApproved ?? false), 7);
      try { localStorage.setItem('sipenta_isApproved', String(user.isApproved ?? false)); } catch {}
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;

    // Call backend to clear HttpOnly cookie
    fetch(`${API_ENDPOINTS.AUTH}/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});

    // Clear client cookies
    deleteCookie('sipenta_token');
    deleteCookie('sipenta_role');
    deleteCookie('sipenta_user');
    deleteCookie('sipenta_bidangId');
    deleteCookie('sipenta_bidang');
    deleteCookie('sipenta_isApproved');

    // Clean localStorage keys
    try {
      localStorage.removeItem('sipenta_token');
      localStorage.removeItem('sipenta_role');
      localStorage.removeItem('sipenta_user');
      localStorage.removeItem('sipenta_bidangId');
      localStorage.removeItem('sipenta_bidang');
      localStorage.removeItem('sipenta_isApproved');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('bidangId');
      localStorage.removeItem('bidang');
      localStorage.removeItem('isApproved');
    } catch {}
  }
}

export const authRepository = new AuthRepository();
