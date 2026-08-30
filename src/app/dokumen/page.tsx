'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { Pagination } from '@/presentation/components/common/Pagination';
import { PendingApprovalNotice } from '@/presentation/components/common/PendingApprovalNotice';
import { DocumentTable } from '@/presentation/components/documents/DocumentTable';
import { DocumentModal } from '@/presentation/components/documents/DocumentModal';
import { ShareDocumentModal } from '@/presentation/components/documents/ShareDocumentModal';
import { DocumentLoadingModal } from '@/presentation/components/documents/DocumentLoadingModal';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useDocuments } from '@/presentation/hooks/useDocuments';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { useToast } from '@/presentation/hooks/useToast';
import { Document } from '@/core/domain/document';
import { BIDANG_LIST } from '@/core/constants/bidang';

export default function DashboardPage() {
  const { isLoading: authLoading, role, bidang: userBidang, isPendingApproval, isAdmin, checkAuth, refreshProfile } = useAuth(true, false);
  const { bidangs } = useBidangs();
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Document management hook
  const {
    documents,
    currentPage,
    totalPages,
    keyword,
    namaTenagaAhli,
    jenisDokumen,
    periodeLaporan,
    bidang,
    loading,
    setCurrentPage,
    setKeyword,
    setNamaTenagaAhli,
    setJenisDokumen,
    setPeriodeLaporan,
    setBidang,
    fetchDocuments,
    saveDocument,
    deleteDocument,
    downloadDocument,
    fetchShares,
    shareDocument,
    revokeShare,
  } = useDocuments();

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [sharingDoc, setSharingDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<{ id: string; name?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openingDoc, setOpeningDoc] = useState<{ id: string; name?: string } | null>(null);

  // Helper for Indonesian Month & Year conversion
  const MONTH_NAMES_ID = useMemo(() => [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ], []);

  const formatMonthYearToIndonesian = useCallback((value: string): string => {
    if (/^\d{4}-\d{2}$/.test(value)) {
      const [year, monthStr] = value.split('-');
      const monthIndex = parseInt(monthStr, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
      }
    }
    return value;
  }, [MONTH_NAMES_ID]);

  const parseToMonthInput = useCallback((val: string): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}$/.test(val)) return val;
    const match = val.match(/([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const monthName = match[1].toLowerCase();
      const year = match[2];
      const monthIndex = MONTH_NAMES_ID.findIndex(m => m.toLowerCase() === monthName);
      if (monthIndex >= 0) {
        const mm = String(monthIndex + 1).padStart(2, '0');
        return `${year}-${mm}`;
      }
    }
    return '';
  }, [MONTH_NAMES_ID]);

  // Generate unique Tenaga Ahli list automatically from registered documents
  const uniqueTenagaAhliList = useMemo(() => {
    const names = new Set<string>();
    documents.forEach(doc => {
      if (doc.namaTenagaAhli && doc.namaTenagaAhli.trim()) {
        names.add(doc.namaTenagaAhli.trim());
      }
    });
    return Array.from(names).sort();
  }, [documents]);

  // Generate unique Jenis Dokumen list automatically
  const uniqueJenisDokumenList = useMemo(() => {
    const types = new Set<string>();
    documents.forEach(doc => {
      if (doc.jenisDokumen && doc.jenisDokumen.trim()) {
        types.add(doc.jenisDokumen.trim());
      }
    });
    return Array.from(types).sort();
  }, [documents]);

  // Auto-refresh document list on SignalR events
  const handleDocumentChange = useCallback((event: string, data?: any) => {
    fetchDocuments();
    if (event === 'DocumentCreated') {
      showToast('Dokumen baru telah ditambahkan!');
    } else if (event === 'DocumentUpdated') {
      showToast('Data dokumen diperbarui!');
    } else if (event === 'DocumentDeleted') {
      showToast('Dokumen telah dihapus!');
    } else if (event === 'DocumentShared') {
      showToast(`Dokumen berhasil dibagikan!`);
    } else if (event === 'DocumentAccessRevoked') {
      showToast('Hak akses dokumen dicabut!');
    }
  }, [fetchDocuments, showToast]);

  const handleUserChange = useCallback((event: string) => {
    if (event === 'UserUpdated') {
      refreshProfile();
    }
  }, [refreshProfile]);

  const { isConnected: isSignalRConnected } = useDataSignalR(handleDocumentChange, handleUserChange);

  const isInitialMount = useRef(true);

  // Global shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDocuments();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchDocuments({ page: 1, searchKey: keyword, tenagaAhli: namaTenagaAhli, jenisDok: jenisDokumen, periode: periodeLaporan, bidang });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, namaTenagaAhli, jenisDokumen, periodeLaporan, bidang, authLoading]);

  if (authLoading) return null;

  const handleOpenUploadModal = () => {
    if (isPendingApproval) {
      showToast('Akun Anda masih menunggu persetujuan Admin/Kasubag sebelum dapat mengunggah dokumen.', true);
      return;
    }
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  const handleOpenEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleShareClick = (doc: Document) => {
    setSharingDoc(doc);
  };

  const handleDeleteClick = (id: string) => {
    const target = documents.find(d => d.id === id);
    setDocToDelete({
      id,
      name: target?.nama || target?.namaFile || 'Dokumen Tanpa Judul',
    });
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteDocument(docToDelete.id);
      if (res.ok) {
        showToast('Dokumen berhasil dihapus');
      } else {
        showToast(res.message || 'Gagal menghapus dokumen', true);
      }
    } catch {
      showToast('Kesalahan saat menghapus dokumen', true);
    } finally {
      setIsDeleting(false);
      setDocToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword('');
    setNamaTenagaAhli('');
    setJenisDokumen('');
    setPeriodeLaporan('');
    setBidang('');
    setCurrentPage(1);
    fetchDocuments({ page: 1, searchKey: '', tenagaAhli: '', jenisDok: '', periode: '', bidang: '' });
  };

  const hasActiveFilters = Boolean(keyword || namaTenagaAhli || jenisDokumen || periodeLaporan || bidang);

  const handleShowDocument = async (id: string) => {
    const target = documents.find(d => d.id === id);
    const docName = target?.nama || target?.namaFile || 'Laporan Kerja';
    setOpeningDoc({ id, name: docName });

    try {
      await downloadDocument(id, target?.namaFile);
    } catch {
      showToast('Gagal memuat berkas dokumen', true);
    } finally {
      setTimeout(() => {
        setOpeningDoc(null);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 animate-fadeIn">
        {/* Pending Approval Notice */}
        {isPendingApproval && (
          <div className="mb-6">
            <PendingApprovalNotice onRefresh={refreshProfile} />
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Laporan Kerja Tenaga Ahli
              </h1>
              {hasActiveFilters && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Filter Aktif
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {userBidang ? (
                <>
                  Bidang Anda: <strong className="text-slate-800">{userBidang}</strong> &bull; Anda dapat membaca dokumen bidang ini dan dokumen yang dibagikan secara khusus ke akun Anda.
                </>
              ) : (
                'Kelola dokumen laporan tenaga ahli di lingkungan Dinas Komunikasi dan Informatika.'
              )}
            </p>
          </div>
          
          <button
            onClick={handleOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Unggah Dokumen Baru</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap gap-3 items-center">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[220px]">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari judul atau isi laporan... (Tekan /)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800"
            />
            {keyword ? (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs cursor-pointer"
                title="Hapus pencarian"
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 hidden sm:inline">
                /
              </kbd>
            )}
          </div>

          {/* Bidang Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select
              value={role !== 'admin' ? (userBidang || '') : bidang}
              onChange={e => setBidang(e.target.value)}
              disabled={role !== 'admin'}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {role === 'admin' && <option value="">Semua Bidang</option>}
              {role !== 'admin' ? (
                <option value={userBidang || ''}>{userBidang || 'Belum Ditentukan'}</option>
              ) : bidangs.length > 0 ? (
                bidangs.map(b => (
                  <option key={b.id} value={b.nama}>
                    {b.nama}
                  </option>
                ))
              ) : (
                <>
                  <option value="Bidang APTIKA">Bidang APTIKA</option>
                  <option value="Bidang TIK">Bidang TIK</option>
                  <option value="Bidang IKP">Bidang IKP</option>
                  <option value="Bidang Statistik">Bidang Statistik</option>
                  <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                  <option value="Sekretariat">Sekretariat</option>
                </>
              )}
            </select>
          </div>

          {/* Nama Tenaga Ahli Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select
              value={namaTenagaAhli}
              onChange={e => setNamaTenagaAhli(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium"
            >
              <option value="">Semua Tenaga Ahli</option>
              {uniqueTenagaAhliList.map(nama => (
                <option key={nama} value={nama}>
                  {nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Dokumen Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <select
              value={jenisDokumen}
              onChange={e => setJenisDokumen(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium"
            >
              <option value="">Semua Jenis</option>
              {uniqueJenisDokumenList.map(jenis => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          {/* Periode Calendar Filter */}
          <div className="relative w-full sm:w-auto min-w-[150px]">
            <input
              type="month"
              value={parseToMonthInput(periodeLaporan)}
              onChange={e => {
                const val = e.target.value;
                setPeriodeLaporan(val ? formatMonthYearToIndonesian(val) : '');
              }}
              title="Pilih kalender periode bulan laporan"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer"
            />
            {periodeLaporan && (
              <button
                onClick={() => setPeriodeLaporan('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs cursor-pointer"
                title="Hapus filter periode"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Reset semua filter"
            >
              <i className="fas fa-redo-alt text-[10px] text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Document Table */}
        <DocumentTable
          documents={documents}
          isLoading={loading}
          onShow={handleShowDocument}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteClick}
          onShare={handleShareClick}
          onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          onOpenUpload={handleOpenUploadModal}
          userRole={role?.toLowerCase()}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => {
            setCurrentPage(page);
            fetchDocuments({ page });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* Document Loading Popup */}
      <DocumentLoadingModal
        isOpen={!!openingDoc}
        docTitle={openingDoc?.name}
        onCancel={() => setOpeningDoc(null)}
      />

      {/* Upload/Edit Modal */}
      <DocumentModal
        isOpen={isDocModalOpen}
        editingDocument={editingDoc}
        onClose={() => setIsDocModalOpen(false)}
        onSubmit={saveDocument}
        showToast={showToast}
        userBidang={userBidang}
        isAdmin={isAdmin}
        role={role}
      />

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={!!sharingDoc}
        document={sharingDoc}
        onClose={() => setSharingDoc(null)}
        onShare={shareDocument}
        onRevoke={revokeShare}
        fetchShares={fetchShares}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!docToDelete}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini dari sistem? Seluruh indeksasi AI dan data pencarian terkait akan dihapus secara permanen."
        itemName={docToDelete?.name}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDocToDelete(null)}
      />

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
