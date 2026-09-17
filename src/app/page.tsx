'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/presentation/hooks/useAuth';

export default function HomePage() {
  const { user, token, role, bidang, isAdmin } = useAuth(false, false);
  const isAuthenticated = !!token;

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTabRole, setActiveTabRole] = useState<'evaluator' | 'expert' | 'admin'>('evaluator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  const samplePrompts = [
    {
      id: 'modul-auth',
      category: 'Bidang APTIKA',
      label: 'Progres Aplikasi BDS & Penambahan Fitur',
      q: 'Apa yang dikerjakan tenaga ahli pada tanggal 7 Mei terkait aplikasi BDS?',
      a: 'Berdasarkan Laporan Kerja Bulanan (Mei 2026):\n• Tenaga ahli melaksanakan koordinasi terkait penambahan fitur di Aplikasi BDS.\n• Memberikan arahan teknis kepada tim pengembang.\n• Memastikan kepatuhan terhadap regulasi pendaftaran Penyelenggara Sistem Elektronik (PSE) Lingkup Publik.',
      source: 'Laporan_Firman_Muhamad_Sahidin_Mei_2026.pdf',
      page: 'Halaman 8',
      status: 'Terverifikasi dalam Laporan',
      tags: ['Programmer', 'Bidang APTIKA', 'Mei 2026', 'Aplikasi BDS'],
      imagePreview: {
        caption: 'Dokumentasi Rapat Koordinasi Penambahan Fitur BDS',
        pageNumber: 8,
      },
    },
    {
      id: 'infra-server',
      category: 'Bidang TIK',
      label: 'Pemeliharaan Jaringan & Server Data Center',
      q: 'Apa tindakan pemeliharaan infrastruktur server yang dilakukan tim jaringan bulan ini?',
      a: 'Sesuai Laporan Kerja Tenaga Ahli Jaringan & Infrastruktur:\n• Pemeliharaan berkala server data center dan optimasi konfigurasi routing jaringan.\n• Pengecekan stabilitas koneksi antar perangkat server dan backup database berkala.\n• Monitoring pemanfaatan kapasitas penyimpanan cloud.',
      source: 'Laporan_Infrastruktur_Jaringan_2026.pdf',
      page: 'Halaman 3',
      status: 'Terverifikasi dalam Laporan',
      tags: ['Network Engineer', 'Bidang TIK', 'Infrastruktur Data Center'],
      imagePreview: {
        caption: 'Dokumentasi Monitoring Server & Perangkat Jaringan',
        pageNumber: 3,
      },
    },
    {
      id: 'qa-bugfix',
      category: 'Bidang Persandian',
      label: 'Evaluasi Keamanan & Hak Akses Sistem',
      q: 'Bagaimana hasil peninjauan keamanan informasi dan tata kelola akun pengguna?',
      a: 'Berdasarkan Laporan Kerja Tenaga Ahli Keamanan Informasi:\n• Peninjauan hak akses pengguna berdasarkan 3 tingkatan peran (Admin, Kepala Bidang, Tenaga Ahli).\n• Memastikan isolasi data dokumen per bidang berjalan dengan aman.\n• Verifikasi mekanisme persetujuan akun baru untuk mencegah akses tanpa otorisasi.',
      source: 'Laporan_Keamanan_Informasi_2026.pdf',
      page: 'Halaman 5',
      status: 'Terverifikasi dalam Laporan',
      tags: ['Security Analyst', 'Persandian', 'Keamanan Informasi'],
      imagePreview: {
        caption: 'Matriks Otorisasi Pengguna & Pembagian Hak Akses',
        pageNumber: 5,
      },
    },
    {
      id: 'rekap-output',
      category: 'Sekretariat & Evaluasi',
      label: 'Rekapitulasi Capaian Kinerja Bulanan',
      q: 'Bagaimana ringkasan capaian kinerja tenaga ahli pada periode laporan bulan Mei?',
      a: 'Rekapitulasi Capaian Kinerja Tenaga Ahli:\n1. Pengembang Aplikasi: Menyelesaikan penyesuaian modul tampilan detail dan integrasi layanan.\n2. Tim Infrastruktur: Melakukan pemeliharaan server dan optimasi jaringan komunikasi daerah.\n3. Tim Keamanan: Menjalankan audit hak akses berkas dan kepatuhan sistem informasi.',
      source: 'Rekapitulasi_Laporan_Kinerja_Mei_2026.pdf',
      page: 'Halaman 1 - 4',
      status: 'Terverifikasi dalam Laporan',
      tags: ['Sekretariat', 'Kompilasi Laporan', 'Evaluasi Kinerja'],
      imagePreview: {
        caption: 'Tabel Rekapitulasi Capaian Kinerja Bulanan',
        pageNumber: 1,
      },
    },
  ];

  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);

  useEffect(() => {
    const fullText = samplePrompts[selectedPromptIdx].a;
    setDisplayedText('');
    setIsTyping(true);

    let charCount = 0;
    const timer = setInterval(() => {
      charCount += 3;
      if (charCount < fullText.length) {
        setDisplayedText(fullText.slice(0, charCount));
      } else {
        setDisplayedText(fullText);
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [selectedPromptIdx]);

  const handleCopyDemo = async () => {
    try {
      await navigator.clipboard.writeText(samplePrompts[selectedPromptIdx].a);
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    } catch {}
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Unggah Laporan Kerja',
      desc: 'Tenaga ahli mengunggah laporan bulanan dalam format PDF, Word (DOCX/DOC), atau TXT lengkap dengan nama tenaga ahli, periode, dan bidang penugasan.',
      icon: 'fa-cloud-upload-alt',
      badge: 'Format PDF, DOCX, TXT',
    },
    {
      num: '02',
      title: 'Pemrosesan & Ekstraksi Berkas',
      desc: 'Sistem membedah teks laporan dan mengekstrak foto dokumentasi kegiatan per halaman agar dapat ditelusuri secara terstruktur.',
      icon: 'fa-layer-group',
      badge: 'Teks & Foto Dokumentasi',
    },
    {
      num: '03',
      title: 'Penelusuran Dokumen Interaktif',
      desc: 'Kepala Bidang dan tim evaluator dapat menanyakan rincian pekerjaan bulanan, progres fitur, atau kendala lapangan melalui ruang konsultasi dokumen.',
      icon: 'fa-comments',
      badge: 'Pencarian Berbasis Dokumen',
    },
    {
      num: '04',
      title: 'Verifikasi Rujukan & Bukti Nyata',
      desc: 'Setiap hasil penelusuran menyertakan kutipan berkas sumber, nomor halaman, dan galeri foto kegiatan yang dapat diperbesar.',
      icon: 'fa-check-circle',
      badge: 'Rujukan Halaman & Lampiran',
    },
  ];

  const bidangList = [
    {
      name: 'Bidang APTIKA',
      desc: 'Aplikasi Informatika & Layanan SPBE',
      icon: 'fa-code',
      color: 'from-blue-600 to-indigo-600',
      tag: 'Pengembangan Aplikasi',
    },
    {
      name: 'Bidang TIK',
      desc: 'Teknologi Informasi, Infrastruktur & Jaringan',
      icon: 'fa-network-wired',
      color: 'from-cyan-600 to-blue-700',
      tag: 'Infrastruktur & Server',
    },
    {
      name: 'Bidang IKP',
      desc: 'Informasi & Komunikasi Publik Daerah',
      icon: 'fa-bullhorn',
      color: 'from-emerald-600 to-teal-700',
      tag: 'Publikasi & Media',
    },
    {
      name: 'Bidang Statistik',
      desc: 'Statistik Sektoral & Tata Kelola Satu Data',
      icon: 'fa-chart-pie',
      color: 'from-amber-600 to-orange-600',
      tag: 'Pengolahan Data Sektoral',
    },
    {
      name: 'Bidang Persandian',
      desc: 'Keamanan Informasi & Pengamanan Siber',
      icon: 'fa-shield-alt',
      color: 'from-rose-600 to-red-700',
      tag: 'Keamanan & Tata Kelola Akun',
    },
    {
      name: 'Sekretariat',
      desc: 'Tata Usaha, Kepegawaian & Evaluasi Kinerja',
      icon: 'fa-briefcase',
      color: 'from-slate-700 to-slate-900',
      tag: 'Administrasi & Evaluasi',
    },
  ];

  const faqs = [
    {
      q: 'Apa itu platform SIPENTA?',
      a: 'SIPENTA (Sistem Informasi Pelaporan Tenaga Ahli) adalah platform resmi Dinas Komunikasi dan Informatika (Diskominfo) untuk mengelola, menghimpun, dan mengevaluasi dokumen laporan kerja tenaga ahli secara terpusat, tertib, dan akuntabel.',
    },
    {
      q: 'Bagaimana cara sistem menelusuri laporan kerja tenaga ahli?',
      a: 'Saat dokumen diunggah, isi laporan diindeks berdasarkan konteks kalimat dan nomor halamannya. Ketika Anda mengajukan pertanyaan di ruang penelusuran dokumen, sistem mencocokkan kata kunci dan konteks untuk menyajikan ringkasan kegiatan lengkap dengan rujukan berkas aslinya.',
    },
    {
      q: 'Apakah foto dokumentasi kegiatan di dalam berkas laporan ikut terbaca?',
      a: 'Ya. Sistem secara otomatis mengekstrak gambar, bagan, dan screenshot kegiatan yang ada di dalam berkas PDF maupun Word. Foto-foto tersebut dapat dilihat pada rincian dokumen dan ditampilkan sebagai rujukan visual.',
    },
    {
      q: 'Apakah riwayat percakapan penelusuran dokumen dapat disimpan?',
      a: 'Ya, seluruh sesi percakapan tersimpan secara teratur pada riwayat sesi di sidebar. Anda dapat membuka kembali sesi sebelumnya, mengelompokkan topik penelusuran, atau memulai sesi baru kapan saja.',
    },
    {
      q: 'Bagaimana mekanisme persetujuan akun pengguna baru?',
      a: 'Demi menjaga keamanan data instansi, pengguna yang baru mendaftar akan berstatus Menunggu Persetujuan (Pending). Administrator atau Kepala Bidang akan memverifikasi data dan menentukan penempatan bidang sebelum akun dapat mengakses fitur laporan.',
    },
    {
      q: 'Format berkas apa saja yang didukung oleh sistem?',
      a: 'SIPENTA mendukung berkas PDF (.pdf), Microsoft Word (.doc dan .docx), serta berkas teks (.txt). Dilengkapi fitur pencarian instan dan filter berdasarkan Bidang, Nama Tenaga Ahli, dan Periode Bulan.',
    },
  ];

  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() || user?.nama?.charAt(0)?.toUpperCase() || 'U';
  const userDisplayName = user?.fullName || user?.nama || user?.namaLengkap || 'Pengguna';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* ─── Header / Navbar ─────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group select-none min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-5 h-5 object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
                  SIPENTA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 text-indigo-700 tracking-wider uppercase border border-indigo-100 shrink-0">
                  Diskominfo
                </span>
              </div>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-medium mt-0.5 truncate">
                Sistem Pelaporan Tenaga Ahli
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-slate-600">
            <a href="#fitur" className="hover:text-slate-900 transition-colors">
              Fitur Utama
            </a>
            <a href="#simulasi" className="hover:text-slate-900 transition-colors">
              Simulasi
            </a>
            <a href="#bidang" className="hover:text-slate-900 transition-colors">
              6 Bidang
            </a>
            <a href="#alur-kerja" className="hover:text-slate-900 transition-colors">
              Alur Kerja
            </a>
            <a href="#peran" className="hover:text-slate-900 transition-colors">
              Panduan Peran
            </a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons: Dynamic based on Auth State */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              /* User is Logged In: Show Profile Icon + Dashboard/App Navigation */
              <div className="flex items-center gap-2">
                <Link
                  href="/dokumen"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  title="Lihat dokumen laporan"
                >
                  <i className="fas fa-file-lines text-xs text-indigo-600" />
                  <span>Dokumen</span>
                </Link>

                <Link
                  href="/chat"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-all"
                  title="Buka asisten penelusuran dokumen"
                >
                  <i className="fas fa-comment-dots text-xs text-indigo-600" />
                  <span>Asisten AI</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all"
                    title="Dashboard Administrator"
                  >
                    <i className="fas fa-chart-pie text-xs text-amber-400" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Profile Avatar Icon Link */}
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all group"
                  title={`Profil: ${userDisplayName} (${role || 'Tenaga Ahli'})`}
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    {userInitial}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate max-w-[120px]">
                      {userDisplayName}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {role || 'Pengguna'}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              /* User is NOT Logged In: Show Masuk & Daftar Buttons */
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  <span>Daftar</span>
                  <i className="fas fa-arrow-right text-[10px]" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-slate-100 border border-slate-200 bg-white shadow-2xs transition-all active:scale-90 cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              <i className="fas fa-bars text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer ─────────────────────────── */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0 delay-100'
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer transition-opacity duration-300"
        />

        <div
          style={{
            transform: mobileMenuOpen ? 'translateX(0%)' : 'translateX(105%)',
            transition: 'transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="fixed top-0 right-0 bottom-0 z-10 w-[84%] max-w-[320px] h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden border-l border-slate-200"
        >
          {/* Drawer Header */}
          <div className="p-4 flex justify-between items-center shrink-0 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <img src="/sipenta.svg" alt="SIPENTA" className="w-4.5 h-4.5 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900">
                  Menu SIPENTA
                </span>
                <span className="text-[10px] text-slate-500">Diskominfo Kab. Bandung</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-90 cursor-pointer"
              aria-label="Tutup menu"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>

          {/* User Status Card (If Logged In) */}
          {isAuthenticated && (
            <div className="p-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{userDisplayName}</p>
                  <p className="text-[10px] text-indigo-700 capitalize truncate">{role || 'Pengguna'} {bidang ? `• ${bidang}` : ''}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline shrink-0"
              >
                Profil
              </Link>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3.5 flex flex-col gap-1 flex-1 overflow-y-auto overscroll-contain">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                <i className="fas fa-layer-group" />
              </div>
              <span>Fitur Utama</span>
            </a>
            <a
              href="#simulasi"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <i className="fas fa-search" />
              </div>
              <span>Simulasi Penelusuran</span>
            </a>
            <a
              href="#bidang"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs">
                <i className="fas fa-sitemap" />
              </div>
              <span>6 Bidang Diskominfo</span>
            </a>
            <a
              href="#alur-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <i className="fas fa-tasks" />
              </div>
              <span>Alur Kerja Sistem</span>
            </a>
            <a
              href="#peran"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                <i className="fas fa-users" />
              </div>
              <span>Panduan Peran</span>
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                <i className="fas fa-question-circle" />
              </div>
              <span>Tanya Jawab (FAQ)</span>
            </a>

            <div className="h-px w-full my-2 bg-slate-100" />

            {/* Bottom Actions */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/dokumen"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800 transition-all"
                >
                  <i className="fas fa-file-lines" />
                  <span>Daftar Dokumen Laporan</span>
                </Link>
                <Link
                  href="/chat"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all"
                >
                  <i className="fas fa-comment-dots" />
                  <span>Asisten AI Dokumen</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-all"
                >
                  <i className="fas fa-arrow-right-to-bracket" />
                  <span>Masuk ke Akun</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-xs"
                >
                  <i className="fas fa-user-plus" />
                  <span>Daftar Akun Baru</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Drawer Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center shrink-0">
            <p className="text-[10px] text-slate-400 font-medium">
              SIPENTA &bull; Diskominfo Kabupaten Bandung
            </p>
          </div>
        </div>
      </div>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-12 pb-14 sm:pt-20 sm:pb-20 px-4 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/60">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Badge Instansi */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5 rounded-full border border-slate-200 bg-white shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-slate-600">
              Sistem Informasi Pelaporan Tenaga Ahli Diskominfo
            </span>
          </div>

          {/* Headline Utama */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-5 max-w-4xl leading-tight">
            Tata Kelola Laporan Kerja Tenaga Ahli. <br className="hidden sm:inline" />
            <span className="text-indigo-600">
              Tertib, Akuntabel, dan Mudah Ditelusuri.
            </span>
          </h1>

          {/* Deskripsi Realistis */}
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Platform terpadu untuk menghimpun, mengarsipkan, dan mengevaluasi laporan kinerja bulanan tenaga ahli lintas 6 bidang tugas. Dilengkapi kemampuan pencarian berbasis konteks dokumen dan ekstraksi foto kegiatan otomatis.
          </p>

          {/* Tombol Aksi Utama */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto">
            <Link
              href={isAuthenticated ? '/dokumen' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <i className="fas fa-file-lines text-xs" />
              <span>Akses Dokumen Laporan</span>
            </Link>
            <Link
              href={isAuthenticated ? '/chat' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
            >
              <i className="fas fa-comment-dots text-xs text-indigo-600" />
              <span>Buka Asisten Penelusuran</span>
            </Link>
          </div>

          {/* Nilai Utama Sistem (Fakta Nyata, Tanpa Hype Palsu) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
              <i className="fas fa-file-pdf text-rose-500 text-xs" />
              Multi-Format (PDF, Word, Teks)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
              <i className="fas fa-camera text-amber-500 text-xs" />
              Ekstraksi Foto & Dokumentasi Kegiatan
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
              <i className="fas fa-sitemap text-teal-500 text-xs" />
              Terstruktur Berdasarkan 6 Bidang
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs font-medium">
              <i className="fas fa-user-shield text-indigo-500 text-xs" />
              Hak Akses 3 Peran (Admin, Kasubag, Tenaga Ahli)
            </span>
          </div>
        </div>

        {/* ─── Simulasi Penelusuran Dokumen Interaktif ───────────── */}
        <div id="simulasi" className="max-w-4xl mx-auto mt-12 px-2 sm:px-4">
          <div className="overflow-hidden border border-slate-200 shadow-lg rounded-2xl bg-white">
            {/* Titlebar */}
            <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                <span className="ml-2 text-xs font-semibold text-slate-600">
                  Simulasi Penelusuran Laporan Kerja
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700">Dokumen Terindeks</span>
              </div>
            </div>

            {/* Scenario Selector */}
            <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap mr-1 shrink-0">
                Pilih Contoh:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPromptIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPromptIdx === idx
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {p.category}
                </button>
              ))}
            </div>

            {/* Chat Interaction Body */}
            <div className="p-4 sm:p-6 space-y-4 bg-white">
              {/* User Question */}
              <div className="flex items-start gap-2.5 justify-end">
                <div className="max-w-[85%] sm:max-w-xl bg-indigo-600 text-white p-3 sm:px-4 sm:py-3 rounded-2xl rounded-tr-xs text-xs sm:text-sm leading-relaxed shadow-2xs">
                  <p className="font-medium">{samplePrompts[selectedPromptIdx].q}</p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  <i className="fas fa-user-tie text-[11px]" />
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <img src="/sipenta.svg" alt="SIPENTA" className="w-4 h-4 object-contain" />
                </div>
                <div className="max-w-[92%] sm:max-w-2xl flex-1 bg-slate-50 text-slate-800 p-3.5 sm:p-5 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed border border-slate-200 shadow-2xs">
                  {/* Verified Source Reference */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-200">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-indigo-700 border border-indigo-200 truncate">
                        <i className="fas fa-file-pdf text-[10px] text-rose-500" />
                        <span className="truncate">{samplePrompts[selectedPromptIdx].source}</span>
                        <span className="text-slate-400 font-normal shrink-0">({samplePrompts[selectedPromptIdx].page})</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600">
                        <i className="fas fa-check-circle mr-1" />
                        {samplePrompts[selectedPromptIdx].status}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyDemo}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded hover:bg-slate-200 transition-all font-medium"
                      title="Salin jawaban ringkasan"
                    >
                      <i className={`fas ${copiedDemo ? 'fa-check text-emerald-600' : 'fa-copy text-[10px]'}`} />
                      <span>{copiedDemo ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  {/* Document Image Reference */}
                  <div className="mb-3 p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                      <i className="fas fa-camera text-amber-500 text-[10px]" />
                      <span>Lampiran Dokumentasi dalam Berkas:</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 relative overflow-hidden">
                        <i className="fas fa-image text-lg" />
                        <div className="absolute bottom-0 inset-x-0 bg-slate-900/70 text-[8px] text-white text-center py-0.5 font-mono">
                          Hal. {samplePrompts[selectedPromptIdx].imagePreview.pageNumber}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {samplePrompts[selectedPromptIdx].imagePreview.caption}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Terekstraksi otomatis dari berkas laporan {samplePrompts[selectedPromptIdx].source}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Text */}
                  <div className="text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                    {displayedText}
                    {isTyping && <span className="inline-block w-1.5 h-4 bg-indigo-600 ml-0.5 animate-pulse" />}
                  </div>

                  {/* Document Tags */}
                  {!isTyping && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap gap-1 items-center">
                      <span className="text-[10px] text-slate-400 mr-1">Kategori:</span>
                      {samplePrompts[selectedPromptIdx].tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-slate-600 border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Prompt */}
            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
              <span>Ingin menelusuri laporan kerja tenaga ahli bidang Anda?</span>
              <Link
                href={isAuthenticated ? '/chat' : '/login'}
                className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>Buka Asisten Penelusuran</span>
                <i className="fas fa-chevron-right text-[9px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Ringkasan Kemampuan Sistem (Clean Facts) ─────────── */}
      <section className="py-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x divide-slate-200">
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                6 Bidang
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Struktur Tugas Diskominfo
              </span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Multi-Format
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Dukungan Berkas PDF, Word & Teks
              </span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                3 Tingkat
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Hak Akses (Admin, Kasubag, Tenaga Ahli)
              </span>
            </div>
            <div className="px-2">
              <span className="block text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Terverifikasi
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Persetujuan Akun Instansi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 Bidang Diskominfo Section ──────────────────────── */}
      <section id="bidang" className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Struktur Organisasi Diskominfo
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
            Penyelarasan 6 Bidang Kerja Instansi
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Arsip dokumen dan penelusuran dikelompokkan secara terstruktur berdasarkan bidang tugas dan fungsi masing-masing di Dinas Komunikasi dan Informatika.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bidangList.map((b, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-xs`}>
                    <i className={`fas ${b.icon} text-base`} />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                    {b.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {b.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {b.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>Terisolasi Hak Akses Bidang</span>
                <i className="fas fa-lock text-[10px]" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Fitur Utama Section ──────────────────────────────── */}
      <section id="fitur" className="py-14 sm:py-20 px-4 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Fitur Utama
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
              Dirancang untuk Kemudahan Pengelolaan Dokumen
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Fokus pada kepraktisan pengunggahan, ketepatan penelusuran, serta keamanan tata kelola akun instansi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-xs">
                  <i className="fas fa-search text-sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Penelusuran Konteks Laporan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menemukan rincian kegiatan bulanan langsung merujuk pada nomor halaman berkas laporan tanpa harus membuka satu per satu secara manual.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-indigo-600">
                Rujukan Halaman Presisi
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 shadow-xs">
                  <i className="fas fa-camera text-sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Ekstraksi Foto Dokumentasi
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Foto rapat, bagan alur, dan screenshot aplikasi yang dilampirkan dalam berkas PDF/Word diekstrak secara otomatis per halaman.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-amber-700">
                Galeri Foto & Perbesar Gambar
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-4 shadow-xs">
                  <i className="fas fa-history text-sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Multi-Sesi Percakapan
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Setiap penelusuran tersimpan dalam daftar riwayat sesi sehingga mempermudah evaluasi berkala dan perbandingan laporan antar-bulan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-teal-700">
                Riwayat Sesi Terorganisir
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-4 shadow-xs">
                  <i className="fas fa-user-shield text-sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  Persetujuan & Hak Akses
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pendaftaran akun baru wajib diverifikasi oleh Admin/Kepala Bidang guna menjamin kerahasiaan dan isolasi dokumen per bidang tugas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] font-semibold text-rose-700">
                Verifikasi Akun Instansi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Langkah Alur Kerja ─────────────────────────────── */}
      <section id="alur-kerja" className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Alur Kerja Sistem
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
            Bagaimana SIPENTA Digunakan?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Empat tahapan terstruktur mulai dari pengunggahan laporan bulanan hingga verifikasi dokumen oleh penilai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <i className={`fas ${step.icon} text-sm`} />
                  </div>
                  <span className="font-mono text-xl font-bold text-slate-300">
                    {step.num}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                Tahap {idx + 1} dari 4
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Panduan Sesuai Peran Pengguna ─────────────────────── */}
      <section id="peran" className="py-14 sm:py-20 px-4 bg-slate-100/70 border-y border-slate-200">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Panduan Peran
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
              Dirancang untuk Setiap Peran di Instansi
            </h2>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Pengalaman penggunaan yang disesuaikan dengan tanggung jawab dan wewenang masing-masing pihak.
            </p>

            {/* Role Tabs Toggle */}
            <div className="inline-flex p-1 mt-6 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setActiveTabRole('evaluator')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTabRole === 'evaluator'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fas fa-user-tie mr-1.5" />
                Kepala Bidang / Penilai
              </button>
              <button
                onClick={() => setActiveTabRole('expert')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTabRole === 'expert'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fas fa-laptop-code mr-1.5" />
                Tenaga Ahli
              </button>
              <button
                onClick={() => setActiveTabRole('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTabRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <i className="fas fa-shield-alt mr-1.5" />
                Administrator
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTabRole === 'evaluator' && (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-chart-line" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Kemudahan untuk Kepala Bidang & Tim Penilai
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluasi kinerja bulanan terstruktur berbasis bukti dokumen laporan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-search text-indigo-600" />
                      Pencarian Dokumen Praktis
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Temukan laporan tenaga ahli berdasarkan nama, periode bulan, atau kata kunci topik dengan cepat.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-tasks text-indigo-600" />
                      Penelusuran Rincian Kegiatan
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Tanyakan progres pekerjaan tertentu dan dapatkan ringkasan kegiatan lengkap dengan nomor halaman berkas.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-image text-indigo-600" />
                      Verifikasi Foto Kegiatan
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lihat foto dokumentasi rapat, pemeliharaan server, atau screenshot aplikasi yang terlampir dalam laporan.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-user-check text-indigo-600" />
                      Persetujuan Akun Bidang
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Menyetujui pendaftaran akun tenaga ahli yang bertugas di bawah bidang penempatan Anda.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabRole === 'expert' && (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-laptop-code" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Kemudahan untuk Tenaga Ahli
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pengunggahan berkas teratur, arsip aman, dan kemudahan melihat riwayat pekerjaan
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-cloud-upload-alt text-emerald-600" />
                      Unggah Dokumen Mudah
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cukup seret dan lepas (drag-and-drop) berkas PDF, Word (DOCX/DOC), atau TXT laporan bulanan Anda.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-folder-open text-emerald-600" />
                      Repositori Laporan Terarsip
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Seluruh berkas tersimpan rapi berdasarkan nama tenaga ahli, periode laporan, dan bidang tugas.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-eye text-emerald-600" />
                      Pratinjau & Unduh Berkas
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Buka pratinjau dokumen langsung di peramban atau unduh kembali berkas laporan kapan saja dibutuhkan.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-comment-dots text-emerald-600" />
                      Penelusuran Riwayat Pribadi
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Gunakan ruang tanya jawab untuk memeriksa kembali catatan kegiatan bulan-bulan sebelumnya.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabRole === 'admin' && (
              <div className="p-6 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-2xl">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-xl shrink-0">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Kemudahan untuk Administrator
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kontrol terpusat atas manajemen pengguna, verifikasi pendaftaran, dan audit berkas
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-users-cog text-amber-600" />
                      Manajemen Pengguna & Bidang
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Verifikasi pendaftaran pengguna baru, tentukan penempatan bidang, dan kelola peran hak akses.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-chart-pie text-amber-600" />
                      Dashboard Statistik Sistem
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Pantau total dokumen terunggah, beban penyimpanan, antrean verifikasi, dan komposisi per bidang.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-shield-alt text-amber-600" />
                      Isolasi Keamanan Data
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Memastikan dokumen antar-bidang terlindungi dan hanya dapat diakses oleh pihak yang berwenang.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-slate-900 font-bold text-xs mb-1 flex items-center gap-2">
                      <i className="fas fa-sync text-amber-600" />
                      Sinkronisasi Data Real-Time
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Setiap perubahan persetujuan akun atau unggahan berkas baru langsung tersinkronisasi otomatis.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Tanya Jawab (FAQ) ────────────────────────────────── */}
      <section id="faq" className="py-14 sm:py-20 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Tanya Jawab
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Informasi penting seputar penggunaan dan tata kelola platform SIPENTA.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden border border-slate-200 rounded-xl bg-white transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-xs text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Call to Action ────────────────────────────── */}
      <section className="py-14 sm:py-16 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 border border-white/20">
            <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-6 h-6 object-contain" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 leading-tight">
            Mulai Pengelolaan Laporan Tenaga Ahli
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-7 leading-relaxed font-normal">
            Tingkatkan efisiensi dan akuntabilitas penelaahan dokumen kerja di lingkungan Dinas Komunikasi dan Informatika.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href={isAuthenticated ? '/dokumen' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95 transition-all"
            >
              <i className="fas fa-file-lines text-xs" />
              <span>Akses Dokumen Laporan</span>
            </Link>
            <Link
              href={isAuthenticated ? '/chat' : '/login'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
            >
              <i className="fas fa-comment-dots text-xs text-amber-400" />
              <span>Buka Asisten Penelusuran</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer Resmi ─────────────────────────────────────── */}
      <footer className="bg-white py-8 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs shrink-0">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4.5 h-4.5 object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block leading-tight">
                SIPENTA &bull; Sistem Informasi Pelaporan Tenaga Ahli
              </span>
              <span className="text-[11px] text-slate-500">
                Dinas Komunikasi dan Informatika (Diskominfo)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <Link href="/dokumen" className="hover:text-slate-900 transition-colors">
              Laporan Kerja
            </Link>
            <Link href="/chat" className="hover:text-slate-900 transition-colors">
              Asisten AI
            </Link>
            {isAdmin && (
              <Link href="/admin/dashboard" className="hover:text-slate-900 transition-colors">
                Dashboard
              </Link>
            )}
            {!isAuthenticated ? (
              <>
                <Link href="/login" className="hover:text-slate-900 transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Daftar
                </Link>
              </>
            ) : (
              <Link href="/profile" className="hover:text-slate-900 transition-colors">
                Profil Saya
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika.
          </p>
        </div>
      </footer>
    </div>
  );
}
