'use client';

import React from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  isError?: boolean;
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, message, isError = false, onDismiss }) => {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-sm p-4 animate-slide-up shadow-xl border backdrop-blur-xs flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: isError ? 'var(--color-error)' : 'var(--color-navy)',
        borderColor: isError ? '#7f1d2d' : '#1e3a5f',
        color: '#fff'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <i className={`fas ${isError ? 'fa-exclamation-circle text-amber-200' : 'fa-check-circle text-[var(--color-gold)]'} text-base`}></i>
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[13.5px] font-medium leading-snug">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white transition-colors text-xs p-1"
            title="Tutup pemberitahuan"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Subtle duration bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 overflow-hidden">
        <div 
          className="h-full bg-[var(--color-gold)] animate-[shrink_3s_linear_forwards]"
          style={{
            backgroundColor: isError ? '#fecaca' : 'var(--color-gold)',
            animationDuration: '3000ms',
          }}
        />
      </div>
    </div>
  );
};
