'use client';

import React, { useState, useEffect } from 'react';
import { DocumentChunk } from '@/core/domain/document';

interface ReadChunkModalProps {
  isOpen: boolean;
  chunkList: DocumentChunk[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSave: (content: string) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const ReadChunkModal: React.FC<ReadChunkModalProps> = ({
  isOpen,
  chunkList,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSave,
  showToast,
}) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chunkList.length > 0 && chunkList[currentIndex]) {
      const c = chunkList[currentIndex];
      setContent(c.content || c.Content || c.preview || c.Preview || c.teks || c.Teks || '');
    } else {
      setContent('');
    }
  }, [chunkList, currentIndex, isOpen]);

  // Keyboard navigation: Esc to close, Alt+Left / Alt+Right or Left/Right (when not editing) for chunk navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || saving) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.altKey && e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onPrev();
      } else if (e.altKey && e.key === 'ArrowRight' && currentIndex < chunkList.length - 1) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, saving, currentIndex, chunkList.length, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Gagal menyalin teks', true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await onSave(content);
      if (res.ok) {
        showToast('Segmen berhasil diperbarui.');
      } else {
        showToast(res.message || 'Gagal memperbarui segmen.', true);
      }
    } catch {
      showToast('Kesalahan jaringan', true);
    } finally {
      setSaving(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={() => !saving && onClose()}
      />
      
      <div className="w-full max-w-3xl bg-white border border-[var(--color-border)] rounded-sm shadow-xl relative animate-scale-up flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xs bg-[var(--color-navy)] flex items-center justify-center">
              <i className="fas fa-layer-group text-[var(--color-gold)] text-xs"></i>
            </div>
            <div>
              <h3 className="text-lg font-display" style={{ color: 'var(--color-navy)' }}>
                Tinjauan Segmen Dokumen (Chunk)
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>
                Navigasi cepat dengan <span className="font-mono bg-[var(--color-surface-2)] px-1 rounded">Alt+←</span> / <span className="font-mono bg-[var(--color-surface-2)] px-1 rounded">Alt+→</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 bg-white overflow-y-auto flex-1 flex flex-col">
          {/* Metadata bar */}
          <div className="flex items-center justify-between mb-3 text-[12px] text-[var(--color-ink-muted)]">
            <div className="flex items-center gap-3">
              <span>Panjang: <strong className="text-[var(--color-ink)] font-mono">{charCount}</strong> karakter</span>
              <span>•</span>
              <span><strong className="text-[var(--color-ink)] font-mono">{wordCount}</strong> kata</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-2)] text-[var(--color-ink)] text-[12px] transition-all cursor-pointer active:scale-95"
            >
              <i className={`fas ${copied ? 'fa-check text-emerald-600' : 'fa-copy text-[var(--color-gold)]'} text-xs`} />
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Konten segmen kosong..."
            className="w-full flex-1 border border-[var(--color-border)] p-4 sm:p-5 text-[13.5px] leading-relaxed font-mono min-h-[280px] sm:min-h-[360px] resize-y bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] rounded-sm transition-colors shadow-inner text-[var(--color-ink)]"
          />
          
          <div className="flex flex-wrap justify-between items-center gap-4 mt-5 pt-4 border-t border-[var(--color-border)]">
            {/* Prev / Counter / Next Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="w-9 h-9 border border-[var(--color-border)] bg-white rounded-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)] active:scale-95 text-[var(--color-ink)]"
                title="Segmen Sebelumnya (Alt+←)"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>

              <div className="px-4 h-9 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-sm flex items-center justify-center min-w-[84px] shadow-2xs">
                <span className="text-[12px] font-medium tracking-wide">
                  {chunkList.length > 0 ? (
                    <>
                      <span className="font-semibold" style={{ color: 'var(--color-navy)' }}>{currentIndex + 1}</span>
                      <span className="mx-1 text-[var(--color-ink-faint)]">/</span>
                      <span className="text-[var(--color-ink-muted)]">{chunkList.length}</span>
                    </>
                  ) : (
                    '0 / 0'
                  )}
                </span>
              </div>

              <button
                onClick={onNext}
                disabled={currentIndex >= chunkList.length - 1}
                className="w-9 h-9 border border-[var(--color-border)] bg-white rounded-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)] active:scale-95 text-[var(--color-ink)]"
                title="Segmen Berikutnya (Alt+→)"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 rounded-sm border border-[var(--color-border)] bg-white text-xs font-medium hover:bg-[var(--color-surface-2)] text-[var(--color-ink)] transition-colors"
              >
                Tutup
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 h-9 rounded-sm text-xs font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2 min-w-[130px] justify-center active:scale-95 shadow-xs"
                style={{ backgroundColor: 'var(--color-navy)' }}
                onMouseEnter={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
                }}
                onMouseLeave={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
                }}
              >
                {saving ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin text-[10px]"></i>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save text-[11px] text-[var(--color-gold)]"></i>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
