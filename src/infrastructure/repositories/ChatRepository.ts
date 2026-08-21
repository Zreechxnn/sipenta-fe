import { IChatRepository } from '@/core/repositories/IChatRepository';
import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '@/core/domain/chat';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class ChatRepository implements IChatRepository {
  async getSessions(): Promise<ChatSession[]> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (result.sukses || result.Sukses) {
      return result.data || result.Data || [];
    }
    return [];
  }

  async getSessionDetails(sessionId: string): Promise<ChatMessage[]> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions/${sessionId}`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (result.sukses || result.Sukses) {
      const data = result.data || result.Data;
      return data?.messages || data?.Messages || [];
    }
    return [];
  }

  async deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (result.sukses || result.Sukses || res.ok) {
      return { ok: true };
    }
    return { ok: false, message: result.pesan || result.Pesan || 'Gagal menghapus sesi' };
  }

  async sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
    const res = await authFetch(API_ENDPOINTS.CHAT, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    return await res.json();
  }
}

export const chatRepository = new ChatRepository();
