'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { getCookie, setCookie, deleteCookie } from '@/presentation/utils/cookies';

const LOCKOUT_COOKIE_KEY = 'sipenta_lockout_until';

interface LoginFormProps {
  showToast: (msg: string, isError?: boolean) => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ showToast, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const lockoutUntilStr = getCookie(LOCKOUT_COOKIE_KEY);
    if (lockoutUntilStr) {
      const lockoutUntil = parseInt(lockoutUntilStr, 10);
      const now = Date.now();
      if (lockoutUntil > now) {
        const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
        setLockoutSeconds(remainingSec);
      } else {
        deleteCookie(LOCKOUT_COOKIE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      timerRef.current = setInterval(() => {
        setLockoutSeconds(prev => {
          if (prev <= 1) {
            deleteCookie(LOCKOUT_COOKIE_KEY);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockoutSeconds]);

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired' || reason === 'unauthorized') {
      showToast('Sesi Anda telah berakhir (JWT Expired). Silakan login kembali.', true);
    }
  }, [searchParams, showToast]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      showToast(`Akun dikunci sementara. Silakan tunggu ${formatTimer(lockoutSeconds)} lagi.`, true);
      return;
    }

    setLoading(true);

    try {
      const result = await login({ username, password });
      if (result.token || result.Token || result.user || result.User) {
        deleteCookie(LOCKOUT_COOKIE_KEY);
        setLockoutSeconds(0);
        setRemainingAttempts(null);
        showToast('Login berhasil!');
        
        const userRole = result.user?.role || result.User?.Role || 'user';
        const isExecutive = ['admin', 'kasubag'].includes(userRole.toLowerCase());
        setTimeout(() => {
          router.push(isExecutive ? '/admin/dashboard' : '/dokumen');
        }, 600);
      } else {
        if (result.isLockedOut) {
          const sec = result.retryAfterSeconds || 300;
          setLockoutSeconds(sec);
          setRemainingAttempts(0);
          setCookie(LOCKOUT_COOKIE_KEY, String(Date.now() + sec * 1000), 1);
          showToast(result.message || 'Batas percobaan login tercapai. Akun dikunci sementara 5 menit.', true);
        } else {
          if (typeof result.remainingAttempts === 'number') {
            setRemainingAttempts(result.remainingAttempts);
          }
          showToast(result.message || 'Login gagal', true);
        }
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  const isFormLocked = loading || lockoutSeconds > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Active Lockout Cooldown Banner */}
      {lockoutSeconds > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fadeIn shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5 shadow-2xs">
            <i className="fa-solid fa-shield-halved text-sm"></i>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-rose-900">Perlindungan Keamanan: Akun Dikunci Sementara</p>
            <p className="text-[11px] text-rose-700 leading-relaxed">
              Batas 5 kali kesalahan kata sandi tercapai. Sistem menerapkan jeda pendinginan demi mencegah serangan brute force dan DDoS.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-100/90 font-mono font-bold text-rose-900 text-xs mt-1">
              <i className="fa-regular fa-clock text-xs text-rose-600 animate-pulse"></i>
              <span>Sisa Waktu Jeda: {formatTimer(lockoutSeconds)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Remaining Attempts Warning Banner */}
      {lockoutSeconds === 0 && remainingAttempts !== null && remainingAttempts < 5 && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5 animate-shake shadow-xs">
          <i className="fa-solid fa-triangle-exclamation text-amber-600 text-sm shrink-0"></i>
          <span className="leading-snug">
            Kata sandi salah. Sisa kesempatan: <strong className="text-amber-800">{remainingAttempts} kali</strong> lagi sebelum akun terkunci selama 5 menit.
          </span>
        </div>
      )}

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="loginUsername">
          Username
        </label>
        <input
          type="text"
          id="loginUsername"
          required
          disabled={isFormLocked}
          placeholder="Ketik username Anda..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]" htmlFor="loginPassword">
            Kata Sandi
          </label>
          <button
            type="button"
            disabled={isFormLocked}
            onClick={() => setShowPassword(!showPassword)}
            className="text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-50"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          id="loginPassword"
          required
          disabled={isFormLocked}
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <button
        type="submit"
        disabled={isFormLocked}
        className="w-full py-3 rounded-sm text-white text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mt-2"
        style={{ backgroundColor: 'var(--color-navy)' }}
        onMouseEnter={e => {
          if (!isFormLocked) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
        }}
        onMouseLeave={e => {
          if (!isFormLocked) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
            <span>Memproses Autentikasi...</span>
          </span>
        ) : lockoutSeconds > 0 ? (
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-lock text-xs"></i>
            <span>Terkunci ({formatTimer(lockoutSeconds)})</span>
          </span>
        ) : (
          'Masuk ke Sistem'
        )}
      </button>

      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-[var(--color-border)] w-full"></div>
        <span className="bg-white px-3 absolute text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          atau
        </span>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              setLoading(true);
              try {
                const result = await googleLogin(credentialResponse.credential);
                if (result.token || result.Token || result.user || result.User) {
                  deleteCookie(LOCKOUT_COOKIE_KEY);
                  setLockoutSeconds(0);
                  setRemainingAttempts(null);
                  showToast('Login dengan Google berhasil!');
                  
                  const userRole = result.user?.role || result.User?.Role || 'user';
                  const isExecutive = ['admin', 'kasubag'].includes(userRole.toLowerCase());
                  setTimeout(() => {
                    router.push(isExecutive ? '/admin/dashboard' : '/dokumen');
                  }, 600);
                } else {
                  showToast(result.message || 'Login dengan Google gagal', true);
                }
              } catch {
                showToast('Terjadi kesalahan jaringan', true);
              } finally {
                setLoading(false);
              }
            }
          }}
          onError={() => {
            showToast('Login dengan Google gagal', true);
          }}
        />
      </div>

      <div className="text-center pt-4 border-t border-[var(--color-border)] text-[13px] text-[var(--color-ink-muted)]">
        Belum memiliki akun?{' '}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-[var(--color-navy)] hover:underline ml-1 cursor-pointer"
          >
            Daftar akun baru
          </button>
        ) : (
          <Link
            href="/register"
            className="font-medium text-[var(--color-navy)] hover:underline ml-1"
          >
            Daftar akun baru
          </Link>
        )}
      </div>
    </form>
  );
};
