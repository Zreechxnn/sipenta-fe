import { IAuthRepository } from '../repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../domain/auth';

export class AuthUseCases {
  constructor(private authRepo: IAuthRepository) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await this.authRepo.login(credentials);
    const token = result.token || result.Token || result.TOKEN || '';
    if (token || result.user || result.User) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(token, userRole, user, result.expiresAt || result.ExpiresAt, result.refreshToken || result.RefreshToken);
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const result = await this.authRepo.googleLogin(idToken);
    const token = result.token || result.Token || result.TOKEN || '';
    if (token || result.user || result.User) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(token, userRole, user, result.expiresAt || result.ExpiresAt, result.refreshToken || result.RefreshToken);
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.authRepo.register(data);
    const token = result.token || result.Token || result.TOKEN || '';
    if (token || result.user || result.User) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'user';
      this.authRepo.setAuth(token, userRole, user, result.expiresAt || result.ExpiresAt, result.refreshToken || result.RefreshToken);
    }
    return result;
  }

  async refreshToken(): Promise<boolean> {
    return await this.authRepo.refreshToken();
  }

  logout(): void {
    this.authRepo.logout();
  }

  getAuthState(): { token: string | null; role: string | null; isAdmin: boolean; user: any; bidangId: number | null; bidang: string | null; isApproved: boolean } {
    const token = this.authRepo.getToken();
    const role = this.authRepo.getRole();
    const user = this.authRepo.getUser();
    const isAdmin = !!(role && ['admin', 'kepala bidang', 'kepala bagian', 'kasubag'].includes(role.toLowerCase()));
    const bidangId = user?.bidangId ? Number(user.bidangId) : null;
    const bidang = user?.bidang || null;
    const isApproved = isAdmin || (user?.isApproved ?? false);

    return { token, role, isAdmin, user, bidangId, bidang, isApproved };
  }
}
