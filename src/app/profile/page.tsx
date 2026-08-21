'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useProfile } from '@/presentation/hooks/useProfile';
import { useToast } from '@/presentation/hooks/useToast';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { formatDate } from '@/presentation/utils/formatters';

export default function ProfilePage() {
  const { isLoading: authLoading } = useAuth(true, false);
  const { profile, loading, saving, fetchProfile, updateProfile } = useProfile();
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUserChange = useCallback((event: string) => {
    if (event === 'UserUpdated' || event === 'UserCreated') {
      fetchProfile();
    }
  }, [fetchProfile]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, handleUserChange);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setUsername(profile.username || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  if (authLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showPasswordChange && newPassword) {
      if (!currentPassword) {
        showToast('Masukkan password saat ini untuk mengganti password', true);
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Konfirmasi password baru tidak cocok', true);
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password baru minimal 6 karakter', true);
        return;
      }
    }

    const payload: {
      fullName: string;
      username: string;
      email: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      fullName,
      username,
      email,
    };

    if (showPasswordChange && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const result = await updateProfile(payload);
    if (result.ok) {
      showToast('Profil berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } else {
      showToast(result.message || 'Gagal memperbarui profil', true);
    }
  };

  const getInitials = (name?: string | null, fallbackUsername?: string) => {
    const text = name?.trim() || fallbackUsername?.trim() || 'U';
    const parts = text.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-up">
        {/* Banner Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-1.5 text-[var(--color-navy)]">Profil Pengguna</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Kelola data identitas akun dan kredensial keamanan instansi Anda.
          </p>
        </div>

        {loading && !profile ? (
          <div className="apple-card p-12 text-center shadow-xs">
            <i className="fas fa-circle-notch fa-spin text-2xl mb-4 text-[var(--color-navy)]"></i>
            <p className="text-sm text-[var(--color-ink-muted)]">Memuat data profil...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="apple-card p-8 flex flex-col items-center text-center relative overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner bg-[var(--color-surface-2)]">
                  <span className="font-display text-2xl text-[var(--color-navy)]">
                    {getInitials(profile?.fullName, profile?.username)}
                  </span>
                </div>

                <h2 className="text-lg font-semibold mb-0.5 text-[var(--color-ink)]">
                  {profile?.fullName || profile?.username || 'Pengguna'}
                </h2>
                <p className="text-xs mb-3 text-[var(--color-ink-muted)]">@{profile?.username}</p>

                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      ['admin', 'kasubag'].includes(profile?.role?.toLowerCase() || '')
                        ? 'text-[var(--color-gold)] bg-[var(--color-navy)]'
                        : 'text-[var(--color-navy)] bg-[var(--color-surface-2)] border border-black/[0.06]'
                    }`}
                  >
                    <i className="fas fa-shield-alt mr-1"></i> {profile?.role === 'admin' ? 'Kasubag' : (profile?.role === 'user' ? 'Tenaga Ahli' : (profile?.role || 'User'))}
                  </span>
                </div>

                <div className="w-full border-t border-black/[0.06] pt-5 text-left space-y-4">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1 text-[var(--color-ink-muted)]">
                      Email Terdaftar
                    </span>
                    <span className="text-sm break-all text-[var(--color-ink)]">{profile?.email || '-'}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1 text-[var(--color-ink-muted)]">
                      Terdaftar Sejak
                    </span>
                    <span className="text-sm text-[var(--color-ink)]">
                      {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Profile Form */}
            <div className="lg:col-span-2">
              <div className="apple-card overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
                <div className="border-b border-black/[0.06] px-8 py-5 bg-[var(--color-surface)]/80">
                  <h3 className="text-base font-display text-[var(--color-navy)]">
                    Informasi Akun
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="fullName">
                        Nama Lengkap <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="username">
                        Username <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="email">
                      Alamat Email <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                    />
                  </div>

                  {/* Password Toggle Section */}
                  <div className="mt-8 pt-6 border-t border-black/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-[var(--color-ink)]">
                          Pengaturan Keamanan
                        </h4>
                        <p className="text-xs mt-0.5 text-[var(--color-ink-muted)]">
                          Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-4 py-2 rounded-full text-xs font-medium transition-all border border-black/[0.09] hover:bg-black/[0.04] active:scale-95 cursor-pointer"
                      >
                        {showPasswordChange ? 'Batal Mengubah' : 'Ubah Kata Sandi'}
                      </button>
                    </div>

                    {showPasswordChange && (
                      <div className="p-5 rounded-xl border border-black/[0.07] bg-[var(--color-surface)] space-y-4 animate-fade-in mt-4">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                            Kata Sandi Saat Ini
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                              Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              placeholder="Minimal 6 karakter"
                              className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                              Konfirmasi Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-full text-white text-xs font-medium transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px] bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-2 text-xs"></i>
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan Perubahan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
