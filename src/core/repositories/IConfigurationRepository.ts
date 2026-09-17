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

export interface IConfigurationRepository {
  getOverview(): Promise<ConfigurationOverview>;
  
  getLlmConfigs(): Promise<LlmConfigList>;
  saveLlmConfigs(config: LlmConfigList): Promise<void>;
  testLlmEndpoint(req: LlmTestRequest): Promise<LlmTestResponse>;
  
  getStorageConfig(): Promise<StorageConfig>;
  saveStorageConfig(config: StorageConfig): Promise<void>;
  testStorage(config?: StorageConfig): Promise<StorageTestResponse>;
  
  getDatabaseConfig(): Promise<DatabaseConfig>;
  testDatabase(req: DatabaseTestRequest): Promise<DatabaseTestResponse>;
  saveDatabaseConfig(config: DatabaseConfig): Promise<{ message: string; requiresRestart: boolean }>;

  sudoElevate(password: string): Promise<{ success: boolean; sudoToken: string; expiresInSeconds: number; elevatedUntil: string; message: string }>;
  getSudoStatus(): Promise<{ elevated: boolean; expiresInSeconds?: number; elevatedUntil?: string }>;
  sudoLock(): Promise<void>;
  getSudoToken(): string | null;
  setSudoToken(token: string | null): void;
}
