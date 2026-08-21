export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName?: string | null;
  role: string;
  bidangId?: number | null;
  bidang?: string | null;
  isApproved?: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  fullName?: string;
  password?: string;
  roleId: number;
  bidangId?: number | null;
  bidang?: string;
  isApproved?: boolean;
}

export interface UpdateUserDto {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  password?: string;
  roleId: number;
  bidangId?: number | null;
  bidang?: string;
  isApproved?: boolean;
}

export interface ApproveUserDto {
  id: string;
  bidangId?: number | null;
  bidang: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}
