import { IAuthRepository } from '@/core/repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/core/domain/auth';
import { API_ENDPOINTS, isTokenExpired } from '../api/apiClient';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { message: result.message || result.pesan || 'Login gagal' };
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { message: result.message || result.pesan || 'Login with Google gagal' };
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return localStorage.getItem('role');
  }

  getUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, role: string, user?: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.bidangId) localStorage.setItem('bidangId', String(user.bidangId));
      else localStorage.removeItem('bidangId');
      if (user.bidang) localStorage.setItem('bidang', user.bidang);
      else localStorage.removeItem('bidang');
      localStorage.setItem('isApproved', String(user.isApproved ?? false));
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('bidangId');
    localStorage.removeItem('bidang');
    localStorage.removeItem('isApproved');
  }
}

export const authRepository = new AuthRepository();
