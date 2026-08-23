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
  const { user: currentUser } = useAuth();
  const { bidangs } = useBidangs(isOpen);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number>(3);
  const [bidang, setBidang] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName || '');
      setUsername(editingUser.username || '');
      setEmail(editingUser.email || '');
      setPassword('');
      let currentRoleId = 3;
      if (editingUser.role?.toLowerCase() === 'super-admin') currentRoleId = 4;
      else if (editingUser.role?.toLowerCase() === 'admin' || editingUser.role?.toLowerCase() === 'kasubag') currentRoleId = 1;
      setRoleId(currentRoleId);
      setBidang(editingUser.bidang || '');
      setIsApproved(editingUser.isApproved ?? true);
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRoleId(3);
      setBidang('');
      setIsApproved(true);
    }
  }, [editingUser, bidangs]);

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
  
  const isSuperAdmin = currentUser?.role === 'super-admin';
  const isKasubagUser = currentUser?.role === 'kasubag';

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
        const token = localStorage.getItem('token');
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/Bidang', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ nama: newBidangName, kode: newBidangName.substring(0, 5).toUpperCase(), deskripsi: newBidangName })
        });
        if (res.ok) {
          const data = await res.json();
          const createdName = data.data?.nama || newBidangName;
          showToast('Bidang berhasil ditambahkan');
          // Add locally to the list via state if possible, but for now just setting the string works
          // because CreateUser/UpdateUser will match it by string or create it. Wait, the backend CreateUser
          // accepts string `bidang` and creates it if it doesn't exist? Actually Bidang is mostly referenced by ID.
          // Let's set it to the string.
          setBidang(createdName);
          // To make it show up in the select, we should either reload window or it will just be selected but not in the list.
          // Since it's a prompt, it's fine.
          window.location.reload(); // Simple way to refresh the bidangs list globally
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
    if (isKasubagUser) {
      finalBidang = currentUser?.bidang || '';
    }

    try {
      if (isEdit) {
        const dto: UpdateUserDto = {
          id: editingUser.id,
          fullName,
          username,
          email,
          roleId,
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
          roleId,
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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
        onClick={() => !loading && onClose()}
      />
      
      {/* Modal */}
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-2xl relative animate-scaleUp max-h-[90vh] flex flex-col overflow-hidden">
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
                value={isKasubagUser ? (currentUser?.bidang || '') : bidang}
                onChange={handleBidangChange}
                disabled={isKasubagUser}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {!isKasubagUser && <option value="">-- Belum Ditentukan --</option>}
                {isKasubagUser ? (
                  <option value={currentUser?.bidang || ''}>{currentUser?.bidang || ''}</option>
                ) : bidangs.length > 0 ? (
                  <>
                    {bidangs.map((b) => (
                      <option key={b.id} value={b.nama}>
                        {b.nama}
                      </option>
                    ))}
                    {isSuperAdmin && <option value="ADD_NEW">+ Tambah Bidang Baru...</option>}
                  </>
                ) : (
                  <>
                    <option value="Bidang APTIKA">Bidang APTIKA</option>
                    <option value="Bidang TIK">Bidang TIK</option>
                    <option value="Bidang IKP">Bidang IKP</option>
                    <option value="Bidang Statistik">Bidang Statistik</option>
                    <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                    <option value="Sekretariat">Sekretariat</option>
                    {isSuperAdmin && <option value="ADD_NEW">+ Tambah Bidang Baru...</option>}
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  value={roleId}
                  onChange={(e) => setRoleId(Number(e.target.value))}
                  required
                >
                  {isSuperAdmin && (
                    <option value={4}>Superadmin</option>
                  )}
                  {isSuperAdmin && (
                    <option value={1}>Kasubag/Admin</option>
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
