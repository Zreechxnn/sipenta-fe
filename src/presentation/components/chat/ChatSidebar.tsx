'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpenMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpenMobile]);

  // Reset drag when closing
  useEffect(() => {
    if (!isOpenMobile) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isOpenMobile]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile && onCloseMobile) {
        onCloseMobile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  // Touch Drag-to-Slide Handlers (Real-time gesture slider X)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0;
      }
    }

    if (isHorizontalSwipeRef.current) {
      if (deltaX < 0) {
        setIsDragging(true);
        setDragOffset(deltaX);
      } else {
        setDragOffset(0);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isDragging && onCloseMobile) {
      if (dragOffset < -70) {
        onCloseMobile();
      }
      setDragOffset(0);
      setIsDragging(false);
    }
    isHorizontalSwipeRef.current = null;
  }, [isDragging, dragOffset, onCloseMobile]);

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

  const drawerTransform = isOpenMobile
    ? isDragging
      ? `translateX(${dragOffset}px)`
      : 'translateX(0%)'
    : 'translateX(-105%)';

  const backdropOpacity = isOpenMobile
    ? isDragging
      ? Math.max(0.2, 1 + dragOffset / 300)
      : 1
    : 0;

  const renderContent = (isMobileView: boolean) => (
    <div className="w-full h-full flex flex-col bg-white min-h-0 overflow-hidden">
      {/* Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
            <i className="fas fa-history" />
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">Riwayat Sesi</h3>
          {sessions.length > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
              {sessions.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs active:scale-95 cursor-pointer"
            title="Mulai sesi baru"
          >
            <i className="fas fa-plus text-[10px]" />
            <span>Baru</span>
          </button>
          {isMobileView && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden w-8 h-8 rounded-lg hover:bg-slate-200/70 flex items-center justify-center transition-colors text-slate-500 hover:text-slate-800 active:scale-95 cursor-pointer"
              aria-label="Tutup riwayat"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto min-h-0 p-2.5 space-y-1 overscroll-contain custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2.5 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-sm">
              <i className="fas fa-comments" />
            </div>
            <p className="text-xs font-bold text-slate-700">Belum Ada Riwayat Sesi</p>
            <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
              Pertanyaan yang Anda ajukan akan otomatis tersimpan dan terkelompok di sini.
            </p>
          </div>
        ) : (
          sessions.map((session) => {
            const id = session.id || session.Id || '';
            const title = session.title || session.Title || 'Analisis Baru';
            const isSelected = id === currentSessionId;

            return (
              <div
                key={id}
                onClick={() => handleSelect(id)}
                className={`group flex justify-between items-center px-3 py-2.5 rounded-2xl cursor-pointer transition-colors duration-150 relative overflow-hidden active:scale-[0.98] ${
                  isSelected
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200/80 shadow-2xs font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <i className={`fas fa-comment-dots text-xs shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate text-xs">
                    {title}
                  </span>
                </div>
                
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSessionToDelete({ id, title });
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-opacity duration-150 ${
                    isSelected ? 'opacity-70 hover:opacity-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600'
                  } active:scale-90 cursor-pointer`}
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
      <div className="hidden md:flex w-72 h-full min-h-0 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex-col overflow-hidden shrink-0">
        {renderContent(false)}
      </div>

      {/* Mobile Drawer view Slider X */}
      <div
        className={`md:hidden fixed inset-0 z-50 select-none transition-all duration-300 ${
          isOpenMobile ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 delay-100'
        }`}
        aria-hidden={!isOpenMobile}
      >
        {/* Overlay backdrop */}
        <div
          onClick={onCloseMobile}
          style={{
            opacity: backdropOpacity,
            transition: isDragging ? 'none' : 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer will-change-[opacity]"
        />

        {/* Drawer container Slider X */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: drawerTransform,
            transition: isDragging
              ? 'none'
              : 'transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform',
          }}
          className="fixed top-0 left-0 bottom-0 z-10 w-[84%] max-w-[320px] h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden border-r border-slate-200/80 rounded-r-3xl"
        >
          {/* Grab handle */}
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-slate-200 pointer-events-none opacity-60" />
          {renderContent(true)}
        </div>
      </div>
    </>
  );
};
