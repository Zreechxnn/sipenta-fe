'use client';

import React, { useState, useEffect } from 'react';
import { StorageConfig, StorageTestResponse } from '@/core/domain/configuration';

interface StorageConfigTabProps {
  config: StorageConfig;
  onSave: (config: StorageConfig) => Promise<boolean>;
  onTest: (config?: StorageConfig) => Promise<StorageTestResponse>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const StorageConfigTab: React.FC<StorageConfigTabProps> = ({
  config,
  onSave,
  onTest,
  showToast,
}) => {
  const [activeProvider, setActiveProvider] = useState<string>(config.activeProvider || 'GoogleDrive');

  // Google Drive
  const [tokenJson, setTokenJson] = useState(config.googleDrive?.tokenJson || '');
  const [folderId, setFolderId] = useState(config.googleDrive?.folderId || '');
  const [folderImageId, setFolderImageId] = useState(config.googleDrive?.folderImageId || '');
  const [clientId, setClientId] = useState(config.googleDrive?.clientId || '');
  const [clientSecret, setClientSecret] = useState(config.googleDrive?.clientSecret || '');

  // Local Storage
  const [basePath, setBasePath] = useState(config.localStorage?.basePath || 'Uploads/Storage');
  const [localDocumentFolder, setLocalDocumentFolder] = useState(config.localStorage?.documentFolder || 'Documents');
  const [localImageFolder, setLocalImageFolder] = useState(config.localStorage?.imageFolder || 'Images');

  // S3 / OpenStack / PDN Object Storage
  const [s3Endpoint, setS3Endpoint] = useState(config.s3Compatible?.endpoint || '');
  const [s3Bucket, setS3Bucket] = useState(config.s3Compatible?.bucketName || 'documents');
  const [s3AccessKey, setS3AccessKey] = useState(config.s3Compatible?.accessKey || '');
  const [s3SecretKey, setS3SecretKey] = useState(config.s3Compatible?.secretKey || '');
  const [s3Region, setS3Region] = useState(config.s3Compatible?.region || 'us-east-1');
  const [s3ProviderType, setS3ProviderType] = useState(config.s3Compatible?.providerType || 'S3Compatible');
  const [s3DocumentPrefix, setS3DocumentPrefix] = useState(config.s3Compatible?.documentPrefix || 'documents');
  const [s3ImagePrefix, setS3ImagePrefix] = useState(config.s3Compatible?.imagePrefix || 'images');

  // Supabase Storage (Dedicated Provider)
  const [supabaseProjectUrl, setSupabaseProjectUrl] = useState(config.supabase?.projectUrl || '');
  const [supabaseApiKey, setSupabaseApiKey] = useState(config.supabase?.apiKey || '');
  const [supabaseBucketName, setSupabaseBucketName] = useState(config.supabase?.bucketName || 'documents');
  const [supabaseDocumentFolder, setSupabaseDocumentFolder] = useState(config.supabase?.documentFolder || 'documents');
  const [supabaseImageFolder, setSupabaseImageFolder] = useState(config.supabase?.imageFolder || 'images');
  const [showSupabaseApiKey, setShowSupabaseApiKey] = useState(false);

  // WebDAV (Nextcloud / ownCloud / PDN WebDAV)
  const [webdavServerUrl, setWebdavServerUrl] = useState(config.webDav?.serverUrl || '');
  const [webdavUsername, setWebdavUsername] = useState(config.webDav?.username || '');
  const [webdavPassword, setWebdavPassword] = useState(config.webDav?.password || '');
  const [webdavRemotePath, setWebdavRemotePath] = useState(config.webDav?.remotePath || 'siap');
  const [webdavPreset, setWebdavPreset] = useState(config.webDav?.preset || 'Nextcloud');
  const [webdavDocumentPath, setWebdavDocumentPath] = useState(config.webDav?.documentPath || 'documents');
  const [webdavImagePath, setWebdavImagePath] = useState(config.webDav?.imagePath || 'images');
  const [showWebdavPassword, setShowWebdavPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<StorageTestResponse | null>(null);

  // Sinkronisasi state saat data config dari server terisi atau diperbarui
  useEffect(() => {
    if (config.activeProvider) setActiveProvider(config.activeProvider);

    if (config.googleDrive) {
      if (config.googleDrive.tokenJson) setTokenJson(config.googleDrive.tokenJson);
      if (config.googleDrive.folderId) setFolderId(config.googleDrive.folderId);
      if (config.googleDrive.folderImageId) setFolderImageId(config.googleDrive.folderImageId);
      if (config.googleDrive.clientId) setClientId(config.googleDrive.clientId);
      if (config.googleDrive.clientSecret) setClientSecret(config.googleDrive.clientSecret);
    }

    if (config.localStorage) {
      if (config.localStorage.basePath) setBasePath(config.localStorage.basePath);
      if (config.localStorage.documentFolder) setLocalDocumentFolder(config.localStorage.documentFolder);
      if (config.localStorage.imageFolder) setLocalImageFolder(config.localStorage.imageFolder);
    }

    if (config.supabase) {
      if (config.supabase.projectUrl) setSupabaseProjectUrl(config.supabase.projectUrl);
      if (config.supabase.apiKey) setSupabaseApiKey(config.supabase.apiKey);
      if (config.supabase.bucketName) setSupabaseBucketName(config.supabase.bucketName);
      if (config.supabase.documentFolder) setSupabaseDocumentFolder(config.supabase.documentFolder);
      if (config.supabase.imageFolder) setSupabaseImageFolder(config.supabase.imageFolder);
    }

    if (config.s3Compatible) {
      if (config.s3Compatible.endpoint) setS3Endpoint(config.s3Compatible.endpoint);
      if (config.s3Compatible.bucketName) setS3Bucket(config.s3Compatible.bucketName);
      if (config.s3Compatible.accessKey) setS3AccessKey(config.s3Compatible.accessKey);
      if (config.s3Compatible.secretKey) setS3SecretKey(config.s3Compatible.secretKey);
      if (config.s3Compatible.region) setS3Region(config.s3Compatible.region);
      if (config.s3Compatible.providerType) setS3ProviderType(config.s3Compatible.providerType);
      if (config.s3Compatible.documentPrefix) setS3DocumentPrefix(config.s3Compatible.documentPrefix);
      if (config.s3Compatible.imagePrefix) setS3ImagePrefix(config.s3Compatible.imagePrefix);
    }

    if (config.webDav) {
      if (config.webDav.serverUrl) setWebdavServerUrl(config.webDav.serverUrl);
      if (config.webDav.username) setWebdavUsername(config.webDav.username);
      if (config.webDav.password) setWebdavPassword(config.webDav.password);
      if (config.webDav.remotePath) setWebdavRemotePath(config.webDav.remotePath);
      if (config.webDav.preset) setWebdavPreset(config.webDav.preset);
      if (config.webDav.documentPath) setWebdavDocumentPath(config.webDav.documentPath);
      if (config.webDav.imagePath) setWebdavImagePath(config.webDav.imagePath);
    }
  }, [config]);

  const handleWebdavPresetChange = (preset: string) => {
    setWebdavPreset(preset);
    if (preset === 'Nextcloud') {
      if (!webdavServerUrl || webdavServerUrl.includes('webdav')) {
        setWebdavServerUrl('https://cloud.instansi.go.id/remote.php/dav/files/admin/');
      }
    } else if (preset === 'ownCloud') {
      if (!webdavServerUrl || webdavServerUrl.includes('dav/files')) {
        setWebdavServerUrl('https://cloud.instansi.go.id/remote.php/webdav/');
      }
    } else if (preset === 'PDN') {
      setWebdavServerUrl('https://storage.pdn.go.id/remote.php/dav/files/instansi/');
    }
  };

  const handleS3PresetChange = (preset: string) => {
    setS3ProviderType(preset);
    if (preset === 'PDN_ObjectStorage') {
      setS3Endpoint('https://s3.pdn.go.id');
      setS3Region('id-jkt-1');
    } else if (preset === 'OpenStackSwift') {
      setS3Endpoint('https://openstack.instansi.go.id:8080/v1');
      setS3Region('RegionOne');
    } else if (preset === 'MinIO') {
      setS3Endpoint('http://localhost:9000');
      setS3Region('us-east-1');
    } else if (preset === 'S3Compatible') {
      if (!s3Endpoint || s3Endpoint.includes('localhost') || s3Endpoint.includes('pdn')) {
        setS3Endpoint('https://s3.amazonaws.com');
      }
      setS3Region('us-east-1');
    }
  };

  const buildCurrentConfig = (): StorageConfig => {
    return {
      activeProvider,
      googleDrive: {
        tokenJson: tokenJson.trim(),
        folderId: folderId.trim(),
        folderImageId: folderImageId.trim(),
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
      },
      localStorage: {
        basePath: basePath.trim() || 'Uploads/Storage',
        documentFolder: localDocumentFolder.trim() || 'Documents',
        imageFolder: localImageFolder.trim() || 'Images',
      },
      supabase: {
        projectUrl: supabaseProjectUrl.trim(),
        apiKey: supabaseApiKey.trim(),
        bucketName: supabaseBucketName.trim() || 'documents',
        documentFolder: supabaseDocumentFolder.trim() || 'documents',
        imageFolder: supabaseImageFolder.trim() || 'images',
      },
      s3Compatible: {
        endpoint: s3Endpoint.trim(),
        bucketName: s3Bucket.trim() || 'documents',
        accessKey: s3AccessKey.trim(),
        secretKey: s3SecretKey.trim(),
        region: s3Region.trim() || 'us-east-1',
        providerType: s3ProviderType,
        documentPrefix: s3DocumentPrefix.trim() || 'documents',
        imagePrefix: s3ImagePrefix.trim() || 'images',
      },
      webDav: {
        serverUrl: webdavServerUrl.trim(),
        username: webdavUsername.trim(),
        password: webdavPassword.trim(),
        remotePath: webdavRemotePath.trim() || 'siap',
        preset: webdavPreset,
        documentPath: webdavDocumentPath.trim() || 'documents',
        imagePath: webdavImagePath.trim() || 'images',
      },
    };
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const current = buildCurrentConfig();
      const res = await onTest(current);
      setTestResult(res);
      if (res.success) {
        showToast(`Uji koneksi storage (${res.provider}) berhasil!`);
      } else {
        showToast(`Uji koneksi storage (${res.provider}) gagal: ${res.message}`, true);
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        provider: activeProvider,
        message: err.message || 'Gagal melakukan pengujian storage.',
      });
      showToast('Gagal melakukan pengujian storage.', true);
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const current = buildCurrentConfig();
      await onSave(current);
      showToast('Konfigurasi Cloud Storage berhasil disimpan!');
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan konfigurasi.', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* Intro info box */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">Konfigurasi Cloud Storage Terpadu</h2>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            SIAP kini mendukung seluruh ekosistem cloud storage instansi: <strong>Google Drive</strong>,{' '}
            <strong>Nextcloud / ownCloud / PDN (WebDAV)</strong>, <strong>OpenStack Swift / S3 / MinIO / PDN Object Storage</strong>, serta{' '}
            <strong>Penyimpanan Hard Disk Lokal</strong>. Berkas lama tetap aman dan dapat diunduh otomatis tanpa terpengaruh pergantian penyedia.
          </p>
        </div>
      </div>

      {/* Provider Selector Cards */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Penyedia Storage Aktif</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          
          {/* Google Drive */}
          <div
            onClick={() => setActiveProvider('GoogleDrive')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === 'GoogleDrive'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i className="fa-brands fa-google-drive"></i>
              </div>
              <input
                type="radio"
                name="storage_provider"
                checked={activeProvider === 'GoogleDrive'}
                onChange={() => setActiveProvider('GoogleDrive')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Google Drive</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">OAuth2 Token JSON & Folder ID</p>
          </div>

          {/* Supabase Storage */}
          <div
            onClick={() => setActiveProvider('Supabase')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === 'Supabase'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                <i className="fa-solid fa-bolt text-emerald-500"></i>
              </div>
              <input
                type="radio"
                name="storage_provider"
                checked={activeProvider === 'Supabase'}
                onChange={() => setActiveProvider('Supabase')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Supabase Storage</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Project URL, API Key & Bucket</p>
          </div>

          {/* Nextcloud / ownCloud / PDN WebDAV */}
          <div
            onClick={() => setActiveProvider('WebDav')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === 'WebDav'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                <i className="fa-solid fa-network-wired"></i>
              </div>
              <input
                type="radio"
                name="storage_provider"
                checked={activeProvider === 'WebDav'}
                onChange={() => setActiveProvider('WebDav')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Nextcloud / ownCloud / PDN</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">WebDAV protocol cloud instansi</p>
          </div>

          {/* S3 / OpenStack / PDN Object Storage */}
          <div
            onClick={() => setActiveProvider('S3Compatible')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === 'S3Compatible'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-sm">
                <i className="fa-solid fa-server"></i>
              </div>
              <input
                type="radio"
                name="storage_provider"
                checked={activeProvider === 'S3Compatible'}
                onChange={() => setActiveProvider('S3Compatible')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800">OpenStack / S3 / PDN Object</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">S3, MinIO, OpenStack Swift</p>
          </div>

          {/* Local Disk Storage */}
          <div
            onClick={() => setActiveProvider('LocalStorage')}
            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
              activeProvider === 'LocalStorage'
                ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
                <i className="fa-solid fa-hard-drive"></i>
              </div>
              <input
                type="radio"
                name="storage_provider"
                checked={activeProvider === 'LocalStorage'}
                onChange={() => setActiveProvider('LocalStorage')}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Local Disk Storage</h3>
            <p className="text-[10.5px] text-slate-500 mt-0.5">Simpan ke server mandiri</p>
          </div>

        </div>
      </div>

      {/* Provider Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        
        {/* Google Drive Configuration */}
        {activeProvider === 'GoogleDrive' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-brands fa-google-drive text-emerald-600"></i>
                Detail Pengaturan Google Drive
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                Penyedia Aktif
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Drive Token JSON <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={tokenJson}
                onChange={(e) => setTokenJson(e.target.value)}
                placeholder='{"token": "ya29...", "refresh_token": "1//...", "client_id": "...", "client_secret": "..."}'
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">
                Berisi token OAuth2 Google Drive beserta client_id dan client_secret.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder ID Dokumen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  placeholder="1twlmocQ6COnsI-RR4eRfTwMRExkmY_6N"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Folder ID Gambar & Ekstraksi
                </label>
                <input
                  type="text"
                  value={folderImageId}
                  onChange={(e) => setFolderImageId(e.target.value)}
                  placeholder="10c06klrRa3gG1VG6A7ooZmwLpp4cxL77"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Client ID (Opsional)</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="980294...apps.googleusercontent.com"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Client Secret (Opsional)</label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="GOCSPX-..."
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* WebDAV (Nextcloud / ownCloud / PDN WebDAV) */}
        {activeProvider === 'WebDav' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-network-wired text-blue-600"></i>
                <h4 className="text-xs font-bold text-slate-800">
                  Detail Pengaturan WebDAV (Nextcloud, ownCloud, PDN)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                Penyedia Aktif
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Template Preset</label>
              <div className="flex flex-wrap gap-2">
                {['Nextcloud', 'ownCloud', 'PDN', 'Custom'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleWebdavPresetChange(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      webdavPreset === p
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p === 'PDN' ? 'PDN / PDNS (Pusat Data Nasional)' : p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Server WebDAV Endpoint URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={webdavServerUrl}
                onChange={(e) => setWebdavServerUrl(e.target.value)}
                placeholder="https://cloud.instansi.go.id/remote.php/dav/files/username/"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">
                Untuk Nextcloud: <code>https://&lt;domain&gt;/remote.php/dav/files/&lt;user&gt;/</code> atau ownCloud: <code>https://&lt;domain&gt;/remote.php/webdav/</code>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username Akun WebDAV <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={webdavUsername}
                  onChange={(e) => setWebdavUsername(e.target.value)}
                  placeholder="admin atau nama_user"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password atau App Token <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showWebdavPassword ? 'text' : 'password'}
                    required
                    value={webdavPassword}
                    onChange={(e) => setWebdavPassword(e.target.value)}
                    placeholder="Password atau Nextcloud App Password"
                    className="w-full text-xs font-mono px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWebdavPassword(!showWebdavPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <i className={`fa-solid ${showWebdavPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Folder Penyimpanan di WebDAV (Remote Path)
              </label>
              <input
                type="text"
                value={webdavRemotePath}
                onChange={(e) => setWebdavRemotePath(e.target.value)}
                placeholder="siap"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">
                Nama folder di root Nextcloud/ownCloud/PDN tempat dokumen SIAP disimpan (default: <code>siap</code>).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subfolder Dokumen
                </label>
                <input
                  type="text"
                  value={webdavDocumentPath}
                  onChange={(e) => setWebdavDocumentPath(e.target.value)}
                  placeholder="documents"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Subdirektori berkas PDF/laporan (default: <code>documents</code>).</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subfolder Gambar & Ekstraksi
                </label>
                <input
                  type="text"
                  value={webdavImagePath}
                  onChange={(e) => setWebdavImagePath(e.target.value)}
                  placeholder="images"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Subdirektori foto kegiatan & KTP (default: <code>images</code>).</span>
              </div>
            </div>
          </div>
        )}

        {/* Supabase Storage Configuration */}
        {activeProvider === 'Supabase' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-emerald-600"></i>
                <h4 className="text-xs font-bold text-slate-800">
                  Detail Pengaturan Supabase Storage (REST API)
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                Penyedia Aktif
              </span>
            </div>

            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed">
              <p className="font-semibold mb-0.5 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-info text-emerald-600"></i>
                Konfigurasi Ringkas Supabase Storage
              </p>
              Supabase Storage terhubung langsung via Storage REST API. Anda hanya perlu mengisi <strong>Project URL</strong>, <strong>Nama Bucket</strong>, dan <strong>API Key</strong>. Subfolder berkas dapat disesuaikan (opsional).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Supabase Project URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supabaseProjectUrl}
                  onChange={(e) => setSupabaseProjectUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">
                  URL project Supabase Anda (contoh: <code>https://xxx.supabase.co</code> atau project id).
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Bucket Storage <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={supabaseBucketName}
                  onChange={(e) => setSupabaseBucketName(e.target.value)}
                  placeholder="documents"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-400">
                  Nama bucket penyimpanan di Supabase Storage (contoh: <code>documents</code>).
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Supabase API Key (Anon / Service Role) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showSupabaseApiKey ? 'text' : 'password'}
                  required
                  value={supabaseApiKey}
                  onChange={(e) => setSupabaseApiKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full text-xs font-mono px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSupabaseApiKey(!showSupabaseApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <i className={`fa-solid ${showSupabaseApiKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              <span className="text-[10px] text-slate-400">
                Kunci API dari dashboard Supabase (Project Settings &gt; API). Disarankan menggunakan Service Role Key untuk izin upload/download penuh.
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Folder di Dalam Bucket <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Folder / Prefix Dokumen
                  </label>
                  <input
                    type="text"
                    value={supabaseDocumentFolder}
                    onChange={(e) => setSupabaseDocumentFolder(e.target.value)}
                    placeholder="documents"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">Subdirektori berkas PDF/laporan (default: <code>documents</code>).</span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Folder / Prefix Gambar & Ekstraksi
                  </label>
                  <input
                    type="text"
                    value={supabaseImageFolder}
                    onChange={(e) => setSupabaseImageFolder(e.target.value)}
                    placeholder="images"
                    className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">Subdirektori foto kegiatan & identitas (default: <code>images</code>).</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* S3 / OpenStack / PDN Object Storage Configuration */}
        {activeProvider === 'S3Compatible' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-server text-violet-600"></i>
                <h4 className="text-xs font-bold text-slate-800">
                  Detail Pengaturan S3 / OpenStack Swift / PDN Object Storage
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold border border-violet-100">
                Penyedia Aktif
              </span>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Template Preset Layanan</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'PDN_ObjectStorage', label: 'PDN / PDNS Object Storage' },
                  { id: 'OpenStackSwift', label: 'OpenStack Swift' },
                  { id: 'MinIO', label: 'MinIO / Self-Hosted' },
                  { id: 'S3Compatible', label: 'AWS S3 / Cloudflare R2' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleS3PresetChange(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      s3ProviderType === item.id
                        ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Endpoint URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={s3Endpoint}
                  onChange={(e) => setS3Endpoint(e.target.value)}
                  placeholder="https://s3.pdn.go.id atau https://xxx.supabase.co/storage/v1/s3"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Bucket / Container <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={s3Bucket}
                  onChange={(e) => setS3Bucket(e.target.value)}
                  placeholder="documents"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Access Key ID / Username</label>
                <input
                  type="text"
                  value={s3AccessKey}
                  onChange={(e) => setS3AccessKey(e.target.value)}
                  placeholder="AKIA... atau project_id"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Secret Access Key / Password</label>
                <input
                  type="password"
                  value={s3SecretKey}
                  onChange={(e) => setS3SecretKey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">Region</label>
                <input
                  type="text"
                  value={s3Region}
                  onChange={(e) => setS3Region(e.target.value)}
                  placeholder="ap-southeast-1 atau id-jkt-1"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prefix / Folder Dokumen
                </label>
                <input
                  type="text"
                  value={s3DocumentPrefix}
                  onChange={(e) => setS3DocumentPrefix(e.target.value)}
                  placeholder="documents"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Prefix objek untuk berkas dokumen (default: <code>documents</code>).</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prefix / Folder Gambar & Ekstraksi
                </label>
                <input
                  type="text"
                  value={s3ImagePrefix}
                  onChange={(e) => setS3ImagePrefix(e.target.value)}
                  placeholder="images"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Prefix objek untuk foto kegiatan & identitas (default: <code>images</code>).</span>
              </div>
            </div>
          </div>
        )}

        {/* Local Storage Configuration */}
        {activeProvider === 'LocalStorage' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-hard-drive text-amber-600"></i>
                Detail Pengaturan Local Disk Storage
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-100">
                Penyedia Aktif
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Direktori Penyimpanan (Base Path)</label>
              <input
                type="text"
                required
                value={basePath}
                onChange={(e) => setBasePath(e.target.value)}
                placeholder="Uploads/Storage"
                className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[10px] text-slate-400">
                Path direktori penyimpanan berkas pada hard disk server backend (default: <code>Uploads/Storage</code>).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subfolder Dokumen
                </label>
                <input
                  type="text"
                  value={localDocumentFolder}
                  onChange={(e) => setLocalDocumentFolder(e.target.value)}
                  placeholder="Documents"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Folder dokumen/laporan di disk server (default: <code>Documents</code>).</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subfolder Gambar & Ekstraksi
                </label>
                <input
                  type="text"
                  value={localImageFolder}
                  onChange={(e) => setLocalImageFolder(e.target.value)}
                  placeholder="Images"
                  className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Folder foto kegiatan & lampiran di disk server (default: <code>Images</code>).</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <i className="fa-solid fa-circle-info text-amber-600 mt-0.5"></i>
              <p className="leading-relaxed">
                Penyimpanan lokal sangat cepat dan andal untuk deployment mandiri (on-premise). Berkas dokumen dan gambar
                akan disimpan pada subdirektori <code>Documents</code> dan <code>Images</code> secara otomatis.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Test Result Box */}
      {testResult && (
        <div
          className={`p-3.5 rounded-2xl text-xs border ${
            testResult.success
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2 font-bold mb-1">
            <i className={`fa-solid ${testResult.success ? 'fa-circle-check text-emerald-600' : 'fa-circle-xmark text-rose-600'}`}></i>
            <span>{testResult.success ? `Uji Koneksi ${testResult.provider} Berhasil!` : `Uji Koneksi ${testResult.provider} Gagal`}</span>
          </div>
          <p className="text-[11px] leading-relaxed">{testResult.message}</p>
          {testResult.details && <p className="text-[10px] text-slate-600 mt-1 font-mono">{testResult.details}</p>}
        </div>
      )}

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
              Menguji Penyimpanan...
            </>
          ) : (
            <>
              <i className="fa-solid fa-vial text-indigo-600"></i>
              Uji Koneksi Penyimpanan
            </>
          )}
        </button>

        <button
          type="submit"
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
              Simpan Konfigurasi Storage
            </>
          )}
        </button>
      </div>

    </form>
  );
};
