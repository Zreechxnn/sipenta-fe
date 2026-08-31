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
    // We cannot read sipenta_token because it's HttpOnly.
    // Instead, we check if the role cookie exists as a proxy for the session.
    const role = getCookie('sipenta_role');
    if (role) {
      return 'hidden-httponly-token';
    }
    return null;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const role = getCookie('sipenta_role');
    if (!role) {
      this.logout();
      return null;
    }
    return role;
  }

  getUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = getCookie('sipenta_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, role: string, user?: any): void {
    if (typeof window === 'undefined') return;
    // We do NOT set 'sipenta_token' because the backend sets it as an HttpOnly cookie.
    setCookie('sipenta_role', role, 7);
    if (user) {
      setCookie('sipenta_user', JSON.stringify(user), 7);
      if (user.bidangId) setCookie('sipenta_bidangId', String(user.bidangId), 7);
      else deleteCookie('sipenta_bidangId');

      if (user.bidang) setCookie('sipenta_bidang', user.bidang, 7);
      else deleteCookie('sipenta_bidang');

      setCookie('sipenta_isApproved', String(user.isApproved ?? false), 7);
    }

    // Clean legacy localStorage keys to ensure zero JWT residual in localStorage
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('bidangId');
      localStorage.removeItem('bidang');
      localStorage.removeItem('isApproved');
    } catch {}
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

    // Clean legacy localStorage keys
    try {
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
