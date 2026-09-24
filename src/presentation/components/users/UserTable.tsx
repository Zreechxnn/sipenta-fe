'use client';

import React, { useState } from 'react';
import { UserAccount } from '@/core/domain/user';
import { formatDate } from '@/presentation/utils/formatters';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface UserTableProps {
  users: UserAccount[];
  isLoading?: boolean;
  onEdit: (user: UserAccount) => void;
  onDelete: (id: string) => void;
  onApproveClick?: (user: UserAccount) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  onApproveClick,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 1800);
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 gap-4 border-b border-[var(--color-border)] last:border-b-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full skeleton-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-xs">
                <div className="h-4 skeleton-shimmer rounded-xs w-3/4" />
                <div className="h-3 skeleton-shimmer rounded-xs w-1/2" />
              </div>
            </div>
            <div className="h-4 skeleton-shimmer rounded-xs w-28 hidden md:block" />
            <div className="h-5 skeleton-shimmer rounded-full w-16 hidden md:block" />
            <div className="h-8 skeleton-shimmer rounded-xs w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-0">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3 p-4">
        {users.length === 0 ? (
          <div className="border border-[var(--color-border)] bg-white p-8 text-center text-sm shadow-2xs rounded-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Belum ada data pengguna terdaftar.
          </div>
        ) : (
          users.map((user, idx) => {
            const roleLower = user.role?.toLowerCase() || '';
            const isAdmin = ['admin', 'kepala bagian', 'kasubag'].includes(roleLower);
            const isApproved = isAdmin || user.isApproved;
            const bidangStyle = user.bidang && BIDANG_COLORS[user.bidang]
              ? BIDANG_COLORS[user.bidang]
              : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

            const isKepalaBagian = roleLower === 'kepala bagian' || roleLower === 'kasubag';
            const roleDisplay = roleLower === 'admin' ? 'Admin' : (isKepalaBagian ? 'Kepala Bagian' : 'Tenaga Ahli');
            const roleBadgeColor = roleLower === 'admin' ? 'text-purple-800 bg-purple-100' : (isKepalaBagian ? 'text-blue-800 bg-blue-100' : 'text-indigo-700 bg-indigo-50');

            return (
              <div
                key={user.id}
                className={`border bg-white p-4 shadow-2xs rounded-xl flex flex-col gap-3 transition-colors ${
                  !isApproved ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-indigo-400'
                } animate-fade-up`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 font-bold text-sm">
                      {(user.fullName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {user.fullName || user.username}
                      </h4>
                      <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${roleBadgeColor}`}>
                      {roleDisplay}
                    </span>
                    {!isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        Menunggu
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <i className="fa-solid fa-check text-[9px] mr-1"></i> Disetujui
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-envelope text-[11px] w-4 text-center text-slate-400"></i>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-[11px] w-4 text-center text-slate-400"></i>
                    <span>
                      Bidang:{' '}
                      {user.bidang ? (
                        <span className={`inline-block font-semibold px-1.5 py-0.2 rounded text-[11px] ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {user.bidang}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Belum ditentukan</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <i className="fas fa-calendar-alt text-[11px] w-4 text-center text-slate-400"></i>
                    <span>Terdaftar: {user.createdAt ? formatDate(user.createdAt) : '-'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {!isApproved && onApproveClick && (
                    <button
                      onClick={() => onApproveClick(user)}
                      className="h-8 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <i className="fas fa-check-circle"></i> Setujui
                    </button>
                  )}
                  <button
                    title="Ubah Data Pengguna"
                    className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium transition-colors text-slate-700"
                    onClick={() => onEdit(user)}
                  >
                    <i className="fas fa-edit"></i> Ubah
                  </button>
                  <button
                    title="Hapus Pengguna"
                    className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5 text-xs font-medium transition-colors text-rose-600"
                    onClick={() => onDelete(user.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block apple-card overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)]/80 border-b border-black/[0.06]">
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[22%] text-[var(--color-ink-muted)]">Pengguna</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[18%] text-[var(--color-ink-muted)]">Bidang Diskominfo</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[20%] text-[var(--color-ink-muted)]">Kontak Email</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[12%] text-[var(--color-ink-muted)]">Hak Akses</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[14%] text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-right w-[14%] text-[var(--color-ink-muted)]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black/[0.04]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <i className="fas fa-users text-sm" />
                  </div>
                  Belum ada data pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => {
                const roleLower = user.role?.toLowerCase() || '';
                const isAdmin = ['admin', 'kepala bagian', 'kasubag'].includes(roleLower);
                const isApproved = isAdmin || user.isApproved;
                const isCopied = copiedEmail === user.email;
                const bidangStyle = user.bidang && BIDANG_COLORS[user.bidang]
                  ? BIDANG_COLORS[user.bidang]
                  : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

                const isKepalaBagian = roleLower === 'kepala bagian' || roleLower === 'kasubag';
                const roleDisplay = roleLower === 'admin' ? 'Admin' : (isKepalaBagian ? 'Kepala Bagian' : 'Tenaga Ahli');
                const roleBadgeColor = roleLower === 'admin' ? 'text-purple-800 bg-purple-100' : (isKepalaBagian ? 'text-blue-800 bg-blue-100' : 'text-indigo-700 bg-indigo-50');

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/80 transition-all duration-150 group animate-fade-up ${
                      !isApproved ? 'bg-amber-50/20' : ''
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 font-bold text-xs">
                          {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-[13px] text-slate-900 block truncate">
                            {user.fullName || user.username}
                          </span>
                          <span className="text-[11px] text-slate-400">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.bidang ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {user.bidang}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                          Belum ditentukan
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-slate-700">
                      <button
                        onClick={() => handleCopyEmail(user.email)}
                        className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer group/btn"
                        title="Klik untuk menyalin email"
                      >
                        <span className="truncate max-w-[160px]">{user.email}</span>
                        <i className={`fas ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy opacity-0 group-hover/btn:opacity-100 text-slate-400'} text-[10px] transition-opacity`} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${roleBadgeColor}`}>
                        {roleDisplay}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {!isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          Menunggu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                          Disetujui
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isApproved && onApproveClick && (
                          <button
                            title="Setujui dan Tentukan Bidang"
                            className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                            onClick={() => onApproveClick(user)}
                          >
                            <i className="fas fa-check text-[10px]"></i>
                            <span>Setujui</span>
                          </button>
                        )}
                        <button
                          title="Ubah Data Pengguna"
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all text-slate-700 active:scale-95 cursor-pointer"
                          onClick={() => onEdit(user)}
                        >
                          <i className="fas fa-edit text-[11px]"></i>
                        </button>
                        <button
                          title="Hapus Pengguna"
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 border border-slate-200 hover:border-rose-200 flex items-center justify-center transition-all text-rose-600 active:scale-95 cursor-pointer"
                          onClick={() => onDelete(user.id)}
                        >
                          <i className="fas fa-trash-alt text-[11px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
