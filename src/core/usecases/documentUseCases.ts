import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentAccessUser } from '../domain/document';

export class DocumentUseCases {
  constructor(private docRepo: IDocumentRepository) {}

  async fetchDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse> {
    return await this.docRepo.getDocuments(params);
  }

  async saveDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    if (data.id) {
      return await this.docRepo.updateDocument(data.id, data);
    } else {
      return await this.docRepo.createDocument(data);
    }
  }

  async deleteDocument(id: string): Promise<{ ok: boolean; message?: string }> {
    return await this.docRepo.deleteDocument(id);
  }

  async downloadDocument(id: string): Promise<Blob> {
    return await this.docRepo.downloadDocument(id);
  }

  async fetchShares(documentId: string): Promise<DocumentAccessUser[]> {
    return await this.docRepo.getShares(documentId);
  }

  async shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }> {
    return await this.docRepo.shareDocument(documentId, username);
  }

  async revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }> {
    return await this.docRepo.revokeShare(documentId, targetUserId);
  }
}
