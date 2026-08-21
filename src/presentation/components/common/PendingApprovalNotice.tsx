'use client';

import React from 'react';

interface PendingApprovalNoticeProps {
  onRefresh?: () => void;
}

export const PendingApprovalNotice: React.FC<PendingApprovalNoticeProps> = ({ onRefresh }) => {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
          <i className="fa-solid fa-clock-rotate-left text-xl animate-pulse"></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-amber-900">Menunggu Persetujuan Admin & Penentuan Bidang</h3>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              Pending Approval
            </span>
          </div>
          <p className="mt-1 text-sm text-amber-800 leading-relaxed">
            Akun Anda baru saja terdaftar dan saat ini sedang menunggu verifikasi dari <strong>Administrator / Kasubag Diskominfo</strong> untuk disetujui serta ditentukan penempatan <strong>Bidang</strong> kerjanya.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-amber-700 bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200/60 font-medium">
              <i className="fa-solid fa-circle-info mr-1.5 text-amber-600"></i>
              Fitur upload dokumen, penelusuran laporan, dan tanya jawab AI akan aktif otomatis setelah akun disetujui.
            </span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                <i className="fa-solid fa-arrows-rotate text-xs"></i>
                Cek Status Persetujuan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
