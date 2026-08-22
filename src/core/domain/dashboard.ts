export interface DocumentsByBidang {
  bidangName: string;
  count: number;
}

export interface RecentDocument {
  id: string;
  nama: string;
  uploaderName: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalUsers: number;
  pendingUsers: number;
  totalDocuments: number;
  totalStorageBytes: number;
  documentsByBidang: DocumentsByBidang[];
  recentDocuments: RecentDocument[];
}
