'use client';

import React from 'react';
import { Document } from '@/core/domain/document';
import { formatDate, formatBytes } from '@/presentation/utils/formatters';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface DocumentTableProps {
  documents: Document[];
  isLoading?: boolean;
  onShow: (id: string) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onShare?: (doc: Document) => void;
  onResetFilters?: () => void;
  onOpenUpload?: () => void;
  userRole?: string;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  isLoading = false,
  onShow,
  onEdit,
  onDelete,
  onShare,
  onResetFilters,
  onOpenUpload,
  userRole,
}) => {
  const isAdmin = ['admin', 'kepala bidang', 'kepala bagian', 'kasubag'].includes(userRole?.toLowerCase() || '');

  if (isLoading) {
    return (
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-32 skeleton-shimmer rounded-md" />
          <div className="h-4 w-20 skeleton-shimmer rounded-md" />
        </div>
        <div className="divide-y divide-slate-100 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 skeleton-shimmer rounded-xl shrink-0" />
                <div className="space-y-2 flex-1 max-w-md">
                  <div className="h-4 skeleton-shimmer rounded w-3/4" />
                  <div className="h-3 skeleton-shimmer rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 skeleton-shimmer rounded w-28 hidden md:block" />
              <div className="h-4 skeleton-shimmer rounded w-20 hidden md:block" />
              <div className="h-8 skeleton-shimmer rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Mobile Card View (hidden on md and larger) */}
      <div className="block md:hidden space-y-4">
        {documents.length === 0 ? (
          <div className="border border-slate-200 bg-white p-8 text-center rounded-2xl text-sm shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <i className="fas fa-folder-open text-base" />
            </div>
            <p className="font-semibold text-slate-800">Tidak ada dokumen ditemukan</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Coba sesuaikan kata kunci pencarian, filter bidang, atau unggah dokumen laporan baru.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              {onResetFilters && (
                <button
                  onClick={onResetFilters}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  Unggah Dokumen
                </button>
              )}
            </div>
          </div>
        ) : (
          documents.map((doc, idx) => {
            let icon = 'fa-file-alt text-slate-400';
            if (doc.mimeType?.includes('pdf')) icon = 'fa-file-pdf text-rose-500';
            else if (doc.mimeType?.includes('word')) icon = 'fa-file-word text-blue-600';

            const bidangStyle = doc.bidang && BIDANG_COLORS[doc.bidang]
              ? BIDANG_COLORS[doc.bidang]
              : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

            const canManage = isAdmin || doc.isOwner !== false;

            return (
              <div
                key={doc.id}
                className="border border-slate-200 bg-white p-4.5 rounded-2xl flex flex-col gap-3 shadow-xs hover:border-indigo-400 transition-colors animate-fade-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {doc.bidang && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                      {doc.bidang}
                    </span>
                  )}
                  {doc.isSharedWithMe && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                      <i className="fa-solid fa-users text-[9px]"></i> Dibagikan ke Anda
                    </span>
                  )}
                  {doc.sharedWith && doc.sharedWith.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <i className="fa-solid fa-share-nodes text-[9px]"></i> {doc.sharedWith.length} Pengguna Luar
                    </span>
                  )}
                </div>

                {/* Line 1: Title */}
                <div
                  onClick={() => onShow(doc.id)}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                  title="Klik untuk membuka dokumen"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-50 transition-colors shadow-2xs">
                    <i className={`fas ${icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-snug break-words text-slate-800 group-hover:text-indigo-600 group-hover:underline transition-colors">
                      {doc.nama || doc.namaFile}
                    </h4>
                    <div className="text-[11px] mt-1 text-slate-400 flex items-center gap-1.5">
                      <span>{formatDate(doc.tanggalUpload)}</span>
                      <span>&bull;</span>
                      <span>{formatBytes(doc.ukuran)}</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Tenaga Ahli</span>
                    <span className="font-medium text-slate-700 line-clamp-1 uppercase">{doc.namaTenagaAhli || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Jenis</span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 line-clamp-1">
                      {doc.jenisDokumen || 'Laporan Kerja'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Periode</span>
                    <span className="font-medium text-slate-700">{doc.periodeLaporan || '-'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                  {canManage && onShare && (
                    <button
                      title="Bagikan Dokumen ke Pengguna Lain"
                      className="h-8 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                      onClick={() => onShare(doc)}
                    >
                      <i className="fa-solid fa-user-plus text-xs"></i>
                      <span>Bagikan</span>
                    </button>
                  )}
                  {canManage && (
                    <button
                      title="Ubah data metadata"
                      className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium transition-colors text-slate-700 active:scale-95 cursor-pointer"
                      onClick={() => onEdit(doc)}
                    >
                      <i className="fas fa-edit text-xs"></i> Ubah
                    </button>
                  )}
                  {canManage && (
                    <button
                      title="Hapus dokumen dari sistem"
                      className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5 text-xs font-medium transition-colors text-rose-600 active:scale-95 cursor-pointer"
                      onClick={() => onDelete(doc.id)}
                    >
                      <i className="fas fa-trash-alt text-xs"></i> Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block apple-card overflow-hidden bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-3.5 px-5 font-bold">Judul & Berkas</th>
              <th className="py-3.5 px-4 font-bold">Bidang Diskominfo</th>
              <th className="py-3.5 px-4 font-bold">Nama Tenaga Ahli</th>
              <th className="py-3.5 px-4 font-bold">Jenis Dokumen</th>
              <th className="py-3.5 px-4 font-bold">Periode Laporan</th>
              <th className="py-3.5 px-5 text-right font-bold">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <i className="fas fa-folder-open text-lg" />
                  </div>
                  <p className="font-semibold text-slate-800 mb-1">Tidak ada dokumen ditemukan</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Tidak ada dokumen yang cocok dengan filter aktif atau belum ada dokumen yang diunggah.
                  </p>
                  <div className="flex justify-center gap-3">
                    {onResetFilters && (
                      <button
                        onClick={onResetFilters}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer"
                      >
                        <i className="fas fa-redo-alt mr-1.5 text-xs text-slate-400" />
                        Reset Filter
                      </button>
                    )}
                    {onOpenUpload && (
                      <button
                        onClick={onOpenUpload}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <i className="fas fa-plus text-xs" />
                        Unggah Dokumen Baru
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              documents.map((doc, idx) => {
                let icon = 'fa-file-alt text-slate-400';
                if (doc.mimeType?.includes('pdf')) icon = 'fa-file-pdf text-rose-500';
                else if (doc.mimeType?.includes('word')) icon = 'fa-file-word text-blue-600';

                const bidangStyle = doc.bidang && BIDANG_COLORS[doc.bidang]
                  ? BIDANG_COLORS[doc.bidang]
                  : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

                const canManage = isAdmin || doc.isOwner !== false;

                return (
                  <tr
                    key={doc.id}
                    className="bg-white hover:bg-slate-50/70 transition-all duration-150 group animate-fade-up"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="p-4 align-middle">
                      <div
                        onClick={() => onShow(doc.id)}
                        className="flex items-center gap-3.5 cursor-pointer select-none group/item"
                        title="Klik untuk membuka dokumen asli"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/item:scale-105 group-hover/item:bg-indigo-50 shadow-2xs">
                          <i className={`fas ${icon} text-lg`}></i>
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="font-semibold text-sm leading-snug mb-1 text-slate-900 group-hover/item:text-indigo-600 group-hover/item:underline transition-colors line-clamp-2">
                            {doc.nama || doc.namaFile}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{formatDate(doc.tanggalUpload)}</span>
                            <span>&bull;</span>
                            <span>{formatBytes(doc.ukuran)}</span>
                            {doc.isSharedWithMe && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                                <i className="fa-solid fa-users text-[8px]"></i> Dibagikan ke Anda
                              </span>
                            )}
                            {doc.sharedWith && doc.sharedWith.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                                <i className="fa-solid fa-share-nodes text-[8px]"></i> {doc.sharedWith.length} dibagikan
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {doc.bidang ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {doc.bidang}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium text-xs text-slate-800 uppercase">{doc.namaTenagaAhli || '-'}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                        {doc.jenisDokumen || 'Laporan Kerja'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-xs text-slate-700">
                      {doc.periodeLaporan ? <div className="font-medium">{doc.periodeLaporan}</div> : '-'}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage && onShare && (
                          <button
                            title="Bagikan Dokumen"
                            className="h-8 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                            onClick={() => onShare(doc)}
                          >
                            <i className="fa-solid fa-user-plus text-xs"></i>
                            <span className="hidden xl:inline">Bagikan</span>
                          </button>
                        )}
                        {canManage && (
                          <button
                            title="Ubah Metadata"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all text-slate-600 hover:text-slate-900 active:scale-95 shadow-2xs cursor-pointer"
                            onClick={() => onEdit(doc)}
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                        )}
                        {canManage && (
                          <button
                            title="Hapus Dokumen"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center transition-all text-rose-600 active:scale-95 shadow-2xs cursor-pointer"
                            onClick={() => onDelete(doc.id)}
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                        )}
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
