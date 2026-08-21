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
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<div style="font-family:sans-serif;padding:20px;text-align:center;">Memuat dokumen, harap tunggu...</div>');
    }

    try {
      const blob = await docUseCases.downloadDocument(id);
      const url = URL.createObjectURL(blob);
      
      if (newWindow) {
        newWindow.document.body.innerHTML = `
          <body style="margin:0;padding:0;overflow:hidden;">
            <embed src="${url}" type="application/pdf" width="100%" height="100%" style="border:none;" />
          </body>
        `;
        newWindow.document.title = fileName || 'Dokumen';
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      if (newWindow) newWindow.close();
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
