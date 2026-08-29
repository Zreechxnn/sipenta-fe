'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

interface RegisterFormProps {
  showToast: (msg: string, isError?: boolean) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ showToast }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register({
        fullName,
        username,
        email,
        password,
      });
      if (result.token || result.sukses !== false) {
        showToast('Pendaftaran akun berhasil!');
        const savedRole = localStorage.getItem('role');
        const isAdmin = savedRole && ['admin', 'kasubag', 'super-admin'].includes(savedRole.toLowerCase());
        setTimeout(() => {
          router.push(isAdmin ? '/dokumen' : '/chat');
        }, 600);
      } else {
        showToast(result.message || 'Registrasi gagal', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regFullName">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="regFullName"
          placeholder="Contoh: Budi Santoso"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regUsername">
          Username <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="text"
          id="regUsername"
          required
          placeholder="Ketik username..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regEmail">
          Email <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="email"
          id="regEmail"
          required
          placeholder="nama@instansi.go.id"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regPassword">
          Kata Sandi <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="password"
          id="regPassword"
          required
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-sm text-white text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center cursor-pointer mt-3"
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
            <span>Mendaftarkan Akun...</span>
          </span>
        ) : (
          'Daftar Akun Baru'
        )}
      </button>

      <div className="relative my-5 flex items-center justify-center">
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
                  showToast('Pendaftaran dengan Google berhasil!');
                  const savedRole = localStorage.getItem('role');
                  const isAdmin = savedRole && ['admin', 'kasubag', 'super-admin'].includes(savedRole.toLowerCase());
                  setTimeout(() => {
                    router.push(isAdmin ? '/dokumen' : '/chat');
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
        Sudah memiliki akun terdaftar?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--color-navy)] hover:underline ml-1"
        >
          Masuk di sini
        </Link>
      </div>
    </form>
  );
};
