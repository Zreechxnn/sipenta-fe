'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  onFocus?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isSending, onFocus, disabled = false }) => {
  const [input, setInput] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const updateOffset = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(Math.max(0, offset));
    };

    const vv = window.visualViewport;
    vv.addEventListener('resize', updateOffset);
    vv.addEventListener('scroll', updateOffset);

    updateOffset();

    return () => {
      vv.removeEventListener('resize', updateOffset);
      vv.removeEventListener('scroll', updateOffset);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={keyboardOffset > 0 ? { bottom: `${keyboardOffset}px` } : undefined}
      className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-lg border-t border-black/[0.06] pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-end gap-2.5 transition-[bottom] duration-100 ease-out md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:p-4 md:pb-4 md:border-t"
    >
      <div className="relative flex-1 group">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            onFocus?.();
            setTimeout(() => {
              onFocus?.();
            }, 300);
          }}
          placeholder={disabled ? "Akun Anda sedang menunggu persetujuan Admin sebelum dapat menggunakan AI..." : "Tanyakan sesuatu mengenai laporan... (Shift+Enter untuk baris baru)"}
          disabled={disabled || isSending}
          rows={1}
          className="w-full border border-black/[0.08] px-4.5 py-3 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all rounded-2xl shadow-2xs min-w-0 pr-12 resize-none overflow-y-auto leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ minHeight: '46px', maxHeight: '120px' }}
        />
        <div className="absolute right-3.5 bottom-3.5 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none text-[10px] font-semibold text-[var(--color-ink-faint)] uppercase tracking-widest hidden sm:block">
          ↵ Enter
        </div>
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || isSending || !input.trim()}
        className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-full transition-all text-sm cursor-pointer disabled:opacity-40 shrink-0 shadow-xs hover:shadow-md active:scale-90"
        style={{ 
          backgroundColor: 'var(--color-navy)',
          color: 'var(--color-gold)'
        }}
        onMouseEnter={e => {
          if (!isSending && input.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
          }
        }}
        onMouseLeave={e => {
          if (!isSending && input.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
          }
        }}
      >
        <i className="fas fa-arrow-up text-sm"></i>
      </button>
    </div>
  );
};
