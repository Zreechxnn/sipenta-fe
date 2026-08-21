import { IBidangRepository } from '../repositories/IBidangRepository';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '../domain/bidang';

export class BidangUseCases {
  constructor(private repo: IBidangRepository) {}

  async getAllBidangs(): Promise<Bidang[]> {
    return this.repo.getAll();
  }

  async getBidangById(id: number): Promise<Bidang> {
    return this.repo.getById(id);
  }

  async createBidang(dto: CreateBidangDto): Promise<Bidang> {
    return this.repo.create(dto);
  }

  async updateBidang(id: number, dto: UpdateBidangDto): Promise<Bidang> {
    return this.repo.update(id, dto);
  }

  async deleteBidang(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}
