'use client';

import { useState, useCallback, useEffect } from 'react';
import { configurationRepository } from '@/infrastructure/repositories/ConfigurationRepository';
import { ConfigurationUseCases } from '@/core/usecases/configurationUseCases';
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

const useCases = new ConfigurationUseCases(configurationRepository);

export function useConfiguration() {
  const [overview, setOverview] = useState<ConfigurationOverview | null>(null);
  const [llmConfig, setLlmConfig] = useState<LlmConfigList | null>(null);
  const [storageConfig, setStorageConfig] = useState<StorageConfig | null>(null);
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig | null>(null);

  const [isElevated, setIsElevated] = useState<boolean>(false);
  const [elevatedUntil, setElevatedUntil] = useState<Date | null>(null);
  const [elevatedSecondsLeft, setElevatedSecondsLeft] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionExpired, setSessionExpired] = useState<boolean>(false);

  const sudoLock = useCallback(async () => {
    try {
      await useCases.sudoLock();
    } catch {
      // Ignore
    } finally {
      setIsElevated(false);
      setElevatedUntil(null);
      setElevatedSecondsLeft(0);
      setLlmConfig(null);
      setStorageConfig(null);
      setDatabaseConfig(null);
    }
  }, []);

  // Check initial sudo status from session
  useEffect(() => {
    const token = useCases.getSudoToken();
    if (token) {
      useCases.getSudoStatus().then((status) => {
        if (status.elevated) {
          setIsElevated(true);
          if (status.elevatedUntil) {
            setElevatedUntil(new Date(status.elevatedUntil));
          }
          if (typeof status.expiresInSeconds === 'number') {
            setElevatedSecondsLeft(status.expiresInSeconds);
          }
        } else {
          sudoLock();
        }
      }).catch(() => {
        sudoLock();
      });
    }
  }, [sudoLock]);

  // Countdown timer for elevated sudo session (Strict 15-minute auto-lock)
  useEffect(() => {
    if (!isElevated || !elevatedUntil) return;

    const timer = setInterval(() => {
      const diff = Math.max(0, Math.floor((elevatedUntil.getTime() - Date.now()) / 1000));
      setElevatedSecondsLeft(diff);
      if (diff <= 0) {
        clearInterval(timer);
        sudoLock();
        setSessionExpired(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isElevated, elevatedUntil, sudoLock]);

  const sudoElevate = async (password: string) => {
    try {
      setLoading(true);
      setError(null);
      setSessionExpired(false);
      const res = await useCases.sudoElevate(password);
      setIsElevated(true);
      const until = new Date(res.elevatedUntil);
      setElevatedUntil(until);
      setElevatedSecondsLeft(res.expiresInSeconds);
      return res;
    } catch (err: any) {
      setError(err.message || 'Verifikasi kata sandi sudo gagal.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSudoCheckError = useCallback((err: any) => {
    if (err.code === 'REQUIRE_SUDO_ELEVATION' || err.status === 403) {
      sudoLock();
    }
  }, [sudoLock]);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await useCases.getOverview();
      setOverview(data);
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal mengambil data ringkasan konfigurasi.');
    } finally {
      setLoading(false);
    }
  }, [handleSudoCheckError]);

  const fetchLlmConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await useCases.getLlmConfigs();
      setLlmConfig(data);
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal mengambil konfigurasi LLM.');
    } finally {
      setLoading(false);
    }
  }, [handleSudoCheckError]);

  const saveLlmConfig = async (config: LlmConfigList) => {
    try {
      setSaving(true);
      setError(null);
      await useCases.saveLlmConfigs(config);
      setLlmConfig(config);
      return true;
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal menyimpan konfigurasi LLM.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const testLlmEndpoint = async (req: LlmTestRequest): Promise<LlmTestResponse> => {
    try {
      setTesting(true);
      return await useCases.testLlmEndpoint(req);
    } catch (err: any) {
      handleSudoCheckError(err);
      return {
        success: false,
        latencyMs: 0,
        message: err.message || 'Pengujian LLM gagal.',
      };
    } finally {
      setTesting(false);
    }
  };

  const fetchStorageConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await useCases.getStorageConfig();
      setStorageConfig(data);
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal mengambil konfigurasi storage.');
    } finally {
      setLoading(false);
    }
  }, [handleSudoCheckError]);

  const saveStorageConfig = async (config: StorageConfig) => {
    try {
      setSaving(true);
      setError(null);
      await useCases.saveStorageConfig(config);
      setStorageConfig(config);
      return true;
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal menyimpan konfigurasi storage.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const testStorage = async (config?: StorageConfig): Promise<StorageTestResponse> => {
    try {
      setTesting(true);
      return await useCases.testStorage(config);
    } catch (err: any) {
      handleSudoCheckError(err);
      return {
        success: false,
        provider: config?.activeProvider || 'Unknown',
        message: err.message || 'Pengujian koneksi storage gagal.',
      };
    } finally {
      setTesting(false);
    }
  };

  const fetchDatabaseConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await useCases.getDatabaseConfig();
      setDatabaseConfig(data);
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal mengambil konfigurasi database.');
    } finally {
      setLoading(false);
    }
  }, [handleSudoCheckError]);

  const testDatabase = async (req: DatabaseTestRequest): Promise<DatabaseTestResponse> => {
    try {
      setTesting(true);
      return await useCases.testDatabase(req);
    } catch (err: any) {
      handleSudoCheckError(err);
      return {
        success: false,
        latencyMs: 0,
        message: err.message || 'Pengujian koneksi database gagal.',
      };
    } finally {
      setTesting(false);
    }
  };

  const saveDatabaseConfig = async (config: DatabaseConfig) => {
    try {
      setSaving(true);
      setError(null);
      const res = await useCases.saveDatabaseConfig(config);
      setDatabaseConfig(config);
      return res;
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal menyimpan konfigurasi database.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const encryptAllConfigurations = async () => {
    try {
      setSaving(true);
      setError(null);
      const res = await useCases.encryptAllConfigurations();
      await fetchOverview();
      return res;
    } catch (err: any) {
      handleSudoCheckError(err);
      setError(err.message || 'Gagal mengenkripsi konfigurasi.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    overview,
    llmConfig,
    storageConfig,
    databaseConfig,
    isElevated,
    elevatedSecondsLeft,
    sudoElevate,
    sudoLock,
    loading,
    saving,
    testing,
    error,
    fetchOverview,
    fetchLlmConfig,
    saveLlmConfig,
    testLlmEndpoint,
    fetchStorageConfig,
    saveStorageConfig,
    testStorage,
    fetchDatabaseConfig,
    testDatabase,
    saveDatabaseConfig,
    encryptAllConfigurations,
    sessionExpired,
    setSessionExpired,
  };
}
