'use client';

import React, { useState } from 'react';

import { getApiBaseUrl } from '@/infrastructure/api/apiClient';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const ChatImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);

  const rawSrc = (src || '').replace(/^url\s*=\s*/i, '').trim();
  let cleanSrc = rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`;
  if (cleanSrc.startsWith('/Documents/images/')) {
    cleanSrc = `/api${cleanSrc}`;
  }
  const baseUrl = getApiBaseUrl().replace(/\/api\/?$/, '');
  const fullUrl = rawSrc.startsWith('http')
    ? rawSrc
    : `${baseUrl}${cleanSrc}`;

  if (error || !rawSrc) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-100 text-slate-500 rounded border border-slate-200 my-1">
        <i className="fas fa-image text-slate-400 text-xs" />
        <span className="italic">{alt || 'Gambar lampiran tidak dapat dimuat'}</span>
      </span>
    );
  }

  return (
    <>
      <div className="my-2.5 max-w-sm rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-xs group">
        <div 
          onClick={() => setIsOpen(true)}
          className="relative cursor-zoom-in overflow-hidden bg-slate-100 min-h-[120px] max-h-60 flex items-center justify-center aspect-[16/10]"
        >
          <img
            src={fullUrl}
            alt={alt || 'Foto Dokumentasi'}
            onError={() => setError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
              <i className="fas fa-search-plus text-[10px]" /> Perbesar
            </span>
          </div>
        </div>
        {alt && (
          <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-600 font-medium truncate flex items-center gap-1.5">
            <i className="fas fa-image text-slate-400 text-[10px]" />
            <span>{alt}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold truncate">
                <i className="fas fa-camera text-amber-400" />
                <span>{alt || 'Foto Dokumentasi Laporan'}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img
                src={fullUrl}
                alt={alt || 'Foto Dokumentasi'}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
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
        const [, linkText, url] = match;
        elements.push(
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-navy)] underline font-medium hover:text-[var(--color-gold)] transition-colors inline-flex items-center gap-1"
          >
            {linkText}
            <i className="fas fa-external-link-alt text-[9px]"></i>
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
    <div className={`space-y-3 leading-relaxed font-normal text-[var(--color-ink)] ${className}`}>
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
                <div key={i} className="my-2">
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
