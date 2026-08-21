'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Konfirmasi Penghapusan',
  message = 'Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.',
  itemName,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />
      
      {/* Modal */}
      <div className="w-full max-w-sm bg-white rounded-sm shadow-xl relative animate-scale-up border border-[var(--color-border)] overflow-hidden">
        {/* Header line */}
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--color-error)' }} />
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-error)', opacity: 0.1 }}>
              <i className="fas fa-exclamation-triangle text-lg" style={{ color: 'var(--color-error)', opacity: 1 }}></i>
            </div>
            <div>
              <h3 className="text-lg font-display mb-1" style={{ color: 'var(--color-ink)' }}>{title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {message}
              </p>
            </div>
          </div>

          {itemName && (
            <div className="mt-4 p-3 rounded-sm border flex items-start gap-2" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <i className="fas fa-file-alt mt-0.5 text-[11px]" style={{ color: 'var(--color-ink-faint)' }}></i>
              <span className="text-[13px] font-medium break-words leading-tight" style={{ color: 'var(--color-ink)' }}>{itemName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-sm text-sm font-medium transition-colors border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-2)] disabled:opacity-50"
            style={{ color: 'var(--color-ink)' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 rounded-sm text-sm font-medium text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-error)' }}
            onMouseEnter={e => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8a1d2e';
            }}
            onMouseLeave={e => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-error)';
            }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin text-[11px]"></i>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
