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
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl relative animate-scale-up border border-slate-200 overflow-hidden">
        {/* Header line */}
        <div className="h-1.5 w-full bg-rose-500" />
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 bg-rose-50 text-rose-500 border border-rose-100 shadow-2xs">
              <i className="fas fa-exclamation-triangle text-lg"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {itemName && (
            <div className="mt-4 p-3 rounded-xl border border-slate-200 bg-slate-50/80 flex items-start gap-2.5">
              <i className="fas fa-file-alt mt-0.5 text-xs text-slate-400"></i>
              <span className="text-xs font-semibold break-words leading-tight text-slate-800">{itemName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 p-4 bg-slate-50/60 border-t border-slate-100 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm shadow-rose-600/20"
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
