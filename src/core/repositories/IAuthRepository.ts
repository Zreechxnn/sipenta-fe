import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../domain/auth';

export interface IAuthRepository {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  googleLogin(idToken: string): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<RegisterResponse>;
  getToken(): string | null;
  getRole(): string | null;
  getUser(): any;
  setAuth(token: string, role: string, user?: any, expiresAt?: string): void;
  refreshToken(): Promise<boolean>;
  logout(): void;
}
