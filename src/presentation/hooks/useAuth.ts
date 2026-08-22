'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authRepository } from '@/infrastructure/repositories/AuthRepository';
import { AuthUseCases } from '@/core/usecases/authUseCases';
import { LoginRequest, RegisterRequest } from '@/core/domain/auth';
import { userRepository } from '@/infrastructure/repositories/UserRepository';

const authUseCases = new AuthUseCases(authRepository);

export function useAuth(requireAuth = false, requireAdmin = false) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [bidangId, setBidangId] = useState<number | null>(null);
  const [bidang, setBidang] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(() => {
    const auth = authUseCases.getAuthState();
    setToken(auth.token);
    setRole(auth.role);
    setUser(auth.user);
    setBidangId(auth.bidangId);
    setBidang(auth.bidang);
    setIsApproved(auth.isApproved);
    setIsAdmin(auth.isAdmin);

    if (requireAuth && !auth.token) {
      router.push('/login?reason=expired');
      return false;
    }

    if (requireAdmin && (!auth.token || !auth.isAdmin)) {
      router.push(auth.token ? '/chat' : '/login?reason=expired');
      return false;
    }

    return true;
  }, [requireAuth, requireAdmin, router]);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const updatedUser = await userRepository.getProfile();
      if (updatedUser) {
        authRepository.setAuth(token, updatedUser.role || role || 'user', updatedUser);
        checkAuth();
      }
    } catch (error) {
      console.error('Failed to refresh profile', error);
    }
  }, [token, role, checkAuth]);

  useEffect(() => {
    checkAuth();
    setIsLoading(false);

    // Periodic check every 10 seconds for token expiration
    const interval = setInterval(() => {
      checkAuth();
    }, 10000);

    return () => clearInterval(interval);
  }, [checkAuth, pathname]);

  const login = async (credentials: LoginRequest) => {
    const result = await authUseCases.login(credentials);
    if (result.token) {
      const auth = authUseCases.getAuthState();
      setToken(auth.token);
      setRole(auth.role);
      setUser(auth.user);
      setBidangId(auth.bidangId);
      setBidang(auth.bidang);
      setIsApproved(auth.isApproved);
      setIsAdmin(auth.isAdmin);
    }
    return result;
  };

  const googleLogin = async (idToken: string) => {
    const result = await authUseCases.googleLogin(idToken);
    if (result.token) {
      const auth = authUseCases.getAuthState();
      setToken(auth.token);
      setRole(auth.role);
      setUser(auth.user);
      setBidangId(auth.bidangId);
      setBidang(auth.bidang);
      setIsApproved(auth.isApproved);
      setIsAdmin(auth.isAdmin);
    }
    return result;
  };

  const register = async (data: RegisterRequest) => {
    return await authUseCases.register(data);
  };

  const logout = () => {
    authUseCases.logout();
    setToken(null);
    setRole(null);
    setUser(null);
    setBidangId(null);
    setBidang(null);
    setIsApproved(false);
    setIsAdmin(false);
    router.push('/login');
  };

  const isPendingApproval = !isAdmin && !isApproved;

  return {
    token,
    role,
    user,
    bidangId,
    bidang,
    isApproved,
    isAdmin,
    isPendingApproval,
    isLoading,
    login,
    googleLogin,
    register,
    logout,
    checkAuth,
    refreshProfile,
  };
}
