import { IBidangRepository } from '@/core/repositories/IBidangRepository';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '@/core/domain/bidang';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class BidangRepository implements IBidangRepository {
  async getAll(): Promise<Bidang[]> {
    const res = await authFetch(API_ENDPOINTS.BIDANG, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const result = await res.json().catch(() => ({}));
    return result.data || [];
  }

  async getById(id: number): Promise<Bidang> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Bidang tidak ditemukan');
    const result = await res.json().catch(() => ({}));
    return result.data;
  }

  async create(dto: CreateBidangDto): Promise<Bidang> {
    const res = await authFetch(API_ENDPOINTS.BIDANG, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal menambahkan bidang');
    return result.data;
  }

  async update(id: number, dto: UpdateBidangDto): Promise<Bidang> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal memperbarui bidang');
    return result.data;
  }

  async delete(id: number): Promise<boolean> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal menghapus bidang');
    return result.data ?? true;
  }
}

export const bidangRepository = new BidangRepository();
