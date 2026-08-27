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
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 140);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isSending || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Refocus after send on desktop
      if (window.innerWidth >= 768) {
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
    <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-slate-100 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="flex items-end gap-2 sm:gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-1.5 sm:p-2 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-2xs">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder={
            disabled
              ? 'Menunggu persetujuan akun...'
              : 'Tanyakan sesuatu mengenai laporan kerja... (Shift+Enter untuk baris baru)'
          }
          disabled={disabled || isSending}
          rows={1}
          className="flex-1 bg-transparent px-3 py-2 text-[13.5px] sm:text-sm text-slate-800 focus:outline-none resize-none overflow-y-auto leading-relaxed min-h-[40px] max-h-[140px] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400"
        />

        <button
          onClick={handleSend}
          disabled={disabled || isSending || !input.trim()}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/20 disabled:opacity-35 disabled:shadow-none disabled:cursor-not-allowed shrink-0 cursor-pointer"
          title="Kirim pesan (Enter)"
          aria-label="Kirim pesan"
        >
          {isSending ? (
            <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
          ) : (
            <i className="fas fa-arrow-up text-sm"></i>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between px-2 pt-1.5 text-[10.5px] text-slate-400">
        <span className="hidden sm:inline">
          Tekan <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9.5px]">Enter</kbd> untuk kirim, <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9.5px]">Shift + Enter</kbd> baris baru
        </span>
        <span className="ml-auto text-[10px] text-slate-400">
          AI menggunakan basis data dokumen bidang Anda
        </span>
      </div>
    </div>
  );
};
