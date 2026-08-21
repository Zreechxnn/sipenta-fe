export interface ChatSession {
  id?: string;
  Id?: string;
  title?: string;
  Title?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id?: string;
  role?: string;
  Role?: string;
  content?: string;
  Content?: string;
  timestamp?: string;
  sources?: any[];
  Sources?: any[];
}

export interface SendMessagePayload {
  message: string;
  topK?: number;
  sessionId?: string | null;
}

export interface ChatApiResponse {
  sukses?: boolean;
  Sukses?: boolean;
  pesan?: string;
  Pesan?: string;
  data?: {
    answer?: string;
    Answer?: string;
    sessionId?: string;
    SessionId?: string;
    sources?: any[];
    Sources?: any[];
  };
  Data?: {
    answer?: string;
    Answer?: string;
    sessionId?: string;
    SessionId?: string;
    sources?: any[];
    Sources?: any[];
  };
}
