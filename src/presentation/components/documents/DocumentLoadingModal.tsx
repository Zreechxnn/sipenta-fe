'use client';

import React from 'react';

interface DocumentLoadingModalProps {
  isOpen: boolean;
  docTitle?: string;
  onCancel?: () => void;
}

export const DocumentLoadingModal: React.FC<DocumentLoadingModalProps> = ({
  isOpen,
  docTitle,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] rounded-sm shadow-2xl relative animate-scale-up p-6 text-center z-10 flex flex-col items-center">
        {/* Animated Icon with Pulsing Radar Rings */}
        <div className="relative mb-5 mt-2">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center relative z-10 border border-[var(--color-border)] shadow-xs">
            <i className="fas fa-file-pdf text-2xl text-[var(--color-navy)] animate-pulse" />
          </div>
          <span className="absolute inset-0 rounded-full bg-[var(--color-gold)]/30 animate-ping opacity-75" />
          <span className="absolute -inset-2 rounded-full border border-[var(--color-gold)]/40 animate-pulse-sync" />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl mb-1.5" style={{ color: 'var(--color-navy)' }}>
          File Sedang Diproses
        </h3>

        {/* Context / Document Name */}
        {docTitle && (
          <p className="text-[13px] font-medium text-[var(--color-ink)] line-clamp-2 mb-2 px-2 bg-[var(--color-surface-2)] py-1.5 rounded-xs border border-[var(--color-border)] w-full">
            {docTitle}
          </p>
        )}

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)] mb-5 max-w-xs">
          Mengambil dan memvalidasi berkas laporan dari server. Pratinjau akan terbuka otomatis sesaat lagi.
        </p>

        {/* Progress Indeterminate Bar */}
        <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden mb-5 border border-[var(--color-border)]/60">
          <div className="h-full bg-[var(--color-navy)] rounded-full animate-[shimmer_1.5s_infinite_linear] skeleton-shimmer w-full" />
        </div>

        {/* Action Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-error)] transition-colors py-1 px-3 rounded-xs cursor-pointer hover:bg-[var(--color-surface-2)]"
          >
            Batal Memuat
          </button>
        )}
      </div>
    </div>
  );
};
