import { IUserRepository } from '@/core/repositories/IUserRepository';
import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '@/core/domain/user';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<UserAccount[]> {
    const res = await authFetch(API_ENDPOINTS.USER, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error('Gagal memuat pengguna');
    }
    const data = await res.json();
    return data;
  }

  async createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(API_ENDPOINTS.USER, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal membuat pengguna' };
  }

  async updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }> {
    const payload: Partial<UpdateUserDto> = {
      username: dto.username,
      email: dto.email,
      fullName: dto.fullName,
      roleId: dto.roleId,
      bidang: dto.bidang,
      isApproved: dto.isApproved,
    };
    if (dto.password) payload.password = dto.password;

    const res = await authFetch(`${API_ENDPOINTS.USER}/${dto.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal memperbarui pengguna' };
  }

  async approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ bidang }),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal menyetujui pengguna' };
  }

  async deleteUser(id: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok || res.status === 204) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.message || 'Gagal menghapus pengguna' };
  }

  async getProfile(): Promise<UserAccount> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Gagal memuat profil pengguna');
    }
    return await res.json();
  }

  async updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      return { ok: true, user: result };
    }
    return { ok: false, message: result.message || 'Gagal memperbarui profil' };
  }

  async searchUsers(query: string): Promise<UserAccount[]> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/search?query=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      throw new Error('Gagal mencari pengguna');
    }
    const data = await res.json();
    return data;
  }
}

export const userRepository = new UserRepository();
