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

  if (authLoading) return null;

  const handleDeleteSession = async (id: string) => {
    const res = await deleteSession(id);
    if (!res.ok) {
      showToast('Gagal menghapus sesi: ' + (res.message || ''), true);
    }
  };

  const handleInputFocus = () => {
    chatMessagesRef.current?.scrollToBottom();
  };

  const handleSendMessage = (msg: string) => {
    if (isPendingApproval) {
      showToast('Akun Anda masih menunggu persetujuan Admin/Kasubag sebelum dapat menggunakan Asisten AI.', true);
      return;
    }
    sendMessage(msg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-6 flex flex-col animate-fadeIn">
        {/* Pending Approval Alert */}
        {isPendingApproval && (
          <div className="mb-4">
            <PendingApprovalNotice onRefresh={refreshProfile} />
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-4 sm:mb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <i className="fas fa-comment-dots text-sm sm:text-base"></i>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                Asisten AI Dokumen
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 line-clamp-1 sm:line-clamp-none">
              Mencari konteks dokumen laporan kerja bidang Anda secara otomatis.
            </p>
          </div>

          {/* Mobile Chat Controls */}
          <div className="flex w-full md:hidden items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
            <button
              onClick={() => setMobileChatHistoryOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            >
              <i className="fas fa-history text-indigo-600"></i>
              <span>Riwayat ({sessions.length})</span>
            </button>
            <button
              onClick={newChat}
              disabled={isPendingApproval}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
            >
              <i className="fas fa-plus text-xs"></i>
              <span>Sesi Baru</span>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-[calc(100dvh-170px)] sm:h-[calc(100dvh-190px)] md:h-[calc(100vh-220px)] min-h-[420px]">
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
          <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
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
