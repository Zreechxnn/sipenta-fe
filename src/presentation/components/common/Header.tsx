'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { NotificationBell } from '@/presentation/components/common/NotificationBell';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  isLiveSyncing?: boolean;
}

interface NavItemConfig {
  href: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
  roleSpecific?: string;
}

const NAV_ITEMS: NavItemConfig[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'fa-chart-pie', adminOnly: true },
  { href: '/dokumen', label: 'Laporan Kerja', icon: 'fa-file-alt' },
  { href: '/users', label: 'Pengguna', icon: 'fa-users', adminOnly: true },
  { href: '/admin/konfigurasi', label: 'Konfigurasi', icon: 'fa-sliders', roleSpecific: 'admin' },
  { href: '/chat', label: 'Chat AI', icon: 'fa-comments' },
  { href: '/profile', label: 'Profil', icon: 'fa-id-card' },
];

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, isLiveSyncing = true }) => {
  const pathname = usePathname();
  const { token, isAdmin, role, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const [sliderStyle, setSliderStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const navRef = useRef<HTMLElement>(null);
  const availableNavItems = useMemo(
    () => NAV_ITEMS.filter(item => {
      if (item.roleSpecific) return role === item.roleSpecific;
      if (item.adminOnly) return isAdmin;
      return true;
    }),
    [isAdmin, role]
  );

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const currentTargetHref = hoveredHref || (availableNavItems.find(i => i.href === pathname)?.href || '');

  useEffect(() => {
    if (!token) return;

    const activeEl = itemRefs.current[currentTargetHref];
    if (activeEl && navRef.current) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1,
      });
    } else {
      const isAnyActive = availableNavItems.some(item => item.href === pathname);
      if (!isAnyActive && !hoveredHref) {
        setSliderStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }
  }, [currentTargetHref, pathname, availableNavItems, token]);

  useEffect(() => {
    const handleResize = () => {
      const activeEl = itemRefs.current[currentTargetHref];
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentTargetHref]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'apple-glass header-elevated border-b border-black/[0.06]'
          : 'bg-white/90 backdrop-blur-md border-b border-black/[0.05]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group select-none"
        >
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4.5 h-4.5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg tracking-wide leading-none" style={{ color: 'var(--color-navy)' }}>
                SIPENTA
              </span>
              {token && isLiveSyncing && (
                <span 
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-default"
                  title="Sistem terhubung realtime ke server (SignalR Aktif)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-sync" />
                  <span className="hidden lg:inline">Live</span>
                </span>
              )}
            </div>
            <span
              className="block text-[10px] tracking-widest uppercase font-sans mt-0.5 text-[var(--color-ink-faint)]"
              style={{ letterSpacing: '0.12em' }}
            >
              Laporan Tenaga Ahli
            </span>
          </div>
          {/* Gold rule accent */}
          <span
            className="hidden sm:block self-stretch w-px ml-1 transition-opacity duration-200 group-hover:opacity-100"
            style={{ backgroundColor: 'var(--color-gold)', opacity: 0.6 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {!token ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-medium rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-medium rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className="ml-1 px-5 py-2 text-xs font-medium rounded-full transition-all inline-flex items-center gap-2 shadow-xs hover:shadow-md hover:bg-[var(--color-navy-light)] active:scale-95"
                style={{ backgroundColor: 'var(--color-navy)', color: '#fff' }}
              >
                <i className="fas fa-comment-dots text-[10px] text-[var(--color-gold)]" />
                <span>Mulai Chat</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Segmented Sliding Navigation Track */}
              <nav
                ref={navRef}
                onMouseLeave={() => setHoveredHref(null)}
                className="relative flex items-center p-1 bg-black/[0.04] rounded-full border border-black/[0.06]"
              >
                {/* The Sliding Pill Indicator */}
                <div
                  className="absolute bg-[var(--color-navy)] rounded-full pointer-events-none shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    left: `${sliderStyle.left}px`,
                    top: `${sliderStyle.top}px`,
                    width: `${sliderStyle.width}px`,
                    height: `${sliderStyle.height}px`,
                    opacity: sliderStyle.opacity,
                  }}
                >
                  {/* Subtle Gold bottom highlight bar */}
                  <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[var(--color-gold)] rounded-full animate-fade-in" />
                </div>

                {/* Nav Links */}
                {availableNavItems.map(item => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredHref === item.href;
                  const isHighlighted = isHovered || (isActive && !hoveredHref);

                  return (
                    <Link
                      key={item.href}
                      ref={el => {
                        itemRefs.current[item.href] = el;
                      }}
                      href={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      className={`relative z-10 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                        isHighlighted
                          ? 'text-white'
                          : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      <i
                        className={`fas ${item.icon} text-[11px] transition-all duration-200 ${
                          isHighlighted
                            ? 'text-[var(--color-gold)] scale-110'
                            : 'text-[var(--color-ink-faint)]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="w-px h-5 mx-0.5 bg-black/[0.1]" />

              <NotificationBell />

              <div className="w-px h-5 mx-0.5 bg-black/[0.1]" />

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-[var(--color-error)] hover:bg-red-50/80 active:scale-95"
                title="Keluar dari akun"
              >
                <i className="fas fa-sign-out-alt text-[10px]" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile action bar (bell + hamburger when logged in, or login link for guests) */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
          {token ? (
            <>
              <NotificationBell />
              <button
                onClick={onToggleMobileSidebar}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all text-slate-700 hover:bg-black/[0.05] active:scale-95 border border-black/[0.06] bg-white shadow-2xs"
                aria-label="Buka menu navigasi"
              >
                <i className="fas fa-bars text-sm" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-semibold rounded-full text-[var(--color-navy)] bg-slate-100 hover:bg-slate-200 transition-all"
              >
                Masuk
              </Link>
              {onToggleMobileSidebar && (
                <button
                  onClick={onToggleMobileSidebar}
                  className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer transition-all text-slate-700 hover:bg-black/[0.05] active:scale-95"
                  aria-label="Buka menu navigasi"
                >
                  <i className="fas fa-bars text-sm" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
