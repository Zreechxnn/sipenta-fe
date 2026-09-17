export interface LlmEndpointConfig {
  id: string;
  name: string;
  provider: string; // 'groq' | 'openai' | 'custom'
  apiKey: string;
  baseUrl: string;
  model: string;
  imageModel: string;
  isActive: boolean;
  priority: number;
}

export interface LlmConfigList {
  endpoints: LlmEndpointConfig[];
}

export interface LlmTestRequest {
  apiKey: string;
  baseUrl: string;
  model: string;
  testPrompt?: string;
}

export interface LlmTestResponse {
  success: boolean;
  latencyMs: number;
  message: string;
  responseText?: string;
}

export interface GoogleDriveSettings {
  tokenJson: string;
  folderId: string;
  folderImageId: string;
  clientId: string;
  clientSecret: string;
}

export interface LocalStorageSettings {
  basePath: string;
  documentFolder?: string;
  imageFolder?: string;
}

export interface S3Settings {
  endpoint: string;
  bucketName: string;
  accessKey: string;
  secretKey: string;
  region: string;
  publicUrlBase?: string;
  providerType?: string; // 'S3Compatible' | 'OpenStackSwift' | 'PDN_ObjectStorage' | 'MinIO' | 'Supabase' | 'Cloudflare_R2'
  projectId?: string;
  documentPrefix?: string;
  imagePrefix?: string;
}

export interface WebDavSettings {
  serverUrl: string;
  username: string;
  password?: string;
  remotePath: string;
  preset: string; // 'Nextcloud' | 'ownCloud' | 'PDN' | 'Custom'
  documentPath?: string;
  imagePath?: string;
}

export interface SudoElevateRequest {
  password: string;
}

export interface SudoElevateResponse {
  success: boolean;
  sudoToken: string;
  expiresInSeconds: number;
  elevatedUntil: string;
  message: string;
}

export interface SupabaseSettings {
  projectUrl: string;
  apiKey: string;
  bucketName: string;
  documentFolder?: string;
  imageFolder?: string;
}

export interface StorageConfig {
  activeProvider: string; // 'GoogleDrive' | 'LocalStorage' | 'Supabase' | 'S3Compatible' | 'WebDav'
  googleDrive: GoogleDriveSettings;
  localStorage: LocalStorageSettings;
  supabase?: SupabaseSettings;
  s3Compatible: S3Settings;
  webDav: WebDavSettings;
}

export interface StorageTestResponse {
  success: boolean;
  provider: string;
  message: string;
  details?: string;
}

export interface DatabaseConfig {
  connectionString: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  sslMode?: string;
  pooling?: boolean;
}

export interface DatabaseTestRequest {
  connectionString?: string;
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
}

export interface DatabaseTestResponse {
  success: boolean;
  latencyMs: number;
  message: string;
  postgresVersion?: string;
  tableCount?: number;
}

export interface ConfigurationOverview {
  totalLlmKeys: number;
  activeLlmKeys: number;
  activeStorageProvider: string;
  databaseHost: string;
  databaseName: string;
  isDatabaseConnected: boolean;
}
