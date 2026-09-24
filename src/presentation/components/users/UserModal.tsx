'use client';

import React, { useState, useEffect } from 'react';
import { UserAccount, CreateUserDto, UpdateUserDto } from '@/core/domain/user';
import { useBidangs } from '@/presentation/hooks/useBidangs';

interface UserModalProps {
  isOpen: boolean;
  editingUser: UserAccount | null;
  onClose: () => void;
  onCreate: (dto: CreateUserDto) => Promise<{ ok: boolean; message?: string }>;
  onUpdate: (dto: UpdateUserDto) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
}

import { useAuth } from '@/presentation/hooks/useAuth';

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onCreate,
  onUpdate,
  showToast,
}) => {
  const { user: currentUser, role: userRole, bidang: userBidang } = useAuth();
  const { bidangs } = useBidangs(isOpen);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number>(3);
  const [bidang, setBidang] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const isAdmin = userRole === 'admin';
  const isKepalaBidang = userRole === 'kepala bidang' || userRole === 'kepala bagian' || userRole === 'kasubag';

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName || '');
      setUsername(editingUser.username || '');
      setEmail(editingUser.email || '');
      setPassword('');
      let currentRoleId = 3;
      if (editingUser.role?.toLowerCase() === 'admin') currentRoleId = 2;
      else if (editingUser.role?.toLowerCase() === 'kepala bidang' || editingUser.role?.toLowerCase() === 'kepala bagian' || editingUser.role?.toLowerCase() === 'kasubag') currentRoleId = 1;
      setRoleId(currentRoleId);
      setBidang(isKepalaBidang ? (userBidang || '') : (editingUser.bidang || ''));
      setIsApproved(editingUser.isApproved ?? true);
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRoleId(3);
      setBidang(isKepalaBidang ? (userBidang || '') : '');
      setIsApproved(true);
    }
  }, [editingUser, bidangs, isKepalaBidang, userBidang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const isEdit = !!editingUser;

  const handleBidangChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'ADD_NEW') {
      const newBidangName = window.prompt('Masukkan nama bidang baru:');
      if (!newBidangName) {
        setBidang(''); // revert to empty if cancelled
        return;
      }
      try {
        setLoading(true);
        const { authFetch, API_ENDPOINTS } = await import('@/infrastructure/api/apiClient');
        const res = await authFetch(`${API_ENDPOINTS.BIDANG}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nama: newBidangName, kode: newBidangName.substring(0, 5).toUpperCase(), deskripsi: newBidangName })
        });
        if (res.ok) {
          const data = await res.json();
          const createdName = data.data?.nama || newBidangName;
          showToast('Bidang berhasil ditambahkan');
          setBidang(createdName);
          window.location.reload();
        } else {
          const err = await res.json();
          showToast(err.message || 'Gagal menambahkan bidang', true);
          setBidang('');
        }
      } catch (err: any) {
        showToast(err.message || 'Terjadi kesalahan', true);
        setBidang('');
      } finally {
        setLoading(false);
      }
    } else {
      setBidang(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalBidang = bidang;
    if (isKepalaBidang) {
      finalBidang = userBidang || '';
    }

    const finalRoleId = isKepalaBidang ? 3 : roleId;

    try {
      if (isEdit) {
        const dto: UpdateUserDto = {
          id: editingUser.id,
          fullName,
          username,
          email,
          roleId: finalRoleId,
          bidang: finalBidang || undefined,
          isApproved,
        };
        if (password) dto.password = password;
        const res = await onUpdate(dto);
        if (res.ok) {
          showToast('Data pengguna berhasil diperbarui!');
          onClose();
        } else {
          showToast(res.message || 'Gagal menyimpan pengguna', true);
        }
      } else {
        const dto: CreateUserDto = {
          fullName,
          username,
          email,
          password,
          roleId: finalRoleId,
          bidang: finalBidang || undefined,
          isApproved,
        };
        const res = await onCreate(dto);
        if (res.ok) {
          showToast('Pengguna berhasil ditambahkan!');
          onClose();
        } else {
          showToast(res.message || 'Gagal menyimpan pengguna', true);
        }
      }
    } catch {
      showToast('Kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={() => !loading && onClose()}
      />
      
      {/* Modal */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl relative animate-scale-up max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Ubah Informasi Pengguna' : 'Pendaftaran Pengguna Baru'}
            </h3>
            <p className="text-xs text-slate-500">Kelola akun dan hak akses pegawai</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="budi_aptika"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="budi@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Bidang Diskominfo
              </label>
              <select
                value={isKepalaBidang ? (currentUser?.bidang || userBidang || '') : bidang}
                onChange={handleBidangChange}
                disabled={isKepalaBidang}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {!isKepalaBidang && <option value="">-- Belum Ditentukan --</option>}
                {isKepalaBidang ? (
                  <option value={currentUser?.bidang || userBidang || ''}>{currentUser?.bidang || userBidang || ''}</option>
                ) : bidangs.length > 0 ? (
                  <>
                    {bidangs.map((b) => (
                      <option key={b.id} value={b.nama}>
                        {b.nama}
                      </option>
                    ))}
                    {isAdmin && <option value="ADD_NEW">+ Tambah Bidang Baru...</option>}
                  </>
                ) : (
                  <>
                    <option value="Bidang APTIKA">Bidang APTIKA</option>
                    <option value="Bidang TIK">Bidang TIK</option>
                    <option value="Bidang IKP">Bidang IKP</option>
                    <option value="Bidang Statistik">Bidang Statistik</option>
                    <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                    <option value="Sekretariat">Sekretariat</option>
                    {isAdmin && <option value="ADD_NEW">+ Tambah Bidang Baru...</option>}
                  </>
                )}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Peran / Hak Akses
                </label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  value={isKepalaBidang ? 3 : roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  disabled={isKepalaBidang}
                  required
                >
                  {isAdmin && (
                    <option value={2}>Admin</option>
                  )}
                  {isAdmin && (
                    <option value={1}>Kepala Bidang (Admin Bidang)</option>
                  )}
                  <option value={3}>Tenaga Ahli</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Status Persetujuan
                </label>
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100/60 transition">
                  <input
                    type="checkbox"
                    checked={isApproved}
                    onChange={(e) => setIsApproved(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    {isApproved ? 'Akun Disetujui (Aktif)' : 'Menunggu Persetujuan'}
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Kata Sandi
                {isEdit && (
                  <span className="font-normal normal-case ml-2 text-[11px] text-slate-400">
                    (kosongkan jika tidak ingin mengubah)
                  </span>
                )}
              </label>
              <input
                type="password"
                required={!isEdit}
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>Menyimpan...</span>
                  </span>
                ) : (
                  'Simpan Pengguna'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
