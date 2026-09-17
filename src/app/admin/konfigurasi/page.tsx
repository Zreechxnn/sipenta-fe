'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/hooks/useToast';
import { useConfiguration } from '@/presentation/hooks/useConfiguration';
import { useAntiInspect } from '@/presentation/hooks/useAntiInspect';
import { LlmConfigTab } from '@/presentation/components/configuration/LlmConfigTab';
import { StorageConfigTab } from '@/presentation/components/configuration/StorageConfigTab';
import { DatabaseConfigTab } from '@/presentation/components/configuration/DatabaseConfigTab';
import { ConfigSecurityGateModal } from '@/presentation/components/configuration/ConfigSecurityGateModal';

type TabKey = 'llm' | 'storage' | 'database';

export default function KonfigurasiPage() {
  const { isLoading: authLoading, role } = useAuth(true, true);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('llm');

  const { toast, showToast } = useToast();
  const {
    overview,
    llmConfig,
    storageConfig,
    databaseConfig,
    isElevated,
    elevatedSecondsLeft,
    sudoElevate,
    sudoLock,
    sessionExpired,
    setSessionExpired,
    loading,
    error,
    fetchOverview,
    fetchLlmConfig,
    saveLlmConfig,
    testLlmEndpoint,
    fetchStorageConfig,
    saveStorageConfig,
    testStorage,
    fetchDatabaseConfig,
    testDatabase,
    saveDatabaseConfig,
    encryptAllConfigurations,
  } = useConfiguration();

  // Active Anti-Inspect & Anti-Copy Protection
  useAntiInspect({
    enabled: true,
    showWarning: (msg) => showToast(msg, true),
    onDevToolsDetected: () => {
      if (isElevated) {
        sudoLock();
        showToast('Terdeteksi percobaan inspeksi (DevTools)! Halaman konfigurasi dikunci otomatis secara darurat.', true);
      }
    },
  });

  // Show security notification when 15-minute elevation expires
  useEffect(() => {
    if (sessionExpired) {
      showToast('Sesi Sudo Mode telah kedaluwarsa (15 menit). Halaman dikunci secara otomatis demi keamanan.', true);
      setSessionExpired(false);
    }
  }, [sessionExpired, setSessionExpired, showToast]);

  // Strict role check: Only admin (not kasubag or normal user)
  useEffect(() => {
    if (!authLoading && role && role !== 'admin') {
      router.push('/dokumen');
    }
  }, [authLoading, role, router]);

  useEffect(() => {
    if (!authLoading && role === 'admin' && isElevated) {
      fetchOverview();
      fetchLlmConfig();
      fetchStorageConfig();
      fetchDatabaseConfig();
    }
  }, [authLoading, role, isElevated, fetchOverview, fetchLlmConfig, fetchStorageConfig, fetchDatabaseConfig]);

  if (authLoading || role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 select-none">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-indigo-600"></i>
          <span className="text-xs font-semibold text-slate-500">Memuat konfigurasi sistem...</span>
        </div>
      </div>
    );
  }

  // ZERO-LEAK DOM: If not elevated, DO NOT render any configuration DOM elements at all!
  if (!isElevated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 select-none">
        <Header onToggleMobileSidebar={() => setMobileOpen(true)} />
        <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <ConfigSecurityGateModal
          isOpen={true}
          onElevate={async (password) => {
            await sudoElevate(password);
            showToast('Otorisasi Sudo Mode berhasil! Akses konfigurasi diberikan.');
          }}
          onCancel={() => router.push('/dokumen')}
        />
        <Toast show={toast.show} message={toast.message} isError={toast.isError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 select-none">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
                <i className="fa-solid fa-sliders"></i>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Konfigurasi Sistem SIAP
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                Role Admin
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola kunci API LLM cerdas, penyedia cloud storage (Google Drive, Local, S3, Nextcloud, PDN), dan database PostgreSQL.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isElevated && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                  <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                  <span>
                    Sudo Mode: {Math.floor(elevatedSecondsLeft / 60)}:{(elevatedSecondsLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await encryptAllConfigurations();
                      showToast(res.message || 'Seluruh konfigurasi sistem dan kredensial database terenkripsi AES-256-GCM.');
                    } catch (err: any) {
                      showToast(err.message || 'Gagal mengenkripsi konfigurasi.', true);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  title="Verifikasi dan pastikan 100% konfigurasi database terenkripsi AES-256-GCM"
                >
                  <i className="fa-solid fa-shield-halved text-emerald-600"></i>
                  Enkripsi DB
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await sudoLock();
                    showToast('Sesi konfigurasi berhasil dikunci. Sudo Mode dinonaktifkan.');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                  title="Kunci kembali sesi konfigurasi sekarang"
                >
                  <i className="fa-solid fa-lock"></i>
                  Kunci Halaman
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                fetchOverview();
                if (isElevated) {
                  fetchLlmConfig();
                  fetchStorageConfig();
                  fetchDatabaseConfig();
                }
                showToast('Data konfigurasi diperbarui.');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <i className="fa-solid fa-rotate text-slate-400"></i>
              Segarkan
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            
            {/* LLM Stat */}
            <div
              onClick={() => setActiveTab('llm')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'llm'
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/10 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">LLM API Keys</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-microchip"></i>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-bold text-slate-900">{overview.activeLlmKeys} Aktif</span>
                <span className="text-xs text-slate-400">dari {overview.totalLlmKeys} total kunci</span>
              </div>
              <p className="text-[11px] text-indigo-600 mt-1 font-semibold flex items-center gap-1">
                <span>Kelola failover multi-kunci</span>
                <i className="fa-solid fa-arrow-right text-[9px]"></i>
              </p>
            </div>

            {/* Storage Stat */}
            <div
              onClick={() => setActiveTab('storage')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'storage'
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/10 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Cloud Storage Aktif</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-cloud"></i>
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-base font-bold text-slate-900 truncate">
                  {overview.activeStorageProvider || 'Google Drive'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
                <span>Ubah ke Nextcloud / PDN / S3</span>
                <i className="fa-solid fa-arrow-right text-[9px]"></i>
              </p>
            </div>

            {/* Database Stat */}
            <div
              onClick={() => setActiveTab('database')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeTab === 'database'
                  ? 'bg-white border-indigo-400 ring-2 ring-indigo-500/10 shadow-xs'
                  : 'bg-white/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Database PostgreSQL</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                  <i className="fa-solid fa-database"></i>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${overview.isDatabaseConnected ? 'bg-emerald-500' : 'bg-rose-500'}`}
                ></span>
                <span className="text-xs font-bold text-slate-800 truncate" title={overview.databaseHost}>
                  {overview.databaseHost || 'localhost'}
                </span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1 font-semibold flex items-center gap-1">
                <span>Atur URL & Connection String</span>
                <i className="fa-solid fa-arrow-right text-[9px]"></i>
              </p>
            </div>

          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('llm')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'llm'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-microchip"></i>
            API Key LLM
            {llmConfig && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-600">
                {llmConfig.endpoints.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'storage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-cloud-arrow-up"></i>
            Cloud Storage
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'database'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-database"></i>
            URL Database
          </button>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
            <span>{error}</span>
          </div>
        )}

        {/* Tab Content */}
        {loading && !llmConfig && !storageConfig && !databaseConfig ? (
          <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
            <i className="fa-solid fa-spinner fa-spin text-2xl text-indigo-600 mb-2"></i>
            <span className="text-xs font-semibold text-slate-500">Memuat rincian konfigurasi...</span>
          </div>
        ) : (
          <div>
            {activeTab === 'llm' && llmConfig && (
              <LlmConfigTab
                config={llmConfig}
                onSave={saveLlmConfig}
                onTestKey={(apiKey, baseUrl, model) => testLlmEndpoint({ apiKey, baseUrl, model })}
                showToast={showToast}
              />
            )}

            {activeTab === 'storage' && storageConfig && (
              <StorageConfigTab
                config={storageConfig}
                onSave={saveStorageConfig}
                onTest={testStorage}
                showToast={showToast}
              />
            )}

            {activeTab === 'database' && databaseConfig && (
              <DatabaseConfigTab
                config={databaseConfig}
                onSave={saveDatabaseConfig}
                onTest={testDatabase}
                showToast={showToast}
              />
            )}
          </div>
        )}

      </main>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
