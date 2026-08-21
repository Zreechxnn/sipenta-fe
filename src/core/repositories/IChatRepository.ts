import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '../domain/chat';

export interface IChatRepository {
  getSessions(): Promise<ChatSession[]>;
  getSessionDetails(sessionId: string): Promise<ChatMessage[]>;
  deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }>;
  sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse>;
}
