export interface Bidang {
  id: number;
  nama: string;
  kode?: string;
  deskripsi?: string;
  userCount?: number;
  documentCount?: number;
  createdAt?: string;
}

export interface CreateBidangDto {
  nama: string;
  kode?: string;
  deskripsi?: string;
}

export interface UpdateBidangDto {
  nama: string;
  kode?: string;
  deskripsi?: string;
}
