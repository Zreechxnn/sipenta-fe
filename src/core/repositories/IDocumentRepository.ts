import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentChunk, DocumentAccessUser } from '../domain/document';

export interface IDocumentRepository {
  getDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse>;
  createDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }>;
  updateDocument(id: string, data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }>;
  deleteDocument(id: string): Promise<{ ok: boolean; message?: string }>;
  downloadDocument(id: string): Promise<Blob>;
  getChunks(id: string): Promise<DocumentChunk[]>;
  updateChunk(documentId: string, chunkId: string, content: string): Promise<{ ok: boolean; message?: string }>;

  // Document Sharing
  getShares(documentId: string): Promise<DocumentAccessUser[]>;
  shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }>;
  revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }>;
}
