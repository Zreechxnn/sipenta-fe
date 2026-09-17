'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { PendingApprovalNotice } from '@/presentation/components/common/PendingApprovalNotice';
import { ChatSidebar } from '@/presentation/components/chat/ChatSidebar';
import { ChatMessages, ChatMessagesRef } from '@/presentation/components/chat/ChatMessages';
import { ChatInput } from '@/presentation/components/chat/ChatInput';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useChat } from '@/presentation/hooks/useChat';
import { useToast } from '@/presentation/hooks/useToast';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';

export default function ChatPage() {
  const { isLoading: authLoading, isPendingApproval, refreshProfile } = useAuth(true, false);
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileChatHistoryOpen, setMobileChatHistoryOpen] = useState(false);
  const chatMessagesRef = useRef<ChatMessagesRef>(null);

  const {
    sessions,
    currentSessionId,
    messages,
    isSending,
    fetchSessions,
    loadSessionDetails,
    newChat,
    deleteSession,
    sendMessage,
  } = useChat();

  const handleChatChange = useCallback((event: string, data?: any) => {
    fetchSessions();
    if (event === 'ChatSessionUpdated' && data?.sessionId && data.sessionId === currentSessionId) {
      loadSessionDetails(data.sessionId);
    }
  }, [fetchSessions, loadSessionDetails, currentSessionId]);

  const handleUserChange = useCallback((event: string) => {
    if (event === 'UserUpdated') {
      refreshProfile();
    }
  }, [refreshProfile]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, handleUserChange, handleChatChange);

  useEffect(() => {
    if (!authLoading && !isPendingApproval) {
      fetchSessions();
    }
  }, [authLoading, isPendingApproval, fetchSessions]);

  // Handle mobile visual viewport resize (virtual keyboard opens / closes)
  useEffect(() => {
    const handleViewportChange = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        chatMessagesRef.current?.scrollToBottom();
      }
    };

    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
        window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      };
    }
  }, []);

  if (authLoading) return null;

  const handleDeleteSession = async (id: string) => {
    const res = await deleteSession(id);
    if (!res.ok) {
      showToast('Gagal menghapus sesi: ' + (res.message || ''), true);
    }
  };

  const handleInputFocus = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    chatMessagesRef.current?.scrollToBottom();
  };

  const handleSendMessage = (msg: string, mode: string = 'auto') => {
    if (isPendingApproval) {
      showToast('Akun Anda masih menunggu persetujuan Admin/Kepala Bidang sebelum dapat menggunakan Asisten AI.', true);
      return;
    }
    sendMessage(msg, mode);
  };

  return (
    <div className="fixed inset-0 w-full h-full h-[100dvh] max-h-[100dvh] flex flex-col bg-slate-50/50 overflow-hidden select-none sm:select-auto">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-2 sm:pb-4 flex flex-col min-h-0 overflow-hidden animate-fadeIn">
        {/* Pending Approval Alert */}
        {isPendingApproval && (
          <div className="shrink-0 mb-2 sm:mb-3">
            <PendingApprovalNotice onRefresh={refreshProfile} />
          </div>
        )}

        {/* Header Section - Sleek and Compact */}
        <div className="shrink-0 flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
                <i className="fas fa-comment-dots text-xs sm:text-sm"></i>
              </div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
                Asisten AI Dokumen
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block mt-0.5">
              Mencari konteks dokumen laporan kerja bidang Anda secara otomatis.
            </p>
          </div>

          {/* Quick Actions (Both Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setMobileChatHistoryOpen(true)}
              className="md:hidden inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
              title="Buka riwayat percakapan"
            >
              <i className="fas fa-history text-indigo-600 text-[11px]"></i>
              <span>Riwayat</span>
              {sessions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  {sessions.length}
                </span>
              )}
            </button>
            <button
              onClick={newChat}
              disabled={isPendingApproval}
              className="inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
              title="Mulai sesi percakapan baru"
            >
              <i className="fas fa-plus text-[10px] sm:text-xs"></i>
              <span className="hidden xs:inline">Sesi Baru</span>
              <span className="xs:hidden">Baru</span>
            </button>
          </div>
        </div>

        {/* Chat Body - Fixed Container with independent internal scrolling */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-5 flex-1 min-h-0 overflow-hidden">
          {/* Chat Sessions History Sidebar */}
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={loadSessionDetails}
            onNewChat={newChat}
            onDeleteSession={handleDeleteSession}
            isOpenMobile={mobileChatHistoryOpen}
            onCloseMobile={() => setMobileChatHistoryOpen(false)}
          />

          {/* Chat Messages & Input Area */}
          <div className="flex-1 bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl shadow-xs flex flex-col overflow-hidden relative min-h-0 h-full">
            <ChatMessages 
              ref={chatMessagesRef} 
              messages={messages} 
              isSending={isSending} 
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />
            <ChatInput 
              onSend={handleSendMessage} 
              isSending={isSending} 
              onFocus={handleInputFocus} 
              disabled={isPendingApproval}
            />
          </div>
        </div>
      </main>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
