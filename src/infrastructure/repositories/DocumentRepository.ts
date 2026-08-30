import { IDocumentRepository } from '@/core/repositories/IDocumentRepository';
import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentChunk, DocumentAccessUser } from '@/core/domain/document';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class DocumentRepository implements IDocumentRepository {
  async getDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse> {
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 10;
    let url = `${API_ENDPOINTS.DOCUMENTS}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (params.keyword) url += `&Keyword=${encodeURIComponent(params.keyword)}`;
    if (params.namaTenagaAhli) url += `&NamaTenagaAhli=${encodeURIComponent(params.namaTenagaAhli)}`;
    if (params.jenisDokumen) url += `&JenisDokumen=${encodeURIComponent(params.jenisDokumen)}`;
    if (params.periodeLaporan) url += `&PeriodeLaporan=${encodeURIComponent(params.periodeLaporan)}`;
    if (params.bidangId) url += `&BidangId=${params.bidangId}`;
    if (params.bidang) url += `&Bidang=${encodeURIComponent(params.bidang)}`;

    const res = await authFetch(url, { headers: getAuthHeaders() });
    const result = await res.json();
    return result;
  }

  async createDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    const formData = new FormData();
    if (data.files && data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append('Files', data.files[i]);
      }
    }
    if (data.nama) formData.append('Nama', data.nama);
    if (data.namaTenagaAhli) formData.append('NamaTenagaAhli', data.namaTenagaAhli);
    if (data.jenisDokumen) formData.append('JenisDokumen', data.jenisDokumen);
    if (data.periodeLaporan) formData.append('PeriodeLaporan', data.periodeLaporan);
    if (data.bidangId) formData.append('BidangId', String(data.bidangId));
    if (data.bidang) formData.append('Bidang', data.bidang);

    const res = await authFetch(API_ENDPOINTS.DOCUMENTS, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal menyimpan dokumen' };
  }

  async updateDocument(id: string, data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    const payload: Record<string, any> = {
      nama: data.nama,
      namaTenagaAhli: data.namaTenagaAhli,
      jenisDokumen: data.jenisDokumen,
      periodeLaporan: data.periodeLaporan || null,
    };
    if (data.bidangId) payload.bidangId = data.bidangId;
    if (data.bidang) payload.bidang = data.bidang;

    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal memperbarui dokumen' };
  }

  async deleteDocument(id: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal menghapus dokumen' };
  }

  async downloadDocument(id: string): Promise<Blob> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/download`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Gagal mengunduh dokumen');
    }
    return await res.blob();
  }

  async getChunks(id: string): Promise<DocumentChunk[]> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/chunks`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    let data: DocumentChunk[] = [];
    if (result.sukses !== undefined) {
      if (result.data?.chunks) data = result.data.chunks;
      else if (result.data?.Chunks) data = result.data.Chunks;
      else if (Array.isArray(result.data)) data = result.data;
    } else if (result.chunks) data = result.chunks;
    else if (result.Chunks) data = result.Chunks;
    else if (Array.isArray(result)) data = result;

    return data;
  }

  async updateChunk(documentId: string, chunkId: string, content: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/chunks/${chunkId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ Content: content }),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.message || result.pesan || 'Gagal memperbarui chunk' };
  }

  // Document Sharing
  async getShares(documentId: string): Promise<DocumentAccessUser[]> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const result = await res.json().catch(() => ({}));
    if (result.sukses && Array.isArray(result.data)) {
      return result.data;
    }
    return Array.isArray(result) ? result : [];
  }

  async shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ username }),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      return { ok: true, message: result.pesan || result.message, user: result.data };
    }
    return { ok: false, message: result.pesan || result.message || 'Gagal membagikan dokumen' };
  }

  async revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares/${targetUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, message: result.pesan || result.message };
    return { ok: false, message: result.pesan || result.message || 'Gagal mencabut hak akses' };
  }
}

export const documentRepository = new DocumentRepository();
