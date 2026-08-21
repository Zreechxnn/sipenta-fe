'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
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

export const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(
  ({ messages, isSending, onSelectPrompt }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const [selectedLightboxImg, setSelectedLightboxImg] = useState<{ url: string; caption: string } | null>(null);

    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isNearBottom && scrollHeight > clientHeight + 100);
    };

    const handleCopy = async (text: string, index: number) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Gagal menyalin:', err);
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      scrollToBottom();
    }, [messages.length, isSending]);

    return (
      <div className="flex-1 relative flex flex-col min-h-0">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 bg-[var(--color-surface)] flex flex-col pb-28 md:pb-6"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center max-w-xl mx-auto animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-navy)] flex items-center justify-center mb-4 shadow-md border border-white/10 p-2.5">
                <img src="/sipenta.svg" alt="SIPENTA" className="w-9 h-9 object-contain" />
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: 'var(--color-navy)' }}>
                Konsultasi & Analisis Kinerja AI
              </h3>
              <p className="text-[14px] leading-relaxed mb-8 max-w-md" style={{ color: 'var(--color-ink-muted)' }}>
                Tanyakan progres pekerjaan, evaluasi, atau kendala tenaga ahli. AI akan menganalisis laporan kerja yang tersimpan di sistem dan menyajikan ringkasan terkait.
              </p>

              {/* Starter Suggestions */}
              <div className="w-full text-left space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)] px-1">
                  💡 Saran Pertanyaan Cepat:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt?.(item.prompt)}
                      className="p-3.5 bg-white border border-black/[0.08] rounded-xl hover:border-[var(--color-gold)] hover:shadow-xs text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <i className={`fas ${item.icon} text-xs text-[var(--color-gold)]`} />
                        <span className="text-[12px] font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-navy-light)]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--color-ink-muted)] line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const roleStr = (msg.role || msg.Role || '').toLowerCase();
              const isUser = roleStr === 'user';
              const content = msg.content || msg.Content || '';
              const sourcesList = msg.sources || msg.Sources || [];
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={index}
                  className={`max-w-[92%] sm:max-w-[85%] w-fit relative z-10 animate-fade-up flex flex-col group ${
                    isUser ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
                        <img src="/sipenta.svg" alt="SIPENTA" className="w-4 h-4 object-contain animate-pulse-sync" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider">
                          SIPENTA AI Analis
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 text-[14px] sm:text-[15px] leading-relaxed relative ${
                      isUser
                        ? 'rounded-2xl rounded-tr-xs text-white shadow-xs'
                        : 'rounded-2xl rounded-tl-xs border border-black/[0.08] bg-white text-[var(--color-ink)] shadow-xs'
                    }`}
                    style={{
                      backgroundColor: isUser ? 'var(--color-navy)' : '#fff',
                    }}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                      <div>
                        {sourcesList && sourcesList.length > 0 && (() => {
                          const uniqueSources: any[] = [];
                          const seenLabels = new Set<string>();
                          const allImages: any[] = [];

                          sourcesList.forEach((src: any) => {
                            const label = getSourceLabel(src);
                            if (!seenLabels.has(label)) {
                              seenLabels.add(label);
                              uniqueSources.push({ ...src, _label: label });
                            }
                            const imgs = src.images || src.Images || [];
                            imgs.forEach((img: any) => {
                              allImages.push({
                                ...img,
                                sourceLabel: label,
                              });
                            });
                          });

                          return (
                            <div className="space-y-2.5 pb-3 mb-4 border-b border-[var(--color-border)]">
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] flex items-center gap-1">
                                  <i className="fas fa-bookmark text-[var(--color-gold)] text-[9px]" /> Rujukan Laporan:
                                </span>
                                {uniqueSources.map((src: any, srcIdx: number) => (
                                  <span
                                    key={srcIdx}
                                    className="text-[11px] font-medium px-2.5 py-1 rounded-sm flex items-center gap-1.5 border border-amber-200/60"
                                    style={{ backgroundColor: 'var(--color-gold-pale)', color: 'var(--color-navy)' }}
                                  >
                                    <i className="fas fa-file-pdf text-[10px]"></i>
                                    {src._label}
                                  </span>
                                ))}
                              </div>

                              {allImages.length > 0 && (
                                <div className="pt-1.5">
                                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <i className="fas fa-camera text-amber-500 text-[10px]" />
                                    <span>Foto / Dokumentasi Terlampir ({allImages.length}):</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {allImages.map((img: any, imgIdx: number) => {
                                      const rawUrl = img.url || img.Url || img.filePath || img.FilePath || '';
                                      const fullUrl = rawUrl.startsWith('http')
                                        ? rawUrl
                                        : `${getApiBaseUrl().replace(/\/api\/?$/, '')}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

                                      return (
                                        <div
                                          key={imgIdx}
                                          onClick={() => setSelectedLightboxImg({ url: fullUrl, caption: img.caption || img.Caption || `Hal. ${img.pageNumber || img.PageNumber || 1}` })}
                                          className="group/img relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-xs hover:shadow-md hover:border-amber-400 transition-all shrink-0"
                                          title={img.caption || img.Caption || 'Klik untuk memperbesar'}
                                        >
                                          <img
                                            src={fullUrl}
                                            alt={img.caption || img.Caption || 'Dokumentasi'}
                                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                          />
                                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                            <i className="fas fa-search-plus text-white text-xs" />
                                          </div>
                                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[9px] text-white truncate font-medium">
                                            Hal. {img.pageNumber || img.PageNumber || 1}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <MarkdownRenderer content={content} />
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Copy Action Bar - MOVED OUTSIDE THE MESSAGE BUBBLE */}
                  <div
                    className={`flex items-center gap-1 mt-1.5 text-[11px] transition-opacity duration-200 ${
                      isUser
                        ? 'text-slate-400 justify-end'
                        : 'text-[var(--color-ink-faint)] justify-between w-full'
                    }`}
                  >
                    {!isUser && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)] ml-1">
                        Analisis Laporan Tenaga Ahli
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(content, index)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                        isUser
                          ? 'hover:bg-black/5 text-slate-500'
                          : 'hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                      }`}
                      title="Salin pesan ke clipboard"
                    >
                      <i className={`fas ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy'} text-[10px]`} />
                      <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                  
                </div>
              );
            })
          )}

          {isSending && (
            <div className="max-w-[90%] sm:max-w-[85%] w-fit self-start mr-auto relative z-10 animate-fade-up flex flex-col">
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <div className="w-5 h-5 rounded-xs flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
                  <i className="fas fa-robot text-[9px]" style={{ color: 'var(--color-gold)' }}></i>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">
                  SIPENTA AI Analis
                </span>
              </div>
              <div
                className="p-4 sm:p-5 rounded-tr-lg rounded-br-lg rounded-bl-lg border bg-white shadow-xs flex items-center gap-3"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm font-medium text-[var(--color-ink-muted)]">
                  Mencari data laporan & menyusun jawaban...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 md:bottom-4 right-6 z-20 w-9 h-9 rounded-full bg-[var(--color-navy)] text-white shadow-md hover:bg-[var(--color-navy-light)] flex items-center justify-center transition-all duration-200 animate-scale-up active:scale-95 cursor-pointer border border-white/20"
            title="Gulir ke pesan terbaru"
          >
            <i className="fas fa-arrow-down text-xs text-[var(--color-gold)]" />
          </button>
        )}

        {/* Image Preview Lightbox */}
        {selectedLightboxImg && (
          <div 
            onClick={() => setSelectedLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold truncate">
                  <i className="fas fa-camera text-amber-400" />
                  <span>{selectedLightboxImg.caption || 'Foto Dokumentasi Laporan'}</span>
                </div>
                <button 
                  onClick={() => setSelectedLightboxImg(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="p-2 bg-slate-950 flex items-center justify-center overflow-auto max-h-[80vh]">
                <img
                  src={selectedLightboxImg.url}
                  alt={selectedLightboxImg.caption || 'Dokumentasi'}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';
