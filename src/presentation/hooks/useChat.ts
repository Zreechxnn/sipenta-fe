'use client';

import { useState, useCallback } from 'react';
import { chatRepository } from '@/infrastructure/repositories/ChatRepository';
import { ChatUseCases } from '@/core/usecases/chatUseCases';
import { ChatSession, ChatMessage } from '@/core/domain/chat';

const chatUseCases = new ChatUseCases(chatRepository);

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await chatUseCases.fetchSessions();
      setSessions(data || []);
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  }, []);

  const loadSessionDetails = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setLoadingMessages(true);
    try {
      const msgs = await chatUseCases.fetchSessionDetails(sessionId);
      setMessages(msgs || []);
      fetchSessions();
    } catch (err) {
      console.error('Failed to fetch session details:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const newChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    fetchSessions();
  };

  const deleteSession = async (sessionId: string) => {
    const res = await chatUseCases.deleteSession(sessionId);
    if (res.ok) {
      if (currentSessionId === sessionId) {
        newChat();
      } else {
        fetchSessions();
      }
    }
    return res;
  };

  const sendMessage = async (text: string, modelMode: string = 'auto') => {
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const result = await chatUseCases.sendMessage({
        message: text,
        topK: 5,
        sessionId: currentSessionId,
        modelMode: modelMode,
      });

      if (result.sukses || result.Sukses) {
        const data = result.data || result.Data;
        const answer = data?.answer || data?.Answer || 'Respon kosong.';
        const newSessionId = data?.sessionId || data?.SessionId;
        const sources = data?.sources || data?.Sources || [];

        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: answer,
          timestamp: new Date().toISOString(),
          sources: sources,
        };

        setMessages(prev => [...prev, aiMessage]);

        if (!currentSessionId && newSessionId) {
          setCurrentSessionId(newSessionId);
          fetchSessions();
        }
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan: ' + (result.pesan || result.Pesan || ''),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Kesalahan koneksi.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return {
    sessions,
    currentSessionId,
    messages,
    loadingMessages,
    isSending,
    fetchSessions,
    loadSessionDetails,
    newChat,
    deleteSession,
    sendMessage,
  };
}
