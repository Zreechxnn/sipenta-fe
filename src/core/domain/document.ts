export interface DocumentAccessUser {
  id: string;
  userId: string;
  username: string;
  fullName?: string | null;
  email?: string | null;
  bidangId?: number | null;
  bidang?: string | null;
  accessLevel: string;
  createdAt: string;
}

export interface Document {
  id: string;
  nama?: string;
  namaFile?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string;
  bidangId?: number | null;
  bidang?: string | null;
  bidangKode?: string | null;
  ukuran?: number;
  mimeType?: string;
  tanggalUpload?: string;
  userId?: string | null;
  uploaderUsername?: string | null;
  uploaderFullName?: string | null;
  isOwner?: boolean;
  isSharedWithMe?: boolean;
  sharedWith?: DocumentAccessUser[];
}

export interface DocumentChunk {
  id?: string;
  Id?: string;
  content?: string;
  Content?: string;
  preview?: string;
  Preview?: string;
  teks?: string;
  Teks?: string;
}

export interface DocumentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string;
  bidangId?: number;
  bidang?: string;
}

export interface DocumentPagedResponse {
  sukses: boolean;
  pesan?: string;
  data: {
    data: Document[];
    totalRecords: number;
    pageSize: number;
    pageNumber: number;
  };
}

export interface SaveDocumentDto {
  id?: string;
  nama?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string | null;
  bidangId?: number | null;
  bidang?: string | null;
  files?: FileList | File[];
}

export interface ShareDocumentDto {
  documentId: string;
  username: string;
}
