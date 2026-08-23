'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useDashboard } from '@/presentation/hooks/useDashboard';
import { useDocuments } from '@/presentation/hooks/useDocuments';
import { useToast } from '@/presentation/hooks/useToast';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { DocumentLoadingModal } from '@/presentation/components/documents/DocumentLoadingModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { isLoading: authLoading, isAdmin, user, role } = useAuth(true, false);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const { toast, showToast } = useToast();
  const { summary, loading, fetchSummary } = useDashboard(showToast);
  const { downloadDocument } = useDocuments();
  
  const [openingDoc, setOpeningDoc] = useState<{ id: string; name?: string } | null>(null);

  const handleShowDocument = async (id: string, name: string) => {
    setOpeningDoc({ id, name });
    try {
      await downloadDocument(id, name);
    } catch {
      showToast('Gagal memuat berkas dokumen', true);
    } finally {
      setTimeout(() => {
        setOpeningDoc(null);
      }, 500);
    }
  };

  useEffect(() => {
    if (!authLoading && role !== 'super-admin') {
      router.push('/dokumen');
    }
  }, [authLoading, role, router]);

  useEffect(() => {
    if (role === 'super-admin') {
      fetchSummary();
    }
  }, [role, fetchSummary]);

  const handleDocumentChange = useCallback(() => {
    if (role === 'super-admin') fetchSummary();
  }, [role, fetchSummary]);

  const handleUserChange = useCallback(() => {
    if (role === 'super-admin') fetchSummary();
  }, [role, fetchSummary]);

  const { isConnected: isSignalRConnected } = useDataSignalR(handleDocumentChange, handleUserChange);

  if (authLoading || role !== 'super-admin') return null;

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
        
        {/* Standard Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Selamat Datang, <strong className="text-slate-800">{user?.nama || user?.namaLengkap || 'Administrator'}</strong>. Panel kendali utama Sistem Pelaporan Tenaga Ahli (SIPENTA).
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Link href="/users" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-xs active:scale-95 cursor-pointer bg-white border border-slate-200 text-slate-700 hover:bg-slate-50">
              <i className="fa-solid fa-users text-slate-400"></i>
              Kelola Pengguna
            </Link>
            <Link href="/dokumen" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white">
              <i className="fa-solid fa-file-lines text-[14px]"></i>
              Lihat Dokumen
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
            <div className="flex flex-col items-center">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-600 mb-4"></i>
              <p className="text-sm font-medium text-slate-500">Memuat data sistem...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <i className="fa-solid fa-users"></i>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pengguna</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{summary?.totalUsers || 0}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                    <i className="fa-solid fa-user-clock"></i>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Antrean Persetujuan</h3>
                </div>
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-bold text-slate-800">{summary?.pendingUsers || 0}</p>
                  {summary?.pendingUsers && summary.pendingUsers > 0 ? (
                    <span className="mb-1.5 text-[10px] font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded border border-amber-200/50">Tindakan diperlukan</span>
                  ) : null}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <i className="fa-solid fa-file-lines"></i>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Volume Dokumen</h3>
                </div>
                <p className="text-3xl font-bold text-slate-800">{summary?.totalDocuments || 0}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <i className="fa-solid fa-hard-drive"></i>
                    </div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Beban Penyimpanan</h3>
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{formatBytes(summary?.totalStorageBytes || 0)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Documents Table View (Spans 2 columns on large) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-200/80 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">Riwayat Unggahan Terbaru</h3>
                  <Link href="/dokumen" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg">Lihat Semua</Link>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
                    <thead className="bg-slate-50/80 text-[11px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5 font-bold w-full">Nama Dokumen</th>
                        <th className="px-5 py-3.5 font-bold">Uploader</th>
                        <th className="px-5 py-3.5 font-bold text-right">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {summary?.recentDocuments?.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-5 py-8 text-center text-slate-400 text-sm">
                            Belum ada dokumen yang diunggah ke dalam sistem.
                          </td>
                        </tr>
                      ) : (
                        summary?.recentDocuments.map(doc => (
                          <tr 
                            key={doc.id} 
                            onClick={() => handleShowDocument(doc.id, doc.nama)}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                          >
                            <td className="px-5 py-3 align-middle">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 shadow-2xs transition-colors">
                                  <i className="fa-solid fa-file-pdf text-rose-500 text-sm"></i>
                                </div>
                                <span className="font-semibold text-sm text-slate-800 group-hover:text-indigo-600 group-hover:underline truncate max-w-[200px] sm:max-w-[300px]" title={doc.nama}>
                                  {doc.nama}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 align-middle text-slate-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                  {doc.uploaderName?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="text-xs font-medium">{doc.uploaderName}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 align-middle text-right text-xs text-slate-500 font-medium">
                              {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Composition Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">Komposisi per Bidang</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  {summary?.documentsByBidang?.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                      Data komposisi kosong.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {summary?.documentsByBidang.map((item, idx) => {
                        const totalDocs = summary?.totalDocuments || 1; // prevent div by zero
                        const percentage = Math.round((item.count / totalDocs) * 100);
                        
                        return (
                          <div key={idx} className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-end text-sm">
                              <span className="font-medium text-slate-700 text-xs">{item.bidangName.replace('Bidang ', '')}</span>
                              <span className="text-slate-500 text-[11px] font-medium">{item.count} dok ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-indigo-500 h-full rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <DocumentLoadingModal
        isOpen={!!openingDoc}
        docTitle={openingDoc?.name}
        onCancel={() => setOpeningDoc(null)}
      />

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
