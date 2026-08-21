'use client';

import React, { useState, useEffect } from 'react';
import { UserAccount } from '@/core/domain/user';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { BIDANG_LIST } from '@/core/constants/bidang';

interface ApproveUserModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onApprove: (id: string, bidang: string) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const ApproveUserModal: React.FC<ApproveUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onApprove,
  showToast,
}) => {
  const { bidangs } = useBidangs(isOpen);
  const [selectedBidang, setSelectedBidang] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (bidangs.length > 0) {
        setSelectedBidang(bidangs[0].nama);
      } else {
        setSelectedBidang(BIDANG_LIST[0]);
      }
    }
  }, [isOpen, bidangs]);

  if (!isOpen || !user) return null;

  const bidangOptions = bidangs.length > 0 ? bidangs.map(b => b.nama) : BIDANG_LIST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBidang) {
      showToast('Pilih bidang terlebih dahulu', true);
      return;
    }

    setLoading(true);
    try {
      const res = await onApprove(user.id, selectedBidang);
      if (res.ok) {
        showToast(`Pengguna @${user.username} berhasil disetujui untuk ${selectedBidang}!`);
        onClose();
      } else {
        showToast(res.message || 'Gagal menyetujui pengguna', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <i className="fa-solid fa-user-check text-lg"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Setujui Pengguna</h3>
              <p className="text-xs text-slate-500">Tentukan penempatan bidang kerja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-1">
            <p className="font-bold text-slate-800">{user.fullName || user.username}</p>
            <p className="text-slate-500">@{user.username} &bull; {user.email}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Pilih Bidang Diskominfo <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            >
              {bidangOptions.map((bidang) => (
                <option key={bidang} value={bidang}>
                  {bidang}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Setelah disetujui, pengguna dapat mengunggah laporan dan mengakses seluruh dokumen laporan yang berada di bidang ini.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs"></i>
                  <span>Setujui & Beri Akses</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
