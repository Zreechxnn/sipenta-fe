export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string | null;
  role: string;
  bidangId?: number | null;
  bidang?: string | null;
  isApproved?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  Token?: string;
  TOKEN?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string | null;
    role?: string;
    Role?: string;
    bidangId?: number | null;
    bidang?: string | null;
    isApproved?: boolean;
  };
  User?: {
    Role?: string;
    BidangId?: number | null;
    Bidang?: string | null;
    IsApproved?: boolean;
  };
  message?: string;
  isLockedOut?: boolean;
  retryAfterSeconds?: number;
  remainingAttempts?: number;
  [key: string]: any;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName?: string;
  password: string;
}

export interface RegisterResponse {
  token?: string;
  Token?: string;
  TOKEN?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string | null;
    role?: string;
    Role?: string;
    bidangId?: number | null;
    bidang?: string | null;
    isApproved?: boolean;
    createdAt?: string;
  };
  User?: {
    Role?: string;
    BidangId?: number | null;
    Bidang?: string | null;
    IsApproved?: boolean;
  };
  sukses?: boolean;
  pesan?: string;
  message?: string;
  [key: string]: any;
}
