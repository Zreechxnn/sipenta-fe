import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '../domain/user';

export interface IUserRepository {
  getUsers(): Promise<UserAccount[]>;
  createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }>;
  updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }>;
  approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }>;
  deleteUser(id: string): Promise<{ ok: boolean; message?: string }>;
  getProfile(): Promise<UserAccount>;
  updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }>;
  searchUsers(query: string): Promise<UserAccount[]>;
}
