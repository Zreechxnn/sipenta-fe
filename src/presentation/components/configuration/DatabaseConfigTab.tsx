'use client';

import React, { useState } from 'react';
import { DatabaseConfig, DatabaseTestResponse } from '@/core/domain/configuration';

interface DatabaseConfigTabProps {
  config: DatabaseConfig;
  onSave: (config: DatabaseConfig) => Promise<{ message: string; requiresRestart: boolean }>;
  onTest: (req: any) => Promise<DatabaseTestResponse>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const DatabaseConfigTab: React.FC<DatabaseConfigTabProps> = ({
  config,
  onSave,
  onTest,
  showToast,
}) => {
  const [mode, setMode] = useState<'structured' | 'raw'>('structured');

  const [host, setHost] = useState(config.host || '');
  const [port, setPort] = useState(config.port || 5432);
  const [database, setDatabase] = useState(config.database || 'postgres');
  const [username, setUsername] = useState(config.username || 'postgres');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [rawConnectionString, setRawConnectionString] = useState(config.connectionString || '');

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<DatabaseTestResponse | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const buildPayload = (): DatabaseConfig => {
    if (mode === 'raw') {
      return {
        connectionString: rawConnectionString.trim(),
        host: '',
        port: 5432,
        database: '',
        username: '',
        password: '',
      };
    }

    return {
      connectionString: '',
      host: host.trim(),
      port: Number(port) || 5432,
      database: database.trim(),
      username: username.trim(),
      password: password,
    };
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      let req: any = {};
      if (mode === 'raw') {
        req = { connectionString: rawConnectionString.trim() };
      } else {
        req = {
          host: host.trim(),
          port: Number(port) || 5432,
          database: database.trim(),
          username: username.trim(),
          password: password,
        };
      }

      const res = await onTest(req);
      setTestResult(res);
      if (res.success) {
        showToast(`Koneksi database sukses (${res.latencyMs}ms)!`);
      } else {
        showToast(`Uji koneksi database gagal: ${res.message}`, true);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: err.message || 'Gagal menguji koneksi database.',
      });
      showToast('Gagal menguji koneksi database.', true);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfirmed = async () => {
    setConfirmModalOpen(false);
    setSaving(true);
    try {
      const payload = buildPayload();
      const res = await onSave(payload);
      showToast(res.message || 'Konfigurasi database berhasil disimpan!');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan konfigurasi database.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info box */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <i className="fa-solid fa-database"></i>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Konfigurasi Koneksi Database PostgreSQL</h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Pengaturan URL dan kredensial database utama sistem SIAP. Anda dapat menguji koneksi terlebih dahulu sebelum
            menyimpan perubahan. Menyimpan perubahan akan memperbarui file konfigurasi lingkungan (<code>.env</code>)
            dan database.
          </p>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700">Metode Input Konfigurasi</label>
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setMode('structured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'structured' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-list-check mr-1.5"></i>
            Form Terstruktur
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'raw' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-code mr-1.5"></i>
            URL / Raw String
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        {mode === 'structured' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Host / Server Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="localhost atau aws-0-ap-northeast-1.pooler.supabase.com"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Port</label>
                <input
                  type="number"
                  required
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="5432"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Database <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  placeholder="postgres"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="postgres"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password Database
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah password saat ini"
                  className="w-full text-xs font-mono px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                Password saat ini tersimpan dengan aman dan terenkripsi.
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Connection String atau PostgreSQL URI
            </label>
            <textarea
              rows={4}
              required
              value={rawConnectionString}
              onChange={(e) => setRawConnectionString(e.target.value)}
              placeholder="Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=..."
              className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-[11px] text-slate-400">
              Mendukung format Npgsql standard (<code>Host=...;Port=...;Database=...;Username=...;Password=...</code>)
              maupun format PostgreSQL URL (<code>postgresql://user:password@host:port/database</code>).
            </p>
          </div>
        )}
      </div>

      {/* Test Result Box */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl text-xs border ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center justify-between font-bold mb-1">
            <div className="flex items-center gap-2">
              <i
                className={`fa-solid ${
                  testResult.success ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'
                }`}
              ></i>
              <span>{testResult.success ? 'Koneksi PostgreSQL Berhasil!' : 'Koneksi PostgreSQL Gagal'}</span>
            </div>
            {testResult.latencyMs > 0 && <span className="font-mono">{testResult.latencyMs} ms</span>}
          </div>
          <p className="text-[11px] leading-relaxed break-words">{testResult.message}</p>
          {testResult.postgresVersion && (
            <div className="mt-2 pt-2 border-t border-emerald-200/60 flex flex-wrap gap-4 text-[10.5px] text-emerald-800">
              <span>
                Versi: <strong>{testResult.postgresVersion.split('on')[0]}</strong>
              </span>
              {testResult.tableCount !== undefined && (
                <span>
                  Jumlah Tabel Terdeteksi: <strong>{testResult.tableCount} tabel</strong>
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Guidance Alert */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
        <p className="leading-relaxed">
          <strong>Perhatian:</strong> Perubahan koneksi database akan disimpan ke konfigurasi sistem dan file <code>.env</code>.
          Disarankan untuk menekan tombol <strong>&ldquo;Uji Koneksi Database&rdquo;</strong> terlebih dahulu sebelum menyimpan.
          Setelah disimpan, backend memerlukan restart singkat agar Entity Framework Core menginisialisasi connection pool baru.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {testing ? (
            <>
              <i className="fa-solid fa-spinner fa-spin text-indigo-600"></i>
              Menguji Koneksi...
            </>
          ) : (
            <>
              <i className="fa-solid fa-vial text-indigo-600"></i>
              Uji Koneksi Database
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => setConfirmModalOpen(true)}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              Menyimpan...
            </>
          ) : (
            <>
              <i className="fa-solid fa-floppy-disk"></i>
              Simpan URL Database
            </>
          )}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-md animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-xl mx-auto mb-4 shadow-xs">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">Konfirmasi Perubahan Database</h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Anda akan memperbarui koneksi database utama sistem SIAP. Pastikan database target aktif dan dapat diakses.
              Lanjutkan penyimpanan?
            </p>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveConfirmed}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
              >
                Ya, Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
