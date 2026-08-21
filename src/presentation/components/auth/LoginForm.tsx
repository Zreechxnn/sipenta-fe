'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  showToast: (msg: string, isError?: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired' || reason === 'unauthorized') {
      showToast('Sesi Anda telah berakhir (JWT Expired). Silakan login kembali.', true);
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ username, password });
      if (result.token) {
        showToast('Login berhasil!');
        const savedRole = localStorage.getItem('role');
        const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
        setTimeout(() => {
          router.push(isAdmin ? '/dashboard' : '/chat');
        }, 600);
      } else {
        showToast(result.message || 'Login gagal', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="loginUsername">
          Username
        </label>
        <input
          type="text"
          id="loginUsername"
          required
          placeholder="Ketik username Anda..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]" htmlFor="loginPassword">
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          id="loginPassword"
          required
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-sm text-white text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
        style={{ backgroundColor: 'var(--color-navy)' }}
        onMouseEnter={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
        }}
        onMouseLeave={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
            <span>Memproses Autentikasi...</span>
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
                if (result.token) {
                  showToast('Login dengan Google berhasil!');
                  const savedRole = localStorage.getItem('role');
                  const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
                  setTimeout(() => {
                    router.push(isAdmin ? '/dashboard' : '/chat');
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
        <Link
          href="/register"
          className="font-medium text-[var(--color-navy)] hover:underline ml-1"
        >
          Daftar akun baru
        </Link>
      </div>
    </form>
  );
};
