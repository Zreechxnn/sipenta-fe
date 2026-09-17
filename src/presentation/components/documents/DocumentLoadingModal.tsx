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
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl relative animate-scale-up p-6 text-center z-10 flex flex-col items-center">
        {/* Animated Icon with Pulsing Radar Rings */}
        <div className="relative mb-5 mt-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center relative z-10 border border-indigo-100 shadow-xs">
            <i className="fas fa-file-pdf text-2xl text-indigo-600 animate-pulse" />
          </div>
          <span className="absolute inset-0 rounded-2xl bg-indigo-500/20 animate-ping opacity-75" />
          <span className="absolute -inset-2 rounded-2xl border border-indigo-400/40 animate-pulse-sync" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 mb-1.5">
          Memproses Berkas Laporan
        </h3>

        {/* Context / Document Name */}
        {docTitle && (
          <p className="text-xs font-semibold text-slate-800 line-clamp-2 mb-2 px-3 bg-slate-50 py-2 rounded-xl border border-slate-200 w-full break-words">
            {docTitle}
          </p>
        )}

        <p className="text-xs leading-relaxed text-slate-500 mb-5 max-w-xs">
          Mengambil dan memvalidasi berkas laporan dari cloud storage. Pratinjau akan terbuka otomatis sesaat lagi.
        </p>

        {/* Progress Indeterminate Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-200/60">
          <div className="h-full bg-indigo-600 rounded-full animate-[shimmer_1.5s_infinite_linear] skeleton-shimmer w-full" />
        </div>

        {/* Action Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-500 hover:text-rose-600 transition-all py-1.5 px-3 rounded-xl cursor-pointer hover:bg-rose-50 active:scale-95"
          >
            Batal Memuat
          </button>
        )}
      </div>
    </div>
  );
};
