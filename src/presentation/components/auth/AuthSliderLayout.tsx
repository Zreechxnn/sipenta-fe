'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/hooks/useToast';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Toast } from '@/presentation/components/common/Toast';

interface AuthSliderLayoutProps {
  initialMode: 'login' | 'register';
}

export const AuthSliderLayout: React.FC<AuthSliderLayoutProps> = ({ initialMode }) => {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { toast, showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Sync mode with props
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const isReg = window.location.pathname.includes('register');
        setMode(isReg ? 'register' : 'login');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && token) {
      const isExecutive = role && ['admin', 'kepala bagian', 'kasubag'].includes(role.toLowerCase());
      router.push(isExecutive ? '/admin/dashboard' : '/dokumen');
    }
  }, [token, role, isLoading, router]);

  if (isLoading || token) return null;

  const handleSwitchToRegister = () => {
    setMode('register');
    if (typeof window !== 'undefined' && !window.location.pathname.includes('register')) {
      window.history.pushState(null, '', '/register');
    }
  };

  const handleSwitchToLogin = () => {
    setMode('login');
    if (typeof window !== 'undefined' && !window.location.pathname.includes('login')) {
      window.history.pushState(null, '', '/login');
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="relative w-full min-h-screen bg-slate-50 overflow-hidden select-none sm:select-auto">
      
      {/* ─── DESKTOP SLIDING BRANDING PANEL ─── */}
      <div
        className={`hidden md:flex absolute top-0 bottom-0 left-0 z-20 w-1/2 p-12 lg:p-20 flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isLogin ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--color-navy)' }}
      >
        {/* Ambient Glowing Orbs */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[100px] transition-all duration-700 pointer-events-none"
          style={{ backgroundColor: 'var(--color-gold)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[80px] pointer-events-none"
          style={{ backgroundColor: '#1a3a5c' }}
        />

        {/* Top Branding Section */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="font-display text-2xl tracking-wide text-white block leading-tight">SIPENTA</span>
              <span className="text-[10px] tracking-widest uppercase font-sans text-white/60">Diskominfo</span>
            </div>
          </div>

          {/* Quick Slider Pill Indicator */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/80">
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                isLogin ? 'bg-white text-[var(--color-navy)] font-bold shadow-xs' : 'hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer ${
                !isLogin ? 'bg-white text-[var(--color-navy)] font-bold shadow-xs' : 'hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>
        </div>

        {/* Middle Tagline Section with Smooth Text Cross-fade */}
        <div className="relative z-10 my-auto max-w-md">
          {isLogin ? (
            <div className="space-y-4 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white border border-white/15">
                <i className="fa-solid fa-shield-halved text-[var(--color-gold-light)]"></i>
                Portal Akses Terpadu
              </span>
              <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight">
                Sistem Pelaporan<br />
                <span className="text-white/70">Tenaga Ahli.</span>
              </h1>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                Platform cerdas bertenaga AI untuk menelusuri laporan kerja, mengevaluasi progres, dan menyusun ringkasan kinerja tenaga ahli secara terstruktur.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSwitchToRegister}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <span>Belum Punya Akun? Daftar</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white border border-white/15">
                <i className="fa-solid fa-user-plus text-[var(--color-gold-light)]"></i>
                Registrasi Akun Baru
              </span>
              <h1 className="font-display text-4xl lg:text-5xl text-white leading-tight">
                Bergabung Bersama<br />
                <span className="text-white/70">SIPENTA.</span>
              </h1>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed">
                Daftarkan akun tenaga ahli Anda untuk mulai mengunggah laporan bulanan, berbagi dokumen, serta berkolaborasi dengan asisten AI Diskominfo.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                >
                  <i className="fa-solid fa-arrow-left text-[10px]"></i>
                  <span>Sudah Ada Akun? Masuk</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center gap-4 text-xs text-white/50 border-t border-white/10 pt-6">
          <span>&copy; 2026 Dinas Komunikasi dan Informatika</span>
          <span className="w-1 h-1 rounded-full bg-white/25" />
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-lock text-[10px] text-emerald-400"></i>
            Enkripsi AES-256
          </span>
        </div>
      </div>

      {/* ─── DESKTOP FORM 1: LOGIN (Right half: left-1/2) ─── */}
      <div
        className={`hidden md:flex absolute top-0 bottom-0 right-0 w-1/2 flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLogin
            ? 'opacity-100 translate-x-0 pointer-events-auto z-10'
            : 'opacity-0 translate-x-12 pointer-events-none z-0'
        }`}
      >
        <div className="w-full max-w-[420px]">
          <div className="mb-6">
            <h2 className="text-3xl font-display mb-1.5" style={{ color: 'var(--color-navy)' }}>
              Selamat Datang
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Silakan masuk ke akun Anda untuk mengakses sistem pelaporan.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <Suspense fallback={<div className="text-sm text-center py-4 text-slate-400">Memuat formulir...</div>}>
              <LoginForm showToast={showToast} onSwitchToRegister={handleSwitchToRegister} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ─── DESKTOP FORM 2: REGISTER (Left half: left-0) ─── */}
      <div
        className={`hidden md:flex absolute top-0 bottom-0 left-0 w-1/2 flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          !isLogin
            ? 'opacity-100 translate-x-0 pointer-events-auto z-10'
            : 'opacity-0 -translate-x-12 pointer-events-none z-0'
        }`}
      >
        <div className="w-full max-w-[420px]">
          <div className="mb-6">
            <h2 className="text-3xl font-display mb-1.5" style={{ color: 'var(--color-navy)' }}>
              Daftar Akun Baru
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Lengkapi data berikut untuk mengajukan pendaftaran akun tenaga ahli.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80">
            <RegisterForm showToast={showToast} onSwitchToLogin={handleSwitchToLogin} />
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW (< md) ─── */}
      <div className="flex md:hidden flex-col min-h-screen px-4 py-8 justify-center">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Mobile Brand */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
                <img src="/sipenta.svg" alt="SIPENTA" className="w-5 h-5 object-contain" />
              </div>
              <span className="font-display text-xl tracking-wide" style={{ color: 'var(--color-navy)' }}>
                SIPENTA
              </span>
            </div>

            {/* Mobile Mode Switcher Pill */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200/80 text-xs font-bold">
              <button
                type="button"
                onClick={handleSwitchToLogin}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isLogin ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={handleSwitchToRegister}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isLogin ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                Daftar
              </button>
            </div>
          </div>

          {/* Form Card with Smooth Fade/Scale Transition */}
          <div key={mode} className="animate-scale-up">
            <div className="mb-4">
              <h2 className="text-2xl font-display font-bold text-slate-900 mb-1">
                {isLogin ? 'Selamat Datang' : 'Daftar Akun'}
              </h2>
              <p className="text-xs text-slate-500">
                {isLogin ? 'Masuk ke akun pelaporan Anda.' : 'Buat akun tenaga ahli baru.'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
              {isLogin ? (
                <Suspense fallback={<div className="text-sm text-center py-4 text-slate-400">Memuat formulir...</div>}>
                  <LoginForm showToast={showToast} onSwitchToRegister={handleSwitchToRegister} />
                </Suspense>
              ) : (
                <RegisterForm showToast={showToast} onSwitchToLogin={handleSwitchToLogin} />
              )}
            </div>
          </div>

          <div className="text-center mt-6 text-[11px] text-slate-400">
            &copy; 2026 Diskominfo &bull; Terenkripsi Aman
          </div>

        </div>
      </div>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
};
