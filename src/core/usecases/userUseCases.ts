import { IUserRepository } from '../repositories/IUserRepository';
import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '../domain/user';

export class UserUseCases {
  constructor(private userRepo: IUserRepository) {}

  async fetchUsers(): Promise<UserAccount[]> {
    return await this.userRepo.getUsers();
  }

  async createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.createUser(dto);
  }

  async updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.updateUser(dto);
  }

  async approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.approveUser(id, bidang);
  }

  async deleteUser(id: string): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.deleteUser(id);
  }

  async getProfile(): Promise<UserAccount> {
    return await this.userRepo.getProfile();
  }

  async updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }> {
    return await this.userRepo.updateProfile(dto);
  }
}
