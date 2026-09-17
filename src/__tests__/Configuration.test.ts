import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfigurationUseCases } from '@/core/usecases/configurationUseCases';
import { IConfigurationRepository } from '@/core/repositories/IConfigurationRepository';
import {
  ConfigurationOverview,
  LlmConfigList,
  StorageConfig,
  DatabaseConfig,
} from '@/core/domain/configuration';

describe('ConfigurationUseCases', () => {
  let mockRepo: IConfigurationRepository;
  let useCases: ConfigurationUseCases;

  beforeEach(() => {
    mockRepo = {
      getOverview: vi.fn(),
      getLlmConfigs: vi.fn(),
      saveLlmConfigs: vi.fn(),
      testLlmEndpoint: vi.fn(),
      getStorageConfig: vi.fn(),
      saveStorageConfig: vi.fn(),
      testStorage: vi.fn(),
      getDatabaseConfig: vi.fn(),
      testDatabase: vi.fn(),
      saveDatabaseConfig: vi.fn(),
      sudoElevate: vi.fn(),
      getSudoStatus: vi.fn(),
      getSudoToken: vi.fn(),
      setSudoToken: vi.fn(),
      sudoLock: vi.fn(),
    };
    useCases = new ConfigurationUseCases(mockRepo);
  });

  it('should fetch overview successfully', async () => {
    const mockOverview: ConfigurationOverview = {
      totalLlmKeys: 3,
      activeLlmKeys: 2,
      activeStorageProvider: 'GoogleDrive',
      databaseHost: 'localhost',
      databaseName: 'postgres',
      isDatabaseConnected: true,
    };
    vi.mocked(mockRepo.getOverview).mockResolvedValue(mockOverview);

    const result = await useCases.getOverview();
    expect(result).toEqual(mockOverview);
    expect(mockRepo.getOverview).toHaveBeenCalledOnce();
  });

  it('should fetch and save LLM configs correctly', async () => {
    const mockLlm: LlmConfigList = {
      endpoints: [
        {
          id: '1',
          name: 'Groq Primary',
          provider: 'groq',
          apiKey: 'gsk_test1',
          baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
          model: 'openai/gpt-oss-120b',
          imageModel: 'qwen/qwen3.8-27b',
          isActive: true,
          priority: 1,
        },
      ],
    };
    vi.mocked(mockRepo.getLlmConfigs).mockResolvedValue(mockLlm);
    vi.mocked(mockRepo.saveLlmConfigs).mockResolvedValue();

    const fetched = await useCases.getLlmConfigs();
    expect(fetched.endpoints).toHaveLength(1);

    await useCases.saveLlmConfigs(mockLlm);
    expect(mockRepo.saveLlmConfigs).toHaveBeenCalledWith(mockLlm);
  });

  it('should test and save storage config correctly', async () => {
    const mockStorage: StorageConfig = {
      activeProvider: 'LocalStorage',
      googleDrive: { tokenJson: '', folderId: '', folderImageId: '', clientId: '', clientSecret: '' },
      localStorage: { basePath: 'Uploads/Storage' },
      s3Compatible: { endpoint: '', bucketName: 'docs', accessKey: '', secretKey: '', region: 'us-east-1' },
      webDav: { serverUrl: '', username: '', password: '', remotePath: 'siap', preset: 'Nextcloud' },
    };
    vi.mocked(mockRepo.getStorageConfig).mockResolvedValue(mockStorage);
    vi.mocked(mockRepo.testStorage).mockResolvedValue({
      success: true,
      provider: 'LocalStorage',
      message: 'OK',
    });

    const config = await useCases.getStorageConfig();
    expect(config.activeProvider).toBe('LocalStorage');

    const testRes = await useCases.testStorage(config);
    expect(testRes.success).toBe(true);
  });

  it('should test and save database config correctly', async () => {
    const mockDb: DatabaseConfig = {
      connectionString: '',
      host: 'localhost',
      port: 5432,
      database: 'siap_test',
      username: 'postgres',
    };
    vi.mocked(mockRepo.getDatabaseConfig).mockResolvedValue(mockDb);
    vi.mocked(mockRepo.testDatabase).mockResolvedValue({
      success: true,
      latencyMs: 15,
      message: 'Connected',
    });
    vi.mocked(mockRepo.saveDatabaseConfig).mockResolvedValue({
      message: 'Saved',
      requiresRestart: true,
    });

    const testRes = await useCases.testDatabase({ host: 'localhost' });
    expect(testRes.success).toBe(true);

    const saveRes = await useCases.saveDatabaseConfig(mockDb);
    expect(saveRes.requiresRestart).toBe(true);
  });
});
