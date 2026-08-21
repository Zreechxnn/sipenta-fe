import { IChatRepository } from '../repositories/IChatRepository';
import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '../domain/chat';

export class ChatUseCases {
  constructor(private chatRepo: IChatRepository) {}

  async fetchSessions(): Promise<ChatSession[]> {
    return await this.chatRepo.getSessions();
  }

  async fetchSessionDetails(sessionId: string): Promise<ChatMessage[]> {
    return await this.chatRepo.getSessionDetails(sessionId);
  }

  async deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }> {
    return await this.chatRepo.deleteSession(sessionId);
  }

  async sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
    return await this.chatRepo.sendMessage(payload);
  }
}
