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

export class ConfigurationUseCases {
  constructor(private repo: IConfigurationRepository) {}

  async getOverview(): Promise<ConfigurationOverview> {
    return await this.repo.getOverview();
  }

  async getLlmConfigs(): Promise<LlmConfigList> {
    return await this.repo.getLlmConfigs();
  }

  async saveLlmConfigs(config: LlmConfigList): Promise<void> {
    return await this.repo.saveLlmConfigs(config);
  }

  async testLlmEndpoint(req: LlmTestRequest): Promise<LlmTestResponse> {
    return await this.repo.testLlmEndpoint(req);
  }

  async getStorageConfig(): Promise<StorageConfig> {
    return await this.repo.getStorageConfig();
  }

  async saveStorageConfig(config: StorageConfig): Promise<void> {
    return await this.repo.saveStorageConfig(config);
  }

  async testStorage(config?: StorageConfig): Promise<StorageTestResponse> {
    return await this.repo.testStorage(config);
  }

  async getDatabaseConfig(): Promise<DatabaseConfig> {
    return await this.repo.getDatabaseConfig();
  }

  async testDatabase(req: DatabaseTestRequest): Promise<DatabaseTestResponse> {
    return await this.repo.testDatabase(req);
  }

  async saveDatabaseConfig(config: DatabaseConfig): Promise<{ message: string; requiresRestart: boolean }> {
    return await this.repo.saveDatabaseConfig(config);
  }

  async sudoElevate(password: string) {
    return await this.repo.sudoElevate(password);
  }

  async getSudoStatus() {
    return await this.repo.getSudoStatus();
  }

  async sudoLock() {
    return await this.repo.sudoLock();
  }

  getSudoToken(): string | null {
    return this.repo.getSudoToken();
  }

  setSudoToken(token: string | null): void {
    this.repo.setSudoToken(token);
  }

  async encryptAllConfigurations() {
    return await this.repo.encryptAllConfigurations();
  }
}
