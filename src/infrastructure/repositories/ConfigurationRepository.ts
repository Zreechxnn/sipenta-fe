import { IConfigurationRepository } from '@/core/repositories/IConfigurationRepository';
import {
  ConfigurationOverview,
  LlmConfigList,
  LlmTestRequest,
  LlmTestResponse,
  StorageConfig,
  StorageTestResponse,
  DatabaseConfig,
  DatabaseTestRequest,
  DatabaseTestResponse,
} from '@/core/domain/configuration';
import { API_ENDPOINTS, authFetch } from '../api/apiClient';

export class ConfigurationRepository implements IConfigurationRepository {
  private sudoTokenKey = 'siap_sudo_token';

  getSudoToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(this.sudoTokenKey);
  }

  setSudoToken(token: string | null): void {
    if (typeof window === 'undefined') return;
    if (token) {
      sessionStorage.setItem(this.sudoTokenKey, token);
    } else {
      sessionStorage.removeItem(this.sudoTokenKey);
    }
  }

  private getHeaders(additional?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = { ...additional };
    const sudoToken = this.getSudoToken();
    if (sudoToken) {
      headers['X-Sudo-Token'] = sudoToken;
    }
    return headers;
  }

  async sudoElevate(password: string): Promise<{ success: boolean; sudoToken: string; expiresInSeconds: number; elevatedUntil: string; message: string }> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/sudo-elevate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.detail || err.title || 'Verifikasi kata sandi gagal.');
    }

    const data = await res.json();
    if (data.sudoToken) {
      this.setSudoToken(data.sudoToken);
    }
    return data;
  }

  async getSudoStatus(): Promise<{ elevated: boolean; expiresInSeconds?: number; elevatedUntil?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/sudo-status`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) return { elevated: false, expiresInSeconds: 0 };
    return await res.json();
  }

  async sudoLock(): Promise<void> {
    try {
      await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/sudo-lock`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch {
      // Ignore network errors on lock
    } finally {
      this.setSudoToken(null);
    }
  }

  async getOverview(): Promise<ConfigurationOverview> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/overview`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || `Gagal memuat ringkasan konfigurasi: ${res.statusText}`);
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async getLlmConfigs(): Promise<LlmConfigList> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/llm`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || `Gagal memuat konfigurasi LLM: ${res.statusText}`);
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async saveLlmConfigs(config: LlmConfigList): Promise<void> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/llm`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.message || 'Gagal menyimpan konfigurasi LLM.');
      error.code = err.code;
      throw error;
    }
  }

  async testLlmEndpoint(req: LlmTestRequest): Promise<LlmTestResponse> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/llm/test`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.message || 'Gagal menguji endpoint LLM.');
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async getStorageConfig(): Promise<StorageConfig> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/storage`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || `Gagal memuat konfigurasi Storage: ${res.statusText}`);
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async saveStorageConfig(config: StorageConfig): Promise<void> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/storage`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || 'Gagal menyimpan konfigurasi storage.');
      error.code = err.code;
      throw error;
    }
  }

  async testStorage(config?: StorageConfig): Promise<StorageTestResponse> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/storage/test`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ config }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || 'Gagal menguji koneksi storage.');
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/database`, {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || `Gagal memuat konfigurasi Database: ${res.statusText}`);
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async testDatabase(req: DatabaseTestRequest): Promise<DatabaseTestResponse> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/database/test`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || 'Gagal menguji koneksi database.');
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }

  async saveDatabaseConfig(config: DatabaseConfig): Promise<{ message: string; requiresRestart: boolean }> {
    const res = await authFetch(`${API_ENDPOINTS.CONFIGURATIONS}/database`, {
      method: 'POST',
      headers: this.getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const error: any = new Error(err.detail || err.message || 'Gagal menyimpan konfigurasi database.');
      error.code = err.code;
      throw error;
    }
    return await res.json();
  }
}

export const configurationRepository = new ConfigurationRepository();
