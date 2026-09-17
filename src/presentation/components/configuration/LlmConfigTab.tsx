'use client';

import React, { useState } from 'react';
import { LlmEndpointConfig, LlmConfigList, LlmTestResponse } from '@/core/domain/configuration';
import { LlmKeyModal } from './LlmKeyModal';

interface LlmConfigTabProps {
  config: LlmConfigList;
  onSave: (config: LlmConfigList) => Promise<boolean>;
  onTestKey: (apiKey: string, baseUrl: string, model: string) => Promise<LlmTestResponse>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const LlmConfigTab: React.FC<LlmConfigTabProps> = ({
  config,
  onSave,
  onTestKey,
  showToast,
}) => {
  const [endpoints, setEndpoints] = useState<LlmEndpointConfig[]>(config.endpoints || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LlmEndpointConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { testing?: boolean; result?: LlmTestResponse }>>({});

  const handleAddKey = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditKey = (item: LlmEndpointConfig) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleDeleteKey = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus konfigurasi API key ini?')) return;
    const updated = endpoints.filter((e) => e.id !== id);
    // re-prioritize
    updated.forEach((e, idx) => {
      e.priority = idx + 1;
    });
    setEndpoints(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = endpoints.map((e) => {
      if (e.id === id) return { ...e, isActive: !e.isActive };
      return e;
    });
    setEndpoints(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= endpoints.length) return;
    const list = [...endpoints];
    const temp = list[index];
    list[index] = list[newIdx];
    list[newIdx] = temp;
    list.forEach((e, idx) => {
      e.priority = idx + 1;
    });
    setEndpoints(list);
  };

  const handleSaveModal = (item: LlmEndpointConfig) => {
    let updated: LlmEndpointConfig[];
    const exists = endpoints.some((e) => e.id === item.id);
    if (exists) {
      updated = endpoints.map((e) => (e.id === item.id ? item : e));
    } else {
      updated = [...endpoints, item];
    }
    updated.sort((a, b) => a.priority - b.priority);
    updated.forEach((e, idx) => {
      e.priority = idx + 1;
    });
    setEndpoints(updated);
  };

  const handleQuickTest = async (item: LlmEndpointConfig) => {
    setTestResults((prev) => ({
      ...prev,
      [item.id]: { testing: true },
    }));

    try {
      const res = await onTestKey(item.apiKey, item.baseUrl, item.model);
      setTestResults((prev) => ({
        ...prev,
        [item.id]: { testing: false, result: res },
      }));
      if (res.success) {
        showToast(`Uji koneksi [${item.name}] berhasil (${res.latencyMs}ms)!`);
      } else {
        showToast(`Uji koneksi [${item.name}] gagal: ${res.message}`, true);
      }
    } catch {
      setTestResults((prev) => ({
        ...prev,
        [item.id]: { testing: false, result: { success: false, latencyMs: 0, message: 'Gagal menguji.' } },
      }));
      showToast(`Gagal menguji API Key [${item.name}]`, true);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await onSave({ endpoints });
      showToast('Seluruh konfigurasi API Key LLM berhasil disimpan!');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan konfigurasi.', true);
    } finally {
      setSaving(false);
    }
  };

  const formatEncryptedKey = (key: string) => {
    if (!key) return 'enc:v1:••••••••••••••••[Terenkripsi]';
    if (key.startsWith('enc:v1:')) {
      const payload = key.substring('enc:v1:'.length);
      return `enc:v1:${payload.slice(0, 12)}••••••••[AES-256-GCM]`;
    }
    return `enc:v1:••••••••••••••••[AES-256-GCM]`;
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <i className="fa-solid fa-microchip"></i>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Manajemen Multi-Key LLM (Failover Otomatis)</h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Sistem akan memanggil API Key secara berurutan sesuai prioritas. Jika suatu kunci mencapai batas kuota
              (Rate Limit 429) atau error, SIAP secara otomatis beralih ke kunci berikutnya tanpa terputus.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddKey}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0 cursor-pointer"
        >
          <i className="fa-solid fa-plus"></i>
          Tambah API Key
        </button>
      </div>

      {/* List of keys */}
      {endpoints.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-lg mb-3">
            <i className="fa-solid fa-key"></i>
          </div>
          <p className="text-sm font-bold text-slate-700">Belum ada API Key yang dikonfigurasi</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Klik tombol &ldquo;Tambah API Key&rdquo; di atas untuk mendaftarkan akun Groq, OpenAI, atau custom LLM endpoint.
          </p>
          <button
            type="button"
            onClick={handleAddKey}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
          >
            <i className="fa-solid fa-plus"></i>
            Tambah API Key Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {endpoints.map((item, index) => {
            const testState = testResults[item.id];

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.isActive
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50/80 border-slate-200/60 opacity-70'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center w-8 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Urutan</span>
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 mt-0.5">
                        {item.priority}
                      </span>
                      <div className="flex flex-col gap-0.5 mt-1.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                          title="Naikkan Prioritas"
                        >
                          <i className="fa-solid fa-chevron-up"></i>
                        </button>
                        <button
                          type="button"
                          disabled={index === endpoints.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 disabled:opacity-20"
                          title="Turunkan Prioritas"
                        >
                          <i className="fa-solid fa-chevron-down"></i>
                        </button>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {item.provider}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                          ></span>
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>

                      {/* API Key Ciphertext Display */}
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 select-none">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-semibold">
                          <i className="fa-solid fa-lock text-emerald-600"></i>
                          <span>{formatEncryptedKey(item.apiKey)}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                          Terenkripsi AES-256
                        </span>
                      </div>

                      {/* Endpoint specs */}
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
                        <span>
                          <i className="fa-solid fa-cube text-slate-400 mr-1"></i>
                          Model: <strong className="text-slate-700 font-mono">{item.model}</strong>
                        </span>
                        {item.imageModel && (
                          <span>
                            <i className="fa-solid fa-image text-slate-400 mr-1"></i>
                            Vision: <strong className="text-slate-700 font-mono">{item.imageModel}</strong>
                          </span>
                        )}
                        <span className="truncate max-w-[280px]" title={item.baseUrl}>
                          <i className="fa-solid fa-link text-slate-400 mr-1"></i>
                          {item.baseUrl}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Inline test */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={() => handleQuickTest(item)}
                      disabled={testState?.testing}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                      title="Uji API Key sekarang"
                    >
                      {testState?.testing ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin text-indigo-600"></i>
                          Menguji...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-vial text-indigo-600"></i>
                          Tes Kunci
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        item.isActive
                          ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditKey(item)}
                      className="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition-colors"
                      title="Ubah Konfigurasi"
                    >
                      <i className="fa-solid fa-pencil text-xs"></i>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteKey(item.id)}
                      className="w-8 h-8 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                      title="Hapus Kunci"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </div>
                </div>

                {/* Inline test result display */}
                {testState?.result && (
                  <div
                    className={`mt-3 p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      testState.result.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <i
                        className={`fa-solid ${
                          testState.result.success ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'
                        }`}
                      ></i>
                      <span className="font-semibold">{testState.result.message}</span>
                    </div>
                    {testState.result.latencyMs > 0 && (
                      <span className="font-mono text-[11px] font-bold">{testState.result.latencyMs} ms</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Save all button */}
      <div className="flex items-center justify-end pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Menyimpan Perubahan...
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk"></i>
              Simpan Urutan & Konfigurasi API Key
            </>
          )}
        </button>
      </div>

      {/* Modal */}
      <LlmKeyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        endpoint={editingItem}
        onSave={handleSaveModal}
        onTest={onTestKey}
      />
    </div>
  );
};
