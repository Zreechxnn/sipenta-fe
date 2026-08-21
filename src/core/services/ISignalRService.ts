export interface ISignalRService {
  startConnection(): Promise<void>;
  stopConnection(): Promise<void>;
  onDocumentChanged(callback: (event: string, data?: any) => void): void;
  onUserChanged(callback: (event: string, data?: any) => void): void;
  onChatChanged(callback: (event: string, data?: any) => void): void;
  offAll(): void;
}
