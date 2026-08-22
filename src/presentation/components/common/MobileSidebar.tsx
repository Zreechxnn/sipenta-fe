'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const NavItem = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all relative overflow-hidden active:scale-98 ${
          isActive
            ? 'bg-[var(--color-navy)] text-white shadow-xs'
            : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-gold)]" />
        )}
        <i className={`fas ${icon} w-5 text-center text-sm ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink-faint)]'}`} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer animate-backdrop"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-2xl animate-slide-left flex flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-5 flex justify-between items-center shrink-0 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[var(--color-navy)] flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-4 h-4 object-contain" />
            </div>
            <div>
              <span className="font-display text-lg tracking-wide block leading-none" style={{ color: 'var(--color-navy)' }}>
                SIPENTA
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[var(--color-ink-faint)]">
                Laporan Tenaga Ahli
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-white border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)] active:scale-95"
            aria-label="Tutup menu"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          <NavItem href="/dashboard" icon="fa-file-alt" label="Laporan Kerja" />
          {isAdmin && (
            <>
              <NavItem href="/admin/dashboard" icon="fa-chart-pie" label="Admin Dashboard" />
              <NavItem href="/users" icon="fa-users" label="Kelola Pengguna" />
            </>
          )}

          <NavItem href="/chat" icon="fa-comments" label="Asisten Analisis AI" />
          <NavItem href="/profile" icon="fa-id-card" label="Profil Saya" />

          <div className="h-px w-full my-3 bg-[var(--color-border)] opacity-60" />

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-left transition-all text-[var(--color-error)] hover:bg-red-50 active:scale-98 cursor-pointer"
          >
            <i className="fas fa-sign-out-alt w-5 text-center text-sm"></i>
            <span>Keluar dari Akun</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[var(--color-border)] bg-white text-center">
          <p className="text-[11px] text-[var(--color-ink-faint)] font-mono">
            SIPENTA AI Platform v2.0
          </p>
        </div>
      </div>
    </>
  );
};
