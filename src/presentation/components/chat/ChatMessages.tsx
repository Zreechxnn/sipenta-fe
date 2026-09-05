'use client';

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ChatMessage } from '@/core/domain/chat';
import { getApiBaseUrl } from '@/infrastructure/api/apiClient';
import { MarkdownRenderer } from './MarkdownRenderer';

const getSourceLabel = (src: any) => {
  const namaTenagaAhli = src.namaTenagaAhli || src.NamaTenagaAhli;
  const periodeLaporan = src.periodeLaporan || src.PeriodeLaporan;
  const title = src.documentTitle || src.DocumentTitle;
  const fileName = src.namaFile || src.NamaFile;

  if (namaTenagaAhli && periodeLaporan) {
    return `Laporan ${namaTenagaAhli} - ${periodeLaporan}`;
  }

  if (namaTenagaAhli) {
    return `Laporan ${namaTenagaAhli}`;
  }

  if (title) {
    return title.length > 45 ? title.substring(0, 42) + '...' : title;
  }

  if (fileName) {
    return fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName;
  }

  return 'Dokumen Sumber';
};

interface ChatMessagesProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export interface ChatMessagesRef {
  scrollToBottom: () => void;
}

const STARTER_PROMPTS = [
  {
    title: 'Progres Pekerjaan',
    prompt: 'Apa progres pengerjaan modul autentikasi bulan Agustus?',
    icon: 'fa-tasks',
  },
  {
    title: 'Penyelesaian Bug',
    prompt: 'Bagaimana status perbaikan bug pada fitur pelaporan?',
    icon: 'fa-bug',
  },
  {
    title: 'Hambatan Tim',
    prompt: 'Apa saja hambatan operasional yang dialami tim infrastruktur?',
    icon: 'fa-exclamation-triangle',
  },
];

interface MessageBubbleProps {
  msg: ChatMessage;
  index: number;
  isCopied: boolean;
  onCopy: (content: string, index: number) => void;
}

const MessageBubble = React.memo<MessageBubbleProps>(({ msg, index, isCopied, onCopy }) => {
  const roleStr = (msg.role || msg.Role || '').toLowerCase();
  const isUser = roleStr === 'user';
  const content = msg.content || msg.Content || '';
  const sourcesList = msg.sources || msg.Sources || [];

  return (
    <div
      className={`relative z-10 flex flex-col group min-w-0 ${
        isUser
          ? 'max-w-[92%] sm:max-w-[85%] w-fit self-end items-end'
          : 'w-full sm:w-fit sm:max-w-[85%] self-start items-start'
      }`}
    >
      {!isUser && (
        <div className="flex items-center gap-2 mb-1.5 ml-1">
          <div className="w-5 h-5 rounded-md flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
            <img src="/sipenta.svg" alt="SIPENTA" className="w-3.5 h-3.5 object-contain" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider">
              SIPENTA AI Analis
            </span>
          </div>
        </div>
      )}

      <div
        className={`w-full max-w-full min-w-0 p-3 sm:p-4 md:p-5 text-[13px] sm:text-[14px] leading-relaxed relative ${
          isUser
            ? 'rounded-2xl rounded-tr-xs text-white shadow-xs bg-indigo-600'
            : 'rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white text-slate-800 shadow-2xs'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap font-medium">{content}</div>
        ) : (
          <div className="min-w-0">
            {sourcesList && sourcesList.length > 0 && (() => {
              const uniqueSources: any[] = [];
              const seenLabels = new Set<string>();

              sourcesList.forEach((src: any) => {
                const label = getSourceLabel(src);
                if (!seenLabels.has(label)) {
                  seenLabels.add(label);
                  uniqueSources.push({ ...src, _label: label });
                }
              });

              if (uniqueSources.length === 0) return null;

              return (
                <div className="pb-2.5 mb-3 border-b border-slate-100 min-w-0">
                  <div className="flex flex-wrap gap-1.5 items-center min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
                      <i className="fas fa-bookmark text-indigo-500 text-[9px]" /> Rujukan Dokumen:
                    </span>
                    {uniqueSources.map((src: any, srcIdx: number) => (
                      <span
                        key={srcIdx}
                        className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 max-w-full truncate"
                      >
                        <i className="fas fa-file-pdf text-[9.5px] shrink-0"></i>
                        <span className="truncate">{src._label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>

      {/* Quick Copy Action Bar */}
      <div
        className={`flex items-center gap-1 mt-1 text-[11px] transition-opacity duration-150 ${
          isUser
            ? 'text-slate-400 justify-end'
            : 'text-slate-400 justify-between w-full'
        }`}
      >
        {!isUser && (
          <span className="text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 ml-1">
            Analisis AI Laporan Tenaga Ahli
          </span>
        )}
        <button
          onClick={() => onCopy(content, index)}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
            isUser
              ? 'hover:bg-slate-100 text-slate-500'
              : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
          }`}
          title="Salin pesan ke clipboard"
        >
          <i className={`fas ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy'} text-[10px]`} />
          <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
        </button>
      </div>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(
  ({ messages, isSending, onSelectPrompt }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showScrollBottom, setShowScrollBottom] = useState(false);

    const scrollRafRef = useRef<number | null>(null);

    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    const handleScroll = useCallback(() => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        const shouldShow = !isNearBottom && scrollHeight > clientHeight + 100;
        setShowScrollBottom(prev => (prev !== shouldShow ? shouldShow : prev));
      });
    }, []);

    const handleCopy = useCallback(async (text: string, index: number) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Gagal menyalin:', err);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      scrollToBottom();
    }, [messages.length, isSending]);

    useEffect(() => {
      return () => {
        if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      };
    }, []);

    return (
      <div className="flex-1 relative flex flex-col min-h-0 h-full overflow-hidden">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto min-h-0 p-2.5 sm:p-5 space-y-3 sm:space-y-5 bg-slate-50/50 flex flex-col overscroll-contain"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-3 sm:py-6 text-center max-w-xl mx-auto animate-fade-up">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-2.5 sm:mb-3 shadow-md shadow-indigo-600/20 text-white p-2">
                <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
              </div>
              <h3 className="text-base sm:text-2xl font-bold text-slate-900 mb-1">
                Konsultasi & Analisis Kinerja AI
              </h3>
              <p className="text-[11.5px] sm:text-sm text-slate-500 leading-relaxed mb-4 sm:mb-6 max-w-md px-2">
                Tanyakan progres pekerjaan, evaluasi, atau kendala tenaga ahli. AI akan menganalisis laporan kerja yang tersimpan di sistem dan menyajikan ringkasan terkait.
              </p>

              {/* Starter Suggestions */}
              <div className="w-full text-left space-y-1.5 sm:space-y-2">
                <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  💡 Saran Pertanyaan Cepat:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt?.(item.prompt)}
                      className="p-2.5 sm:p-3.5 bg-white border border-slate-200/80 rounded-xl hover:border-indigo-500 hover:shadow-xs text-left transition-all duration-150 group cursor-pointer flex flex-col justify-between active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <i className={`fas ${item.icon} text-xs text-indigo-600`} />
                        <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble
                key={index}
                msg={msg}
                index={index}
                isCopied={copiedIndex === index}
                onCopy={handleCopy}
              />
            ))
          )}

          {isSending && (
            <div className="max-w-[90%] sm:max-w-[85%] w-fit self-start mr-auto relative z-10 flex flex-col">
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <i className="fas fa-robot text-[9px]"></i>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  SIPENTA AI Analis
                </span>
              </div>
              <div
                className="p-4 rounded-2xl rounded-tl-xs border border-slate-200/80 bg-white shadow-xs flex items-center gap-3"
              >
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-xs font-semibold text-slate-600">
                  Mencari konteks laporan & menyusun analisis...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center transition-all duration-200 animate-scale-up active:scale-95 cursor-pointer border border-white/20"
            title="Gulir ke pesan terbaru"
          >
            <i className="fas fa-arrow-down text-xs" />
          </button>
        )}
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';
