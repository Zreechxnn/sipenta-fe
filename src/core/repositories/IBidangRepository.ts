import { Bidang, CreateBidangDto, UpdateBidangDto } from '../domain/bidang';

export interface IBidangRepository {
  getAll(): Promise<Bidang[]>;
  getById(id: number): Promise<Bidang>;
  create(dto: CreateBidangDto): Promise<Bidang>;
  update(id: number, dto: UpdateBidangDto): Promise<Bidang>;
  delete(id: number): Promise<boolean>;
}
