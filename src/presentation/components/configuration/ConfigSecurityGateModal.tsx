'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConfigSecurityGateModalProps {
  isOpen: boolean;
  onElevate: (password: string) => Promise<any>;
  onCancel?: () => void;
}

export const ConfigSecurityGateModal: React.FC<ConfigSecurityGateModalProps> = ({
  isOpen,
  onElevate,
  onCancel,
}) => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Harap masukkan kata sandi akun Anda.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await onElevate(password);
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Kata sandi konfirmasi salah. Akses ditolak.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/dokumen');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 sm:p-8 w-full max-w-md animate-scale-up">
        
        {/* Security Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl mx-auto mb-4 shadow-xs">
          <i className="fa-solid fa-shield-halved"></i>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 text-center">
          Otorisasi Keamanan (Sudo Mode)
        </h3>
        
        <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
          Area konfigurasi infrastruktur sistem SIAP dilindungi. Masukkan kata sandi akun admin Anda untuk membuka hak akses pengaturan kritis.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2 animate-shake shadow-xs">
            <i className="fa-solid fa-circle-exclamation shrink-0 text-rose-500"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Sandi Konfirmasi <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi login Anda"
                className="w-full text-xs font-medium px-4 py-3 pr-10 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Sesi Sudo Mode akan tetap aktif selama 15 menit.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Memverifikasi...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-unlock-keyhole"></i>
                  Buka Konfigurasi
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10.5px] text-slate-400">
          <i className="fa-solid fa-lock text-emerald-600"></i>
          <span>Data tersimpan dengan enkripsi AES-256-GCM.</span>
        </div>

      </div>
    </div>
  );
};
