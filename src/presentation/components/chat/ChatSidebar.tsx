'use client';

import React from 'react';
import { ChatSession } from '@/core/domain/chat';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const handleSelect = (id: string) => {
    onSelectSession(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNew = () => {
    onNewChat();
    if (onCloseMobile) onCloseMobile();
  };

  const [sessionToDelete, setSessionToDelete] = React.useState<{ id: string; title: string } | null>(null);

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  };

  const content = (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center shrink-0 bg-[var(--color-surface)]">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base text-[var(--color-navy)]">Riwayat Sesi</h3>
          {sessions.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
              {sessions.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-sm bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)] transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Mulai sesi baru"
          >
            <i className="fas fa-plus text-[10px] text-[var(--color-gold)]" />
            <span className="hidden sm:inline">Baru</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden w-7 h-7 rounded-sm hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)]"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-faint)] flex items-center justify-center mx-auto">
              <i className="fas fa-history text-xs" />
            </div>
            <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">Belum ada riwayat</p>
            <p className="text-[11px] text-[var(--color-ink-faint)]">
              Pertanyaan yang Anda ajukan akan otomatis tersimpan di sini.
            </p>
          </div>
        ) : (
          sessions.map(session => {
            const id = session.id || session.Id || '';
            const title = session.title || session.Title || 'Analisis Baru';
            const isSelected = id === currentSessionId;

            return (
              <div
                key={id}
                onClick={() => handleSelect(id)}
                className={`group flex justify-between items-center px-3 py-2.5 rounded-sm cursor-pointer transition-all duration-150 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] shadow-2xs'
                    : 'hover:bg-[var(--color-surface)]'
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-gold)] animate-fade-in" />
                )}
                
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <i className={`fas fa-comment-alt text-[11px] shrink-0 ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink-faint)]'}`} />
                  <span 
                    className={`truncate text-[13px] ${isSelected ? 'font-medium text-[var(--color-navy)]' : 'text-[var(--color-ink)]'}`}
                  >
                    {title}
                  </span>
                </div>
                
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSessionToDelete({ id, title });
                  }}
                  className={`w-6 h-6 rounded-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                    isSelected ? 'opacity-70 hover:opacity-100' : ''
                  } text-[var(--color-ink-muted)] hover:text-white hover:bg-[var(--color-error)] active:scale-95`}
                  title="Hapus sesi"
                >
                  <i className="fas fa-trash-alt text-[10px]"></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sessionToDelete}
        title="Hapus Sesi Analisis"
        message="Riwayat percakapan ini akan dihapus dari arsip Anda."
        itemName={sessionToDelete?.title}
        confirmText="Hapus Sesi"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onClose={() => setSessionToDelete(null)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop view (always visible on md+) */}
      <div className="hidden md:flex w-72 apple-card bg-white border border-black/[0.07] rounded-2xl shadow-xs flex-col overflow-hidden shrink-0">
        {content}
      </div>

      {/* Mobile Drawer view */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer animate-backdrop"
            onClick={onCloseMobile}
          ></div>

          {/* Drawer container */}
          <div className="relative w-[85%] max-w-sm h-full bg-white z-10 flex flex-col animate-slide-left shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
