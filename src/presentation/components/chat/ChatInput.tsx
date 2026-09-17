'use client';

import React, { useState, useEffect, useRef } from 'react';

export type ModelMode = 'auto' | 'text' | 'vision';

interface ModelOption {
  id: ModelMode;
  name: string;
  badge: string;
  icon: string;
  color: string;
  description: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'auto',
    name: 'Auto (Hybrid)',
    badge: 'Rekomendasi',
    icon: 'fa-wand-magic-sparkles',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    description: 'Deteksi visual & kata rujukan otomatis (Vision AI) dan analisis mendalam teks',
  },
  {
    id: 'text',
    name: 'Model Teks (120B)',
    badge: 'Penalaran',
    icon: 'fa-file-lines',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    description: 'Analisis mendalam laporan kerja, tabel, & rekapitulasi data',
  },
  {
    id: 'vision',
    name: 'Model Vision (Qwen)',
    badge: 'Visual & Kode',
    icon: 'fa-eye',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    description: 'Fokus membaca gambar dokumen, screenshot IDE/kode, & UI',
  },
];

interface ChatInputProps {
  onSend: (message: string, modelMode: ModelMode) => void;
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
  const [modelMode, setModelMode] = useState<ModelMode>('auto');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('siap_chat_model_mode') as ModelMode;
      if (saved && (saved === 'auto' || saved === 'text' || saved === 'vision')) {
        setModelMode(saved);
      } else {
        setModelMode('auto');
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModelDropdownOpen]);

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

  const handleSelectModel = (mode: ModelMode) => {
    setModelMode(mode);
    setIsModelDropdownOpen(false);
    try {
      localStorage.setItem('siap_chat_model_mode', mode);
    } catch {}
  };

  const handleSend = () => {
    if (!input.trim() || isSending || disabled) return;
    onSend(input.trim(), modelMode);
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

  const handleFocus = () => {
    setIsModelDropdownOpen(false);
    onFocus?.();
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      setTimeout(() => {
        onFocus?.();
      }, 250);
    }
  };

  const activeOption = MODEL_OPTIONS.find(m => m.id === modelMode) || MODEL_OPTIONS[0];

  return (
    <div className="shrink-0 p-2 sm:p-3 bg-white border-t border-slate-100/90 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {/* Top Bar (Above Field Chat): Model Selector + Shortcuts Info */}
      <div className="flex items-center justify-between px-0.5 pb-1.5 sm:pb-2 text-[10.5px] text-slate-500 gap-2 relative">
        {/* Model Selector Dropdown Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsModelDropdownOpen(prev => !prev)}
            disabled={disabled || isSending}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${activeOption.color}`}
            title="Klik untuk memilih model AI"
          >
            <i className={`fas ${activeOption.icon} text-[10px]`}></i>
            <span>{activeOption.name}</span>
            <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {/* Dropdown Menu - Opens Upward over messages */}
          {isModelDropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1.5 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-scale-up">
              <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Pilih Model AI</span>
                <span className="text-[9.5px] text-slate-400">SIAP Multimodal</span>
              </div>
              <div className="space-y-1 pt-1">
                {MODEL_OPTIONS.map(opt => {
                  const isSelected = opt.id === modelMode;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectModel(opt.id)}
                      className={`w-full text-left p-2 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected ? 'bg-indigo-50/80 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <i className={`fas ${opt.icon} text-[10px]`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[11.5px] font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {opt.name}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-medium ${
                            isSelected ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hints & info */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="hidden sm:inline">
            <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9px]">Enter</kbd> kirim, <kbd className="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[9px]">Shift+Enter</kbd> baris baru
          </span>
          <span className="sm:hidden text-[10px] text-slate-400 font-medium flex items-center gap-1">
            <i className="fas fa-sparkles text-[9px] text-indigo-500"></i>
            SIAP AI
          </span>
        </div>
      </div>

      {/* Main Chat Input Field Container */}
      <div className="flex items-end gap-1.5 sm:gap-2.5 bg-slate-50 border border-slate-200/90 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 sm:focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-2xs">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={
            disabled
              ? 'Menunggu persetujuan akun...'
              : 'Tanyakan mengenai laporan kerja...'
          }
          disabled={disabled || isSending}
          rows={1}
          enterKeyHint="send"
          className="flex-1 bg-transparent px-2.5 sm:px-3 py-1.5 sm:py-2 text-[16px] sm:text-sm text-slate-800 focus:outline-none resize-none overflow-y-auto leading-relaxed min-h-[38px] max-h-[100px] sm:max-h-[140px] disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-slate-400 placeholder:text-xs sm:placeholder:text-sm"
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
    </div>
  );
};

