'use client';

import React, { useState } from 'react';
import { useDeviceNotification } from '@/presentation/hooks/useDeviceNotification';

interface NotificationBellProps {
  onFeedback?: (message: string, isError?: boolean) => void;
  className?: string;
  showLabel?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onFeedback,
  className = '',
  showLabel = false,
}) => {
  const { isSupported, isEnabled, permission, isLoading, toggle } = useDeviceNotification();
  const [isHovered, setIsHovered] = useState(false);

  if (!isSupported) return null;

  const handleToggle = async () => {
    const res = await toggle();
    if (onFeedback) {
      onFeedback(res.message, !res.success && !res.isEnabled);
    }
  };

  const getTooltipText = () => {
    if (isLoading) return 'Memproses izin...';
    if (isEnabled) return 'Notifikasi Perangkat: Aktif (Klik untuk nonaktifkan)';
    if (permission === 'denied') return 'Izin Notifikasi Diblokir di Browser (Klik untuk info)';
    return 'Aktifkan Notifikasi Langsung di Perangkat (Cookie)';
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={getTooltipText()}
        title={getTooltipText()}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 ${
          isEnabled
            ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/80 shadow-2xs'
            : 'bg-black/[0.04] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.08] border border-black/[0.05]'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <i
            className={`fa-solid ${
              isLoading
                ? 'fa-circle-notch fa-spin text-xs'
                : isEnabled
                ? 'fa-bell text-xs text-indigo-600 animate-wiggle'
                : 'fa-bell-slash text-xs text-slate-400'
            }`}
          />
          {isEnabled && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-white"></span>
            </span>
          )}
        </div>

        {showLabel && (
          <span className="text-xs font-semibold">
            {isEnabled ? 'Notifikasi Aktif' : 'Notifikasi Mati'}
          </span>
        )}
      </button>

      {/* Floating Mini Tooltip on Hover */}
      {isHovered && !showLabel && (
        <div className="absolute top-full right-0 mt-2 z-50 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-xl pointer-events-none animate-fadeIn border border-slate-700">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isEnabled ? 'bg-emerald-400' : 'bg-slate-400'
              }`}
            />
            <span>{getTooltipText()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
