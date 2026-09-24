'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { UserTable } from '@/presentation/components/users/UserTable';
import { UserModal } from '@/presentation/components/users/UserModal';
import { ApproveUserModal } from '@/presentation/components/users/ApproveUserModal';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useUsers } from '@/presentation/hooks/useUsers';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { useToast } from '@/presentation/hooks/useToast';
import { UserAccount } from '@/core/domain/user';

export default function UsersPage() {
  const { isLoading: authLoading, role: currentRole, bidang: currentBidang } = useAuth(true, true);
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { users, loading: usersLoading, fetchUsers, createUser, updateUser, approveUser, deleteUser } = useUsers();
  const { bidangs } = useBidangs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [approvingUser, setApprovingUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [bidangFilter, setBidangFilter] = useState<string>('all');

  const handleUserChange = useCallback((event: string, data?: any) => {
    fetchUsers();
    if (event === 'UserRegistered') {
      const username = data?.username || 'baru';
      showToast(`Pengguna baru @${username} mendaftar dan membutuhkan persetujuan!`);
    } else if (event === 'UserCreated') {
      showToast('Pengguna baru telah ditambahkan!');
    } else if (event === 'UserUpdated') {
      showToast('Data pengguna diperbarui!');
    } else if (event === 'UserDeleted') {
      showToast('Pengguna telah dihapus!');
    }
  }, [fetchUsers, showToast]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, handleUserChange);

  useEffect(() => {
    if (!authLoading) {
      fetchUsers();
    }
  }, [authLoading, fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const isAdmin = ['admin', 'kepala bidang', 'kepala bagian', 'kasubag'].includes(u.role?.toLowerCase() || '');
      const isApproved = isAdmin || u.isApproved;

      if (statusFilter === 'pending' && isApproved) return false;
      if (statusFilter === 'approved' && !isApproved) return false;

      if (bidangFilter !== 'all') {
        if (bidangFilter === 'unassigned') {
          if (u.bidang) return false;
        } else if (u.bidang !== bidangFilter) {
          return false;
        }
      }

      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = u.fullName?.toLowerCase().includes(kw);
        const matchUsername = u.username.toLowerCase().includes(kw);
        const matchEmail = u.email.toLowerCase().includes(kw);
        const matchBidang = u.bidang?.toLowerCase().includes(kw);
        if (!matchName && !matchUsername && !matchEmail && !matchBidang) return false;
      }

      return true;
    });
  }, [users, statusFilter, bidangFilter, searchKeyword]);

  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter((u) => !['admin', 'kepala bidang', 'kepala bagian', 'kasubag'].includes(u.role?.toLowerCase() || '') && !u.isApproved).length;
    const approved = total - pending;
    return { total, pending, approved };
  }, [users]);

  if (authLoading) return null;

  const isAdmin = currentRole === 'admin';
  const isBidangAdmin = currentRole === 'kepala bidang' || currentRole === 'kepala bagian' || currentRole === 'kasubag';

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenApprove = (user: UserAccount) => {
    setApprovingUser(user);
  };

  const handleDeleteClick = (id: string) => {
    const target = users.find(u => u.id === id);
    setUserToDelete({
      id,
      name: target?.fullName || target?.username || 'Pengguna',
    });
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(userToDelete.id);
      if (res.ok) {
        showToast('Pengguna berhasil dihapus');
      } else {
        showToast(res.message || 'Gagal menghapus pengguna', true);
      }
    } catch {
      showToast('Kesalahan saat menghapus pengguna', true);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {isBidangAdmin ? `Manajemen Tenaga Ahli (${currentBidang || 'Admin Bidang'})` : 'Manajemen Pengguna & Bidang'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isBidangAdmin
                ? `Verifikasi pendaftaran calon tenaga ahli baru dan kelola akun pada ${currentBidang || 'bidang Anda'}.`
                : 'Verifikasi pendaftaran pengguna baru, atur penempatan bidang Diskominfo, dan kelola hak akses.'}
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 shrink-0 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <i className="fas fa-user-plus text-xs"></i>
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <i className="fa-solid fa-users text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengguna</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('pending')}
            className={`rounded-2xl border p-4.5 shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
              statusFilter === 'pending'
                ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20'
                : 'border-slate-200/80 bg-white hover:border-amber-300'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <i className="fa-solid fa-clock-rotate-left text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Menunggu Persetujuan</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-amber-900">{stats.pending}</p>
                {stats.pending > 0 && (
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full animate-pulse">
                    Perlu Tindakan
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('approved')}
            className={`rounded-2xl border p-4.5 shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
              statusFilter === 'approved'
                ? 'border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-400/20'
                : 'border-slate-200/80 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <i className="fa-solid fa-circle-check text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Aktif / Disetujui</p>
              <p className="text-xl font-bold text-emerald-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama, username, email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 w-full md:w-auto shrink-0 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Menunggu</span>
                {stats.pending > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${statusFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'}`}>
                    {stats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Disetujui ({stats.approved})
              </button>
            </div>

            {/* Bidang Dropdown / Badge */}
            {isAdmin ? (
              <div className="w-full md:w-56 shrink-0">
                <select
                  value={bidangFilter}
                  onChange={(e) => setBidangFilter(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-medium"
                >
                  <option value="all">Semua Bidang</option>
                  <option value="unassigned">-- Belum Ada Bidang --</option>
                  {bidangs.length > 0 ? (
                    bidangs.map((b) => (
                      <option key={b.id} value={b.nama}>
                        {b.nama}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Bidang APTIKA">Bidang APTIKA</option>
                      <option value="Bidang TIK">Bidang TIK</option>
                      <option value="Bidang IKP">Bidang IKP</option>
                      <option value="Bidang Statistik">Bidang Statistik</option>
                      <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                      <option value="Sekretariat">Sekretariat</option>
                    </>
                  )}
                </select>
              </div>
            ) : (
              <div className="w-full md:w-auto px-3.5 py-2 rounded-xl bg-indigo-50/80 border border-indigo-100/80 text-xs font-semibold text-indigo-900 flex items-center gap-2 shrink-0">
                <i className="fa-solid fa-building text-indigo-600"></i>
                <span>{currentBidang || 'Bidang Anda'}</span>
              </div>
            )}
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <UserTable
            users={filteredUsers}
            isLoading={usersLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
            onApproveClick={handleOpenApprove}
          />
        </div>
      </main>

      {/* User Add / Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        onClose={() => setIsModalOpen(false)}
        onCreate={createUser}
        onUpdate={updateUser}
        showToast={showToast}
      />

      {/* Approve User Modal */}
      <ApproveUserModal
        isOpen={!!approvingUser}
        user={approvingUser}
        onClose={() => setApprovingUser(null)}
        onApprove={approveUser}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menghapus akun pengguna ini? Tindakan ini permanen dan pengguna tidak akan dapat login kembali."
        itemName={userToDelete?.name}
        confirmText="Hapus Pengguna"
        cancelText="Batal"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setUserToDelete(null)}
      />

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
