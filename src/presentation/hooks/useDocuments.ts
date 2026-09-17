'use client';

import { useState, useCallback } from 'react';
import { documentRepository } from '@/infrastructure/repositories/DocumentRepository';
import { DocumentUseCases } from '@/core/usecases/documentUseCases';
import { Document, DocumentAccessUser, SaveDocumentDto } from '@/core/domain/document';

const docUseCases = new DocumentUseCases(documentRepository);

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [namaTenagaAhli, setNamaTenagaAhli] = useState<string>('');
  const [jenisDokumen, setJenisDokumen] = useState<string>('');
  const [periodeLaporan, setPeriodeLaporan] = useState<string>('');
  const [bidang, setBidang] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocuments = useCallback(async (overrides?: { page?: number; searchKey?: string; tenagaAhli?: string; jenisDok?: string; periode?: string; bidang?: string }) => {
    setLoading(true);
    const page = overrides?.page ?? currentPage;
    const searchKey = overrides?.searchKey ?? keyword;
    const tenagaAhli = overrides?.tenagaAhli ?? namaTenagaAhli;
    const jenisDok = overrides?.jenisDok ?? jenisDokumen;
    const periode = overrides?.periode ?? periodeLaporan;
    const filterBidang = overrides?.bidang ?? bidang;

    try {
      const res = await docUseCases.fetchDocuments({
        pageNumber: page,
        pageSize: 10,
        keyword: searchKey,
        namaTenagaAhli: tenagaAhli,
        jenisDokumen: jenisDok,
        periodeLaporan: periode,
        bidang: filterBidang,
      });

      if (res.sukses) {
        const docList = res.data.data || [];
        setDocuments(docList);
        const total = Math.ceil(res.data.totalRecords / res.data.pageSize) || 1;
        setTotalPages(total);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, keyword, namaTenagaAhli, jenisDokumen, periodeLaporan, bidang]);

  const saveDocument = async (dto: SaveDocumentDto) => {
    const res = await docUseCases.saveDocument(dto);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const deleteDocument = async (id: string) => {
    const res = await docUseCases.deleteDocument(id);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const downloadDocument = async (id: string, fileName?: string) => {
    // 1. Buka window tab baru segera saat user klik untuk mencegah popup blocker
    const newWindow = typeof window !== 'undefined' ? window.open('', '_blank') : null;
    if (newWindow) {
      try {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html lang="id">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>${fileName || 'Memuat Dokumen...'} - SIAP</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  background-color: #f8fafc;
                  color: #334155;
                }
                .loader {
                  width: 36px;
                  height: 36px;
                  border: 3px solid #e2e8f0;
                  border-top-color: #4f46e5;
                  border-radius: 50%;
                  animation: spin 0.8s linear infinite;
                  margin-bottom: 14px;
                }
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
                .title { font-size: 14px; font-weight: 600; margin: 0 0 4px; color: #0f172a; }
                .subtitle { font-size: 12px; color: #64748b; margin: 0; }
              </style>
            </head>
            <body>
              <div class="loader"></div>
              <p class="title">Membuka berkas dokumen...</p>
              <p class="subtitle">${fileName || 'Harap tunggu beberapa detik'}</p>
            </body>
          </html>
        `);
      } catch {
        // Abaikan jika penulisan awal tidak didukung
      }
    }

    try {
      const blob = await docUseCases.downloadDocument(id, true);

      // Tentukan MIME type yang tepat agar browser merender dokumen langsung di tab
      const isPdf = fileName?.toLowerCase().endsWith('.pdf') || blob.type === 'application/pdf';
      const isImage = /\.(jpe?g|png|webp|gif|svg)$/i.test(fileName || '') || blob.type.startsWith('image/');

      const resolvedType = isPdf ? 'application/pdf' : (isImage ? (blob.type || 'image/jpeg') : blob.type);
      const viewableBlob = new Blob([blob], { type: resolvedType });
      const url = URL.createObjectURL(viewableBlob);

      if (newWindow && !newWindow.closed) {
        if (isPdf || isImage) {
          // Navigasi tingkat atas ke Blob URL mengaktifkan PDF Viewer native peramban (tanpa terunduh otomatis)
          newWindow.location.replace(url);
        } else {
          // Untuk file non-viewable (misal .docx, .xlsx, .zip), tutup tab sementara dan unduh berkas
          newWindow.close();
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName || 'dokumen';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        // Fallback jika tab baru diblokir popup blocker
        if (isPdf || isImage) {
          window.open(url, '_blank');
        } else {
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName || 'dokumen';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      }

      // Pertahankan object URL selama 5 menit agar tab PDF tidak rusak saat dibaca
      setTimeout(() => URL.revokeObjectURL(url), 300000);
    } catch (err) {
      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }
      throw err;
    }
  };

  const fetchShares = async (documentId: string): Promise<DocumentAccessUser[]> => {
    return await docUseCases.fetchShares(documentId);
  };

  const shareDocument = async (documentId: string, username: string) => {
    const res = await docUseCases.shareDocument(documentId, username);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const revokeShare = async (documentId: string, targetUserId: string) => {
    const res = await docUseCases.revokeShare(documentId, targetUserId);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  return {
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
  };
}
