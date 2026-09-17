'use client';

import React, { useState, useEffect } from 'react';
import { LlmEndpointConfig, LlmTestResponse } from '@/core/domain/configuration';

interface LlmKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: LlmEndpointConfig | null;
  onSave: (endpoint: LlmEndpointConfig) => void;
  onTest: (apiKey: string, baseUrl: string, model: string) => Promise<LlmTestResponse>;
}

export const LlmKeyModal: React.FC<LlmKeyModalProps> = ({
  isOpen,
  onClose,
  endpoint,
  onSave,
  onTest,
}) => {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('groq');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [baseUrl, setBaseUrl] = useState('https://api.groq.com/openai/v1/chat/completions');
  const [model, setModel] = useState('openai/gpt-oss-120b');
  const [imageModel, setImageModel] = useState('qwen/qwen3.8-27b');
  const [isActive, setIsActive] = useState(true);
  const [priority, setPriority] = useState(1);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<LlmTestResponse | null>(null);

  useEffect(() => {
    if (endpoint) {
      setName(endpoint.name || '');
      setProvider(endpoint.provider || 'groq');
      setApiKey(endpoint.apiKey || '');
      setBaseUrl(endpoint.baseUrl || 'https://api.groq.com/openai/v1/chat/completions');
      setModel(endpoint.model || 'openai/gpt-oss-120b');
      setImageModel(endpoint.imageModel || 'qwen/qwen3.8-27b');
      setIsActive(endpoint.isActive ?? true);
      setPriority(endpoint.priority || 1);
    } else {
      setName('');
      setProvider('groq');
      setApiKey('');
      setBaseUrl('https://api.groq.com/openai/v1/chat/completions');
      setModel('openai/gpt-oss-120b');
      setImageModel('qwen/qwen3.8-27b');
      setIsActive(true);
      setPriority(1);
    }
    setTestResult(null);
  }, [endpoint, isOpen]);

  const handleProviderPreset = (selectedProvider: string) => {
    setProvider(selectedProvider);
    if (selectedProvider === 'groq') {
      setBaseUrl('https://api.groq.com/openai/v1/chat/completions');
      setModel('openai/gpt-oss-120b');
      setImageModel('qwen/qwen3.8-27b');
    } else if (selectedProvider === 'openai') {
      setBaseUrl('https://api.openai.com/v1/chat/completions');
      setModel('gpt-4o-mini');
      setImageModel('gpt-4o-mini');
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        latencyMs: 0,
        message: 'Masukkan API Key terlebih dahulu sebelum menguji.',
      });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await onTest(apiKey, baseUrl, model);
      setTestResult(res);
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !apiKey.trim()) return;

    onSave({
      id: endpoint?.id || crypto.randomUUID(),
      name: name.trim(),
      provider,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      model: model.trim(),
      imageModel: imageModel.trim(),
      isActive,
      priority: Number(priority) || 1,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm">
              <i className="fa-solid fa-key"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {endpoint ? 'Ubah Konfigurasi API Key LLM' : 'Tambah API Key LLM Baru'}
              </h2>
              <p className="text-xs text-slate-500">Mendukung multi-key failover otomatis</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Label Akun / Kunci <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Groq Production, OpenAI Backup, dsb"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Penyedia (Provider)</label>
              <select
                value={provider}
                onChange={(e) => handleProviderPreset(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="groq">Groq Cloud (Rekomendasi)</option>
                <option value="openai">OpenAI</option>
                <option value="custom">Kustom (OpenAI-Compatible)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Prioritas (Urutan Coba)</label>
              <input
                type="number"
                min="1"
                max="99"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Angka lebih kecil = diprioritaskan pertama</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              API Key <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                required
                placeholder="gsk_... atau sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                <i className={`fa-solid ${showKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Base URL Endpoint</label>
            <input
              type="url"
              required
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.groq.com/openai/v1/chat/completions"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Model Teks</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="openai/gpt-oss-120b"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Model Visi / Gambar</label>
              <input
                type="text"
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value)}
                placeholder="qwen/qwen3.8-27b"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-700 cursor-pointer">
              Aktifkan API Key ini (Sertakan dalam antrean failover)
            </label>
          </div>

          {/* Test connection output */}
          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs border ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>
                  <i className={`fa-solid mr-1.5 ${testResult.success ? 'fa-circle-check' : 'fa-circle-xmark'}`}></i>
                  {testResult.success ? 'Uji Koneksi Berhasil' : 'Uji Koneksi Gagal'}
                </span>
                {testResult.latencyMs > 0 && <span>{testResult.latencyMs} ms</span>}
              </div>
              <p className="text-[11px] leading-relaxed break-words">{testResult.message}</p>
              {testResult.responseText && (
                <div className="mt-1.5 p-2 bg-white/70 rounded-lg text-[10.5px] font-mono text-slate-700">
                  Respon: &ldquo;{testResult.responseText.substring(0, 100)}...&rdquo;
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !apiKey.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-indigo-600"></i>
                  Menguji...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-vial text-indigo-600"></i>
                  Uji Koneksi
                </>
              )}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20"
              >
                Simpan Kunci
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
