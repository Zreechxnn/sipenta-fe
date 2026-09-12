'use client';

import React, { useState, useEffect } from 'react';

import { getApiBaseUrl, authFetch, getAccessToken } from '@/infrastructure/api/apiClient';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const ChatImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const rawSrc = (src || '').replace(/^url\s*=\s*/i, '').trim();

  // Normalize any drive or hallucinated external host (e.g. imgur, google drive) containing a document image file ID
  let normalizedSrc = rawSrc;
  const driveIdMatch = rawSrc.match(/(?:images\/|[?&]id=|imgur\.com\/)([a-zA-Z0-9_\-]{25,})/i);
  if (driveIdMatch) {
    normalizedSrc = `/api/Documents/images/${driveIdMatch[1]}`;
  }

  let cleanSrc = normalizedSrc.startsWith('/') ? normalizedSrc : `/${normalizedSrc}`;
  if (cleanSrc.startsWith('/Documents/images/')) {
    cleanSrc = `/api${cleanSrc}`;
  }
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
  const isApiImage = cleanSrc.startsWith('/api/Documents/images/') || normalizedSrc.includes('/Documents/images/');
  const fullUrl = normalizedSrc.startsWith('http') && !isApiImage
    ? normalizedSrc
    : `${baseUrl}${cleanSrc}`;

  useEffect(() => {
    if (!rawSrc) {
      setError(true);
      setLoading(false);
      return;
    }

    let isMounted = true;
    let blobUrl: string | null = null;

    const fetchImage = async () => {
      setLoading(true);
      setError(false);

      if (isApiImage) {
        try {
          const res = await authFetch(fullUrl);
          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }
          const blob = await res.blob();
          if (!isMounted) return;
          blobUrl = URL.createObjectURL(blob);
          setDisplaySrc(blobUrl);
          setLoading(false);
        } catch {
          if (!isMounted) return;
          // Fallback to tokenized URL in query parameter
          const token = getAccessToken();
          const separator = fullUrl.includes('?') ? '&' : '?';
          const fallback = token ? `${fullUrl}${separator}access_token=${encodeURIComponent(token)}` : fullUrl;
          setDisplaySrc(fallback);
          setLoading(false);
        }
      } else {
        setDisplaySrc(fullUrl);
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fullUrl, isApiImage, rawSrc]);

  // Handle keyboard events & body scroll lock when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setZoom(1);
      } else if (e.key === '+' || e.key === '=') {
        setZoom(z => Math.min(3, Number((z + 0.25).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        setZoom(z => Math.max(0.5, Number((z - 0.25).toFixed(2))));
      } else if (e.key === '0') {
        setZoom(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleOpen = () => {
    setZoom(1);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setZoom(1);
  };

  const handleZoomIn = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(z => Math.min(3, Number((z + 0.25).toFixed(2))));
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(z => Math.max(0.5, Number((z - 0.25).toFixed(2))));
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setZoom(1);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoom(z => (z > 1 ? 1 : 1.75));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      setZoom(z => Math.min(3, Number((z + 0.15).toFixed(2))));
    } else {
      setZoom(z => Math.max(0.5, Number((z - 0.15).toFixed(2))));
    }
  };

  if (error || !rawSrc) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 text-slate-500 rounded border border-slate-200 my-1">
        <i className="fas fa-image text-slate-400 text-xs" />
        <span className="italic">{alt || 'Gambar lampiran tidak dapat dimuat'}</span>
      </span>
    );
  }

  const activeSrc = displaySrc || fullUrl;

  return (
    <>
      <div className="my-2.5 w-full max-w-[320px] sm:w-[360px] sm:max-w-[360px] rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-xs group">
        <div 
          onClick={handleOpen}
          className="relative cursor-zoom-in overflow-hidden bg-slate-100 aspect-[16/10] flex items-center justify-center"
        >
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 bg-slate-50 animate-pulse">
              <i className="fas fa-circle-notch fa-spin text-lg text-emerald-500" />
              <span className="text-[11px] font-medium text-slate-500">Memuat foto...</span>
            </div>
          ) : (
            <img
              src={activeSrc}
              alt={alt || 'Foto Dokumentasi'}
              onError={() => setError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          )}
          {!loading && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
              <span className="bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs shadow-xs">
                <i className="fas fa-search-plus text-[10px]" /> Perbesar
              </span>
            </div>
          )}
        </div>
        {alt && (
          <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-600 font-medium truncate flex items-center gap-1.5">
            <i className="fas fa-image text-slate-400 text-[10px] shrink-0" />
            <span className="truncate">{alt}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          onClick={handleClose}
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in chat-image-modal select-none"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-700/60" 
            onClick={e => e.stopPropagation()}
          >
            {/* Header with Title & Zoom Controls */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950/90 border-b border-slate-800 text-white gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold truncate min-w-0">
                <i className="fas fa-camera text-amber-400 shrink-0" />
                <span className="truncate">{alt || 'Foto Dokumentasi Laporan'}</span>
              </div>

              {/* Action & Zoom Toolbar */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Zoom Out Button */}
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Perkecil / Zoom Out (-)"
                >
                  <i className="fas fa-search-minus" />
                </button>

                {/* Zoom Level Reset Button */}
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center text-[11px] font-mono transition-colors cursor-pointer"
                  title="Klik untuk reset zoom ke 100%"
                >
                  {Math.round(zoom * 100)}%
                </button>

                {/* Zoom In Button */}
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Perbesar / Zoom In (+)"
                >
                  <i className="fas fa-search-plus" />
                </button>

                {/* Open in new tab */}
                <a
                  href={activeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Buka gambar di tab baru"
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fas fa-arrow-up-right-from-square text-[11px]" />
                </a>

                <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

                {/* Close Button */}
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-7 h-7 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Tutup (Esc)"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/* Image Viewport Container */}
            <div 
              onWheel={handleWheel}
              onClick={handleClose}
              className="p-3 sm:p-4 bg-slate-950/95 flex items-center justify-center overflow-auto max-h-[82vh] min-h-[300px] cursor-pointer"
              title="Klik di luar gambar atau tekan Esc untuk menutup"
            >
              <div 
                className="transition-transform duration-200 ease-out flex items-center justify-center"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={activeSrc}
                  alt={alt || 'Foto Dokumentasi'}
                  onClick={handleImageClick}
                  className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all ${
                    zoom > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  title={zoom > 1 ? 'Klik gambar untuk zoom out (100%)' : 'Klik gambar untuk zoom in'}
                />
              </div>
            </div>

            {/* Footer Hint */}
            <div className="px-3.5 py-1.5 bg-slate-950 border-t border-slate-800/80 text-[10.5px] text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <i className="fas fa-info-circle text-sky-400" />
                <span>Gunakan tombol zoom, scroll mouse wheel, atau klik gambar untuk memperbesar/memperkecil.</span>
              </span>
              <span className="hidden sm:inline-block text-slate-500">Tekan Esc atau klik latar luar untuk keluar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Component for code block with copy button
const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-3 border border-[var(--color-border)] bg-[var(--color-navy)] text-slate-100 rounded-sm shadow-xs overflow-hidden">
      <div className="bg-[var(--color-navy-light)] text-slate-300 text-[11px] px-3.5 py-1.5 font-mono uppercase tracking-wider border-b border-slate-700/50 flex justify-between items-center">
        <span>{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10.5px] cursor-pointer"
          title="Salin kode"
        >
          <i className={`fas ${copied ? 'fa-check text-emerald-400' : 'fa-copy text-[var(--color-gold)]'}`} />
          <span>{copied ? 'Tersalin' : 'Salin'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[13px] font-mono leading-relaxed bg-[#0b1c30]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Helper to parse inline tokens: bold (**), italic (*), strikethrough (~~), inline code (`), citations (【...】), html linebreaks (<br>), images (![...](...)), and links
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  const inlineRegex = /(<br\s*\/?>|`[^`]+`|!\[[^\]]*\]\([^)]+\)|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|【[^】]+】|\[[^\]]+\]\([^)]+\))/gi;

  const parts = text.split(inlineRegex);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) return;

    if (/^<br\s*\/?>$/i.test(part)) {
      elements.push(<br key={`br-${index}`} className="my-0.5" />);
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      elements.push(
        <code
          key={index}
          className="bg-[var(--color-surface-2)] text-[var(--color-navy)] px-1.5 py-0.5 rounded-xs font-mono text-[12px] border border-[var(--color-border)] mx-0.5 inline-block font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
      const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        const [, alt, src] = imgMatch;
        elements.push(<ChatImage key={`img-${index}`} src={src} alt={alt} />);
      } else {
        elements.push(part);
      }
    } else if (
      (part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
      (part.startsWith('___') && part.endsWith('___') && part.length >= 6)
    ) {
      elements.push(
        <strong key={index} className="font-semibold italic text-[var(--color-ink)]">
          {parseInline(part.slice(3, -3))}
        </strong>
      );
    } else if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      elements.push(
        <strong key={index} className="font-semibold text-[var(--color-ink)]">
          {parseInline(part.slice(2, -2))}
        </strong>
      );
    } else if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      elements.push(
        <em key={index} className="italic">
          {parseInline(part.slice(1, -1))}
        </em>
      );
    } else if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      elements.push(
        <del key={index} className="line-through opacity-70">
          {parseInline(part.slice(2, -2))}
        </del>
      );
    } else if (part.startsWith('【') && part.endsWith('】')) {
      const citationText = part.slice(1, -1);
      elements.push(
        <span
          key={index}
          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 mx-1 my-0.5 bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200/80 rounded-xs"
          title={citationText}
        >
          <i className="fas fa-bookmark text-[9px] mr-1.5 text-[var(--color-gold)]"></i>
          {citationText}
        </span>
      );
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, rawUrl] = match;
        const trimmedUrl = (rawUrl || '').trim();
        // Prevent javascript:, data:, vbscript: and other malicious schemes (XSS protection)
        const isSafeUrl = /^(https?:\/\/|\/|mailto:)/i.test(trimmedUrl) && !/^javascript:/i.test(trimmedUrl);
        const safeHref = isSafeUrl ? trimmedUrl : '#';

        elements.push(
          <a
            key={index}
            href={safeHref}
            target={isSafeUrl && !trimmedUrl.startsWith('/') ? "_blank" : undefined}
            rel={isSafeUrl ? "noopener noreferrer" : undefined}
            className="text-[var(--color-navy)] underline font-medium hover:text-[var(--color-gold)] transition-colors inline-flex items-center gap-1"
          >
            {linkText}
            {isSafeUrl && !trimmedUrl.startsWith('/') && (
              <i className="fas fa-external-link-alt text-[9px]"></i>
            )}
          </a>
        );
      } else {
        elements.push(part);
      }
    } else {
      elements.push(part);
    }
  });

  return elements;
}

// Helper to parse table rows
function parseTableRow(rowStr: string): string[] {
  let trimmed = rowStr.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map(cell => cell.trim());
}

// Helper to parse table alignments
function parseTableAlignments(dividerStr: string): ('left' | 'center' | 'right')[] {
  const cells = parseTableRow(dividerStr);
  return cells.map(cell => {
    const hasLeft = cell.startsWith(':');
    const hasRight = cell.endsWith(':');
    if (hasLeft && hasRight) return 'center';
    if (hasRight) return 'right';
    return 'left';
  });
}

function isTableDivider(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(\s*:?-{2,}:?\s*\|?)+$/.test(trimmed);
}

export const MarkdownRenderer = React.memo<MarkdownRendererProps>(({
  content,
  className = '',
}) => {
  if (!content) return null;

  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 leading-relaxed font-normal text-[var(--color-ink)] min-w-0 break-words ${className}`}>
      {blocks.map((block, blockIndex) => {
        if (!block) return null;

        if (block.startsWith('```') && block.endsWith('```')) {
          const match = block.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : block.slice(3, -3);

          return <CodeBlock key={blockIndex} code={code} lang={lang} />;
        }

        const lines = block.split('\n');
        const renderedElements: React.ReactNode[] = [];
        let currentListItems: React.ReactNode[] = [];
        let isOrderedList = false;

        const flushList = () => {
          if (currentListItems.length > 0) {
            const listKey = `list-${renderedElements.length}`;
            if (isOrderedList) {
              renderedElements.push(
                <ol key={listKey} className="list-decimal pl-5 space-y-1.5 my-2 font-normal">
                  {currentListItems}
                </ol>
              );
            } else {
              renderedElements.push(
                <ul key={listKey} className="space-y-2 my-2 font-normal">
                  {currentListItems}
                </ul>
              );
            }
            currentListItems = [];
            isOrderedList = false;
          }
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          if (!trimmed) {
            flushList();
            continue;
          }

          if (
            trimmed.includes('|') &&
            i + 1 < lines.length &&
            isTableDivider(lines[i + 1])
          ) {
            flushList();
            const headerRow = parseTableRow(trimmed);
            const alignments = parseTableAlignments(lines[i + 1]);
            const bodyRows: string[][] = [];

            i += 2;
            while (i < lines.length && lines[i].trim().includes('|')) {
              bodyRows.push(parseTableRow(lines[i]));
              i++;
            }
            i--;

            renderedElements.push(
              <div key={`table-${i}`} className="my-3 overflow-x-auto rounded border border-[var(--color-border)] shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-[var(--color-surface)] text-[var(--color-navy)] font-semibold border-b border-[var(--color-border)]">
                    <tr>
                      {headerRow.map((cell, cIdx) => (
                        <th
                          key={cIdx}
                          style={{ textAlign: alignments[cIdx] || 'left' }}
                          className="px-3 py-2 border-r last:border-r-0 border-[var(--color-border)]"
                        >
                          {parseInline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] bg-white">
                    {bodyRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            style={{ textAlign: alignments[cIdx] || 'left' }}
                            className="px-3 py-2 border-r last:border-r-0 border-[var(--color-border)] text-[var(--color-ink)]"
                          >
                            {parseInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            continue;
          }

          const unorderedMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
          if (unorderedMatch) {
            if (isOrderedList && currentListItems.length > 0) {
              flushList();
            }
            isOrderedList = false;
            const itemContent = unorderedMatch[3];
            currentListItems.push(
              <li key={`ul-item-${i}`} className="flex items-start gap-2.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-2 shrink-0"></span>
                <span className="flex-1 leading-relaxed">{parseInline(itemContent)}</span>
              </li>
            );
            continue;
          }

          const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
          if (orderedMatch) {
            if (!isOrderedList && currentListItems.length > 0) {
              flushList();
            }
            isOrderedList = true;
            const itemContent = orderedMatch[3];
            currentListItems.push(
              <li key={`ol-item-${i}`} className="pl-1 leading-relaxed">
                {parseInline(itemContent)}
              </li>
            );
            continue;
          }

          flushList();

          if (line.startsWith('### ')) {
            renderedElements.push(
              <h3 key={i} className="text-[15px] font-semibold text-[var(--color-navy)] mt-3 mb-1 font-display">
                {parseInline(line.slice(4))}
              </h3>
            );
          } else if (line.startsWith('## ')) {
            renderedElements.push(
              <h2 key={i} className="text-[17px] font-semibold text-[var(--color-navy)] mt-4 mb-1.5 border-b border-[var(--color-border)] pb-1 font-display">
                {parseInline(line.slice(3))}
              </h2>
            );
          } else if (line.startsWith('# ')) {
            renderedElements.push(
              <h1 key={i} className="text-xl font-bold text-[var(--color-navy)] mt-4 mb-2 border-b border-[var(--color-border)] pb-1 font-display">
                {parseInline(line.slice(2))}
              </h1>
            );
          } else if (line.startsWith('> ')) {
            renderedElements.push(
              <blockquote
                key={i}
                className="border-l-2 border-[var(--color-gold)] pl-3.5 py-1.5 my-2 italic bg-[var(--color-surface)] text-[var(--color-ink-muted)] rounded-r-xs"
              >
                {parseInline(line.slice(2))}
              </blockquote>
            );
          } else {
            const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
            if (imgMatch) {
              const [, alt, src] = imgMatch;
              renderedElements.push(
                <div key={i} className="my-2 min-w-0">
                  <ChatImage src={src} alt={alt} />
                </div>
              );
            } else if (/!\[[^\]]*\]\([^)]+\)/.test(line)) {
              renderedElements.push(
                <div key={i} className="leading-relaxed">
                  {parseInline(line)}
                </div>
              );
            } else {
              renderedElements.push(
                <p key={i} className="leading-relaxed">
                  {parseInline(line)}
                </p>
              );
            }
          }
        }

        flushList();

        return <React.Fragment key={blockIndex}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';
