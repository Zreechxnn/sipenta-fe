'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, DocumentAccessUser } from '@/core/domain/document';
import { UserAccount } from '@/core/domain/user';
import { userRepository } from '@/infrastructure/repositories/UserRepository';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface ShareDocumentModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onShare: (documentId: string, username: string) => Promise<{ ok: boolean; message?: string }>;
  onRevoke: (documentId: string, targetUserId: string) => Promise<{ ok: boolean; message?: string }>;
  fetchShares: (documentId: string) => Promise<DocumentAccessUser[]>;
  lastSignalREvent?: { event: string; data?: any } | null;
}

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  document,
  onClose,
  onShare,
  onRevoke,
  fetchShares,
  lastSignalREvent,
}) => {
  const [username, setUsername] = useState('');
  const [searchResults, setSearchResults] = useState<UserAccount[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [shares, setShares] = useState<DocumentAccessUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadShares = async () => {
    if (!document?.id) return;
    setLoading(true);
    try {
      const data = await fetchShares(document.id);
      setShares(data || []);
    } catch (err) {
      console.error('Failed to load shares:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && document?.id) {
      setUsername('');
      setSearchResults([]);
      setShowDropdown(false);
      setFeedback(null);
      loadShares();
    }
  }, [isOpen, document?.id]);

  // Real-time synchronization when access changes via SignalR
  useEffect(() => {
    if (isOpen && document?.id && lastSignalREvent) {
      const docId = lastSignalREvent.data?.documentId || lastSignalREvent.data?.DocumentId;
      if (
        (lastSignalREvent.event === 'DocumentShared' || lastSignalREvent.event === 'DocumentAccessRevoked') &&
        (!docId || String(docId).toLowerCase() === String(document.id).toLowerCase())
      ) {
        loadShares();
      }
    }
  }, [lastSignalREvent, isOpen, document?.id]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (value.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await userRepository.searchUsers(value.trim());
        // Filter out users who already have access
        const filteredResults = results.filter(u => !shares.some(s => s.userId === u.id));
        setSearchResults(filteredResults);
      } catch (err) {
        console.error('Failed to search users', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const selectUser = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setShowDropdown(false);
  };

  if (!isOpen || !document) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !document.id) return;

    setSubmitting(true);
    setFeedback(null);

    const cleanUsername = username.trim().replace(/^@/, '');
    const res = await onShare(document.id, cleanUsername);

    if (res.ok) {
      setFeedback({
        type: 'success',
        text: res.message || `Akses berhasil diberikan kepada @${cleanUsername}`,
      });
      setUsername('');
      await loadShares();
    } else {
      setFeedback({
        type: 'error',
        text: res.message || 'Gagal membagikan dokumen',
      });
    }
    setSubmitting(false);
  };

  const handleRevoke = async (targetUserId: string, targetUsername: string) => {
    if (!document.id) return;
    if (!confirm(`Hapus akses baca untuk @${targetUsername}?`)) return;

    setRevokingId(targetUserId);
    setFeedback(null);

    const res = await onRevoke(document.id, targetUserId);
    if (res.ok) {
      setFeedback({
        type: 'success',
        text: `Akses @${targetUsername} berhasil dicabut`,
      });
      await loadShares();
    } else {
      setFeedback({
        type: 'error',
        text: res.message || 'Gagal mencabut akses',
      });
    }
    setRevokingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <i className="fa-solid fa-user-plus text-base"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">
                Bagikan Dokumen
              </h3>
              <p className="text-xs text-slate-500 truncate" title={document.nama || document.namaFile}>
                {document.nama || document.namaFile}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Feedback banner */}
          {feedback && (
            <div
              className={`flex items-start gap-2.5 p-3 rounded-xl text-xs font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <i
                className={`fa-solid ${
                  feedback.type === 'success' ? 'fa-circle-check text-emerald-600' : 'fa-circle-exclamation text-rose-600'
                } mt-0.5`}
              ></i>
              <span className="flex-1">{feedback.text}</span>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          {/* Form share by username */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Beri Akses ke Pengguna Lain
            </label>
            <form onSubmit={handleShare} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-semibold text-sm">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  onFocus={() => { if (username.length >= 2) setShowDropdown(true); }}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Ketik username (contoh: budi_aptika)"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-center text-xs text-slate-500">
                        <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 mr-2"></i>Mencari...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <ul>
                        {searchResults.map((user) => (
                          <li
                            key={user.id}
                            className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                            onClick={() => selectUser(user.username)}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-slate-800">{user.fullName || user.username}</span>
                              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                <span className="mr-2">@{user.username}</span>
                                {user.bidang && (
                                  <span className={`inline-flex rounded px-1.5 py-0.2 text-[9px] font-medium ${BIDANG_COLORS[user.bidang]?.bg || 'bg-slate-100'} border ${BIDANG_COLORS[user.bidang]?.border || 'border-slate-200'}`}>
                                    {user.bidang}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : username.length >= 2 ? (
                      <div className="p-3 text-center text-xs text-slate-500">
                        Pengguna tidak ditemukan atau sudah memiliki akses.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={submitting || !username.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-plus text-xs"></i>
                    <span>Beri Akses</span>
                  </>
                )}
              </button>
            </form>
            <p className="mt-1.5 text-[11px] text-slate-500">
              <i className="fa-solid fa-circle-info mr-1 text-indigo-500"></i>
              Tenaga ahli / pengguna yang diberi akses dapat <strong>membaca laporan</strong> dan <strong>menanyakannya ke Asisten AI</strong> meskipun berada di bidang yang berbeda.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center justify-between">
              <span>Pengguna yang Memiliki Akses</span>
              <span className="text-[11px] font-normal text-slate-400">
                {shares.length} pengguna
              </span>
            </h4>

            {loading ? (
              <div className="py-8 text-center text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-indigo-500"></i>
                <p className="text-xs">Memuat daftar akses...</p>
              </div>
            ) : shares.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-slate-400">
                <i className="fa-solid fa-user-lock text-2xl mb-1 text-slate-300"></i>
                <p className="text-xs font-medium text-slate-600">Belum ada pengguna luar yang dibagikan</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Dokumen ini saat ini hanya dapat diakses oleh Anda dan rekan satu {document.bidang ? <strong>{document.bidang}</strong> : 'bidang'}.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {shares.map((share) => {
                  const bidangStyle = share.bidang && BIDANG_COLORS[share.bidang]
                    ? BIDANG_COLORS[share.bidang]
                    : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

                  return (
                    <div
                      key={share.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-sm">
                          {(share.fullName || share.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {share.fullName || share.username}
                            </p>
                            <span className="text-[10px] text-slate-400">@{share.username}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {share.bidang && (
                              <span className={`inline-flex rounded px-1.5 py-0.2 text-[10px] font-medium ${bidangStyle.bg} border ${bidangStyle.border}`}>
                                {share.bidang}
                              </span>
                            )}
                            <span className="inline-flex items-center text-[10px] text-slate-500 font-medium">
                              <i className="fa-solid fa-eye text-[9px] mr-1 text-slate-400"></i>
                              Read-Only
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={revokingId === share.userId}
                        onClick={() => handleRevoke(share.userId, share.username)}
                        title="Cabut Akses"
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors disabled:opacity-50"
                      >
                        {revokingId === share.userId ? (
                          <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                        ) : (
                          <i className="fa-solid fa-trash-can text-xs"></i>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-3.5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
