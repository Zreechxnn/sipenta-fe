import { IAuthRepository } from '../repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../domain/auth';

export class AuthUseCases {
  constructor(private authRepo: IAuthRepository) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await this.authRepo.login(credentials);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const result = await this.authRepo.googleLogin(idToken);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.authRepo.register(data);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'user';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  logout(): void {
    this.authRepo.logout();
  }

  getAuthState(): { token: string | null; role: string | null; isAdmin: boolean; user: any; bidangId: number | null; bidang: string | null; isApproved: boolean } {
    const token = this.authRepo.getToken();
    const role = this.authRepo.getRole();
    const user = this.authRepo.getUser();
    const isAdmin = !!(role && ['super-admin', 'admin', 'kasubag'].includes(role.toLowerCase()));
    const bidangId = user?.bidangId ? Number(user.bidangId) : (typeof window !== 'undefined' && localStorage.getItem('bidangId') ? Number(localStorage.getItem('bidangId')) : null);
    const bidang = user?.bidang || (typeof window !== 'undefined' ? localStorage.getItem('bidang') : null);
    const isApproved = isAdmin || (user?.isApproved ?? (typeof window !== 'undefined' ? localStorage.getItem('isApproved') === 'true' : false));

    return { token, role, isAdmin, user, bidangId, bidang, isApproved };
  }
}
