'use client';

import { useState, useCallback } from 'react';
import { userRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/core/usecases/userUseCases';
import { UserAccount, CreateUserDto, UpdateUserDto } from '@/core/domain/user';

const userUseCases = new UserUseCases(userRepository);

export function useUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userUseCases.fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (dto: CreateUserDto) => {
    const res = await userUseCases.createUser(dto);
    if (res.ok) fetchUsers();
    return res;
  };

  const updateUser = async (dto: UpdateUserDto) => {
    const res = await userUseCases.updateUser(dto);
    if (res.ok) fetchUsers();
    return res;
  };

  const approveUser = async (id: string, bidang: string) => {
    const res = await userUseCases.approveUser(id, bidang);
    if (res.ok) fetchUsers();
    return res;
  };

  const deleteUser = async (id: string) => {
    const res = await userUseCases.deleteUser(id);
    if (res.ok) fetchUsers();
    return res;
  };

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    approveUser,
    deleteUser,
  };
}
