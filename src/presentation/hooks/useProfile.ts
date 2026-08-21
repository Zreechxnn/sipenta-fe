'use client';

import { useState, useCallback } from 'react';
import { userRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/core/usecases/userUseCases';
import { UserAccount, UpdateProfileDto } from '@/core/domain/user';

const userUseCases = new UserUseCases(userRepository);

export function useProfile() {
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userUseCases.getProfile();
      setProfile(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat profil';
      setError(msg);
      console.error('Failed to fetch profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (dto: UpdateProfileDto) => {
    setSaving(true);
    setError(null);
    try {
      const res = await userUseCases.updateProfile(dto);
      if (res.ok && res.user) {
        setProfile(res.user);
      } else if (res.ok) {
        await fetchProfile();
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile,
    updateProfile,
    setProfile,
  };
}
