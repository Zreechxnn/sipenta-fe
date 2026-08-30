import * as signalR from '@microsoft/signalr';
import { ISignalRService } from '@/core/services/ISignalRService';
import { getApiBaseUrl } from '../api/apiClient';

export class SignalRService implements ISignalRService {
  private connection: signalR.HubConnection | null = null;

  private getHubUrl(): string {
    const baseUrl = getApiBaseUrl();
    return baseUrl.replace(/\/api\/?$/, '') + '/hubs/data';
  }

  async startConnection(): Promise<void> {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    const hubUrl = this.getHubUrl();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
          }
          return '';
        },
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount > 10) return null;
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
        },
      })
      .configureLogging(signalR.LogLevel.None)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR DataHub connected to:', hubUrl);
    } catch (err) {
      console.warn('SignalR DataHub connection warning:', hubUrl);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      } finally {
        this.connection = null;
      }
    }
  }

  onDocumentChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('DocumentCreated', data => callback('DocumentCreated', data));
    this.connection.on('DocumentUpdated', data => callback('DocumentUpdated', data));
    this.connection.on('DocumentDeleted', data => callback('DocumentDeleted', data));
    this.connection.on('DocumentShared', data => callback('DocumentShared', data));
    this.connection.on('DocumentAccessRevoked', data => callback('DocumentAccessRevoked', data));
  }

  onUserChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('UserRegistered', data => callback('UserRegistered', data));
    this.connection.on('UserCreated', data => callback('UserCreated', data));
    this.connection.on('UserUpdated', data => callback('UserUpdated', data));
    this.connection.on('UserDeleted', data => callback('UserDeleted', data));
  }

  onChatChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('ChatSessionUpdated', data => callback('ChatSessionUpdated', data));
    this.connection.on('ChatSessionDeleted', data => callback('ChatSessionDeleted', data));
    this.connection.on('ReceiveSessionMessage', data => callback('ReceiveSessionMessage', data));
  }

  offAll(): void {
    if (this.connection) {
      this.connection.off('DocumentCreated');
      this.connection.off('DocumentUpdated');
      this.connection.off('DocumentDeleted');
      this.connection.off('DocumentShared');
      this.connection.off('DocumentAccessRevoked');
      this.connection.off('UserRegistered');
      this.connection.off('UserCreated');
      this.connection.off('UserUpdated');
      this.connection.off('UserDeleted');
      this.connection.off('ChatSessionUpdated');
      this.connection.off('ChatSessionDeleted');
      this.connection.off('ReceiveSessionMessage');
    }
  }
}

export const signalRService = new SignalRService();
