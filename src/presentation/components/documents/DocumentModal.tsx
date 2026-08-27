'use client';

import { Document, SaveDocumentDto } from '@/core/domain/document';
import { BIDANG_LIST } from '@/core/constants/bidang';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import React, { useEffect, useRef, useState } from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  editingDocument: Document | null;
  onClose: () => void;
  onSubmit: (dto: SaveDocumentDto) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
  userBidang?: string | null;
  isAdmin?: boolean;
  role?: string | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  editingDocument,
  onClose,
  onSubmit,
  showToast,
  userBidang,
  isAdmin = false,
  role,
}) => {
  const { bidangs } = useBidangs(isOpen);
  const [nama, setNama] = useState('');
  const [namaTenagaAhli, setNamaTenagaAhli] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [periodeLaporan, setPeriodeLaporan] = useState<string>('');
  const [bidang, setBidang] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formatMonthYearToIndonesian = (value: string): string => {
    if (/^\d{4}-\d{2}$/.test(value)) {
      const [year, monthStr] = value.split('-');
      const monthIndex = parseInt(monthStr, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
      }
    }
    return value;
  };

  const parseToMonthInput = (val: string): string => {
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
  };

  useEffect(() => {
    if (editingDocument) {
      setNama(editingDocument.nama || editingDocument.namaFile || '');
      setNamaTenagaAhli(editingDocument.namaTenagaAhli || '');
      setJenisDokumen(editingDocument.jenisDokumen || '');
      setPeriodeLaporan(editingDocument.periodeLaporan || '');
      setBidang(editingDocument.bidang || '');
      setFiles([]);
    } else {
      setNama('');
      setNamaTenagaAhli('');
      setJenisDokumen('');
      setPeriodeLaporan('');
      setBidang(userBidang || '');
      setFiles([]);
    }
  }, [editingDocument, isOpen, userBidang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const isEdit = !!editingDocument;

  const appendFiles = (incomingFiles: File[]) => {
    setFiles(prev => {
      const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}-${f.lastModified}`));
      const newUnique = incomingFiles.filter(f => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`));
      return [...prev, ...newUnique];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      appendFiles(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      appendFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'fas fa-file-pdf text-rose-500';
    if (ext === 'doc' || ext === 'docx') return 'fas fa-file-word text-blue-600';
    return 'fas fa-file-alt text-slate-400';
  };

  const totalSizeBytes = files.reduce((acc, f) => acc + f.size, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEdit && files.length === 0) {
      showToast('Harap pilih file dokumen terlebih dahulu', true);
      return;
    }

    setLoading(true);

    const isSuperAdmin = role === 'super-admin';
    const dto: SaveDocumentDto = isEdit
      ? {
          id: editingDocument?.id,
          nama,
          namaTenagaAhli,
          jenisDokumen,
          periodeLaporan,
          bidang: isSuperAdmin ? (bidang || null) : (userBidang || null),
        }
      : {
          files,
          bidang: isSuperAdmin ? (bidang || userBidang || null) : (userBidang || null),
        };

    try {
      const res = await onSubmit(dto);
      if (res.ok) {
        const msg = isEdit
          ? 'Dokumen berhasil diperbarui'
          : files.length > 1
          ? `${files.length} dokumen berhasil diupload`
          : 'Dokumen berhasil diupload';
        showToast(msg);
        onClose();
      } else {
        showToast(res.message || 'Gagal menyimpan dokumen', true);
      }
    } catch {
      showToast('Kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
        onClick={() => !loading && onClose()}
      />
      
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl relative animate-scaleUp max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Ubah Metadata Dokumen' : 'Unggah Dokumen Laporan'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Perbarui informasi laporan' : 'Upload berkas PDF/DOCX untuk dianalisis oleh AI'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            {!isEdit ? (
              <div className="space-y-4">
                {/* Bidang info/selection on Upload */}
                <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
                  <i className="fas fa-info-circle text-indigo-600 mt-0.5"></i>
                  <div className="text-xs text-indigo-900 flex-1">
                    {role === 'super-admin' ? (
                      <div className="space-y-1.5">
                        <span className="font-semibold block">Tentukan Bidang untuk Dokumen yang Diunggah:</span>
                        <select
                          value={bidang}
                          onChange={(e) => setBidang(e.target.value)}
                          className="w-full rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="">-- Gunakan Bidang Pengunggah --</option>
                          {bidangs.length > 0 ? (
                            bidangs.map((b) => (
                              <option key={b.id} value={b.nama}>
                                {b.nama}
                              </option>
                            ))
                          ) : BIDANG_LIST.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span>
                        Dokumen yang diunggah akan otomatis terhubung ke <strong>{userBidang || 'Bidang Anda'}</strong> sehingga dapat dibaca oleh rekan di bidang yang sama.
                      </span>
                    )}
                  </div>
                </div>
                
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                    <i className="fas fa-cloud-upload-alt text-2xl"></i>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    Seret & lepas dokumen di sini, atau klik untuk memilih file
                  </p>
                  <span className="text-xs text-slate-400">Format yang didukung: PDF, DOC, DOCX</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    required={!isEdit && files.length === 0}
                    onChange={handleFileChange}
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-600">
                        <span>{files.length} dokumen</span> siap diproses ({(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAllFiles}
                        className="text-xs font-semibold text-rose-600 hover:underline transition-colors"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 group hover:border-indigo-400 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <i className={`${getFileIcon(file.name)} text-lg shrink-0`}></i>
                            <span className="truncate text-xs font-medium text-slate-800">{file.name}</span>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-rose-500 hover:bg-rose-50"
                            title="Hapus file"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nama Tenaga Ahli
                    </label>
                    <input
                      type="text"
                      value={namaTenagaAhli}
                      onChange={e => setNamaTenagaAhli(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Bidang Diskominfo
                    </label>
                    <select
                      value={role === 'kasubag' || role === 'user' ? (userBidang || '') : bidang}
                      onChange={e => setBidang(e.target.value)}
                      disabled={role === 'kasubag' || role === 'user'}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {role !== 'kasubag' && role !== 'user' && <option value="">-- Belum Ditentukan --</option>}
                      {role === 'kasubag' || role === 'user' ? (
                        <option value={userBidang || ''}>{userBidang || 'Belum Ditentukan'}</option>
                      ) : bidangs.length > 0 ? (
                        bidangs.map((b) => (
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Jenis Dokumen
                    </label>
                    <input
                      type="text"
                      list="jenisDokumenList"
                      value={jenisDokumen}
                      placeholder="Pilih atau ketik (contoh: Laporan Bulanan)"
                      onChange={e => setJenisDokumen(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                    />
                    <datalist id="jenisDokumenList">
                      <option value="Laporan Bulanan" />
                      <option value="Laporan Akhir" />
                      <option value="Laporan Antara" />
                      <option value="Laporan Harian" />
                      <option value="Laporan Mingguan" />
                      <option value="Kerangka Acuan Kerja (KAK)" />
                      <option value="Berita Acara (BAST)" />
                      <option value="Dokumen Teknis" />
                      <option value="Laporan Kerja" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Periode Laporan
                    </label>
                    <input
                      type="month"
                      value={parseToMonthInput(periodeLaporan)}
                      onChange={e => {
                        const val = e.target.value;
                        setPeriodeLaporan(val ? formatMonthYearToIndonesian(val) : '');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors cursor-pointer"
                    />
                    {periodeLaporan && (
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Terpilih: <strong>{periodeLaporan}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || (!isEdit && files.length === 0)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center min-w-[130px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>Memproses...</span>
                  </span>
                ) : isEdit ? (
                  'Simpan Perubahan'
                ) : files.length > 1 ? (
                  `Unggah ${files.length} Dokumen`
                ) : (
                  'Unggah Dokumen'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
