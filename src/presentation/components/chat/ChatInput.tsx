'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  onFocus?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isSending,
  onFocus,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea smoothly based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const minH = isMobile ? 38 : 42;
      const maxH = isMobile ? 100 : 140;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minH), maxH);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isSending || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Refocus after send on desktop only
      if (typeof window !== 'undefined' && window.innerWidth >= 768) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 p-2 sm:p-3 bg-white border-t border-slate-100 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end gap-1.5 sm:gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-2xs">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder={
            disabled
              ? 'Menunggu persetujuan akun...'
              : 'Tanyakan mengenai laporan kerja...'
          }
          disabled={disabled || isSending}
          rows={1}
          className="flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-base sm:text-sm text-slate-800 focus:outline-none resize-none overflow-y-auto leading-relaxed min-h-[38px] max-h-[100px] sm:max-h-[140px] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm"
        />

        <button
          onClick={handleSend}
          disabled={disabled || isSending || !input.trim()}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed shrink-0 cursor-pointer mb-0.5"
          title="Kirim pesan"
          aria-label="Kirim pesan"
        >
          {isSending ? (
            <i className="fa-solid fa-circle-notch fa-spin text-xs sm:text-sm"></i>
          ) : (
            <i className="fas fa-arrow-up text-xs sm:text-sm"></i>
          )}
        </button>
      </div>

      <div className="hidden sm:flex items-center justify-between px-2 pt-1.5 text-[10.5px] text-slate-400">
        <span>
          Tekan <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9.5px]">Enter</kbd> untuk kirim, <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9.5px]">Shift + Enter</kbd> baris baru
        </span>
        <span className="ml-auto text-[10px] text-slate-400">
          AI menggunakan basis data dokumen bidang Anda
        </span>
      </div>
    </div>
  );
};

