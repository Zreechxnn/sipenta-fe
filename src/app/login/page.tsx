'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/hooks/useToast';
import { LoginForm } from '@/presentation/components/auth/LoginForm';
import { Toast } from '@/presentation/components/common/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!isLoading && token) {
      const isExecutive = role && ['admin', 'kasubag'].includes(role.toLowerCase());
      router.push(isExecutive ? '/admin/dashboard' : '/dokumen');
    }
  }, [token, role, isLoading, router]);

  if (isLoading || token) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-navy)' }}>
        {/* Abstract shapes / gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[100px]" style={{ backgroundColor: 'var(--color-gold)' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[80px]" style={{ backgroundColor: '#1a3a5c' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide text-white">SIPENTA</span>
          </div>
          
          <div className="mt-auto max-w-sm">
            <h1 className="font-display text-4xl text-white leading-tight mb-4 animate-fade-up">
              Sistem Pelaporan<br/>
              <span className="text-white/70">Tenaga Ahli.</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed animate-fade-up stagger-1">
              Platform untuk menelusuri laporan kerja, mengevaluasi progres, dan menyusun ringkasan kinerja tenaga ahli.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-white/50 border-t border-white/10 pt-6 mt-12 animate-fade-up stagger-2">
            <span>&copy; 2026 Diskominfo</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Aman & Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-[var(--color-surface)] relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile branding */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide" style={{ color: 'var(--color-navy)' }}>SIPENTA</span>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-display mb-2" style={{ color: 'var(--color-navy)' }}>Selamat Datang</h3>
            <p className="text-[15px]" style={{ color: 'var(--color-ink-muted)' }}>Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-[var(--color-border)]">
            <Suspense fallback={<div className="text-sm text-center py-4" style={{ color: 'var(--color-ink-muted)' }}>Memuat form...</div>}>
              <LoginForm showToast={showToast} />
            </Suspense>
          </div>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
