'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, isAdmin, role, bidang, logout } = useAuth();

  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Reset drag offset when isOpen changes
  useEffect(() => {
    if (!isOpen) {
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Touch Drag-to-Slide Handlers (Real-time gesture slider X)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    isHorizontalSwipeRef.current = null;
    setIsDragging(false);
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // Detect if this is horizontal swipe
    if (isHorizontalSwipeRef.current === null) {
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        isHorizontalSwipeRef.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (isHorizontalSwipeRef.current) {
      // Only drag to the left (negative deltaX)
      if (deltaX < 0) {
        setIsDragging(true);
        setDragOffset(deltaX);
      } else {
        setDragOffset(0);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      // If dragged more than 70px to the left, close the drawer
      if (dragOffset < -70) {
        onClose();
      }
      setDragOffset(0);
      setIsDragging(false);
    }
    isHorizontalSwipeRef.current = null;
  }, [isDragging, dragOffset, onClose]);

  const roleDisplay = role === 'super-admin'
    ? 'Super Admin'
    : role === 'kasubag'
    ? 'Kasubag'
    : role === 'admin'
    ? 'Admin'
    : 'Tenaga Ahli';

  const NavItem = ({ href, icon, label, index }: { href: string; icon: string; label: string; index: number }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        style={{
          transitionDelay: isOpen ? `${60 + index * 35}ms` : '0ms',
        }}
        className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-300 relative overflow-hidden active:scale-[0.97] cursor-pointer ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
        } ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
            : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-100/80 active:bg-slate-200/70'
        }`}
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 transition-all ${
          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-indigo-600'
        }`}>
          <i className={`fas ${icon}`} />
        </div>
        <span className="flex-1 truncate tracking-wide">{label}</span>
        {isActive ? (
          <i className="fas fa-chevron-right text-[10px] text-white/80 animate-pulse" />
        ) : (
          <i className="fas fa-chevron-right text-[9px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </Link>
    );
  };

  // Compute transform style
  const drawerTransform = isOpen
    ? isDragging
      ? `translateX(${dragOffset}px)`
      : 'translateX(0%)'
    : 'translateX(-105%)';

  const backdropOpacity = isOpen
    ? isDragging
      ? Math.max(0.2, 1 + dragOffset / 300)
      : 1
    : 0;

  return (
    <div
      className={`fixed inset-0 z-50 select-none ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        visibility: isOpen || isDragging ? 'visible' : 'hidden',
        transition: 'visibility 0.4s ease',
      }}
      aria-hidden={!isOpen}
    >
      {/* Backdrop with fluid opacity transition */}
      <div
        onClick={onClose}
        style={{
          opacity: backdropOpacity,
          transition: isDragging ? 'none' : 'opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer will-change-[opacity]"
      />

      {/* Drawer Panel Slider X */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: drawerTransform,
          transition: isDragging
            ? 'none'
            : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
        }}
        className="fixed top-0 left-0 bottom-0 z-10 w-[84%] max-w-[320px] bg-white shadow-2xl flex flex-col overflow-hidden border-r border-slate-200/80 rounded-r-3xl"
      >
        {/* Visual Grab / Swipe Handle Indicator on edge */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-slate-200 pointer-events-none opacity-60" />

        {/* Header Branding & Close Button */}
        <div className="p-4.5 flex justify-between items-center shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/25 text-white">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <span className="font-display text-base font-bold tracking-wide block leading-tight text-slate-900">
                SIPENTA
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                Diskominfo Jabar
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all text-slate-400 hover:text-slate-700 active:scale-90 cursor-pointer shadow-2xs"
            aria-label="Tutup menu"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        {/* User Profile Card */}
        {user && (
          <div className="p-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-xs text-slate-900 truncate leading-snug">
                  {user.fullName || user.username}
                </p>
                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                  <span className="inline-block px-2 py-0.5 rounded-md text-[9.5px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80">
                    {roleDisplay}
                  </span>
                  {bidang && (
                    <span className="inline-block px-2 py-0.5 rounded-md text-[9.5px] font-semibold text-slate-600 bg-slate-200/70 truncate max-w-[120px]">
                      {bidang}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items with Stagger Animation */}
        <nav className="p-3.5 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          {isAdmin && (
            <NavItem index={0} href="/admin/dashboard" icon="fa-chart-pie" label={role === 'kasubag' ? 'Dashboard Kasubag' : 'Admin Dashboard'} />
          )}
          <NavItem index={1} href="/dokumen" icon="fa-file-alt" label="Laporan Kerja" />
          {isAdmin && (
            <NavItem index={2} href="/users" icon="fa-users" label="Kelola Pengguna" />
          )}

          <NavItem index={3} href="/chat" icon="fa-comments" label="Asisten Analisis AI" />
          <NavItem index={4} href="/profile" icon="fa-id-card" label="Profil Saya" />

          <div className="h-px w-full my-2 bg-slate-100" />

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold text-left transition-all text-rose-600 hover:bg-rose-50 active:scale-[0.97] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xs shrink-0">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <span className="flex-1 font-bold">Keluar dari Akun</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 text-center shrink-0">
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">
            SIPENTA AI Platform &bull; v2.0
          </p>
        </div>
      </div>
    </div>
  );
};
