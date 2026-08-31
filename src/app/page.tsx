'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTabRole, setActiveTabRole] = useState<'evaluator' | 'expert' | 'admin'>('evaluator');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Interactive AI Demo State reflecting real RAG & Image Extraction capabilities
  const samplePrompts = [
    {
      id: 'modul-auth',
      category: '🚀 Bidang APTIKA',
      label: 'Progres Modul Autentikasi & SSO',
      q: 'Bagaimana progres integrasi modul autentikasi dan keamanan sistem bulan ini?',
      a: 'Berdasarkan Laporan Kerja Tenaga Ahli Programmer (Agustus 2026):\n• Modul autentikasi telah diselesaikan 100% dengan standar token JWT dan integrasi Google OAuth 2.0.\n• Proteksi rute berbasis peran (RBAC 3 Level: Admin, Kasubag, Tenaga Ahli) telah aktif.\n• Sistem approval pendaftaran baru berhasil diimplementasikan untuk verifikasi akun instansi.',
      source: 'Laporan_Kerja_Programmer_Agt2026.pdf',
      page: 'Halaman 4 - 6',
      confidence: '99.4% Match',
      execTime: '0.58s',
      tags: ['Programmer', 'Bidang APTIKA', 'Agustus 2026', 'Fitur Selesai'],
      imagePreview: {
        caption: 'Arsitektur Autentikasi & Alur Approval Pengguna',
        pageNumber: 5,
      },
    },
    {
      id: 'infra-server',
      category: '🌐 Bidang TIK',
      label: 'Optimalisasi Server & Data Center',
      q: 'Apa tindakan pemeliharaan infrastruktur dan latensi server yang dilakukan tim jaringan?',
      a: 'Sesuai Laporan Kerja Tenaga Ahli Jaringan & DevOps (Agustus 2026):\n• Konfigurasi indeks database pgvector dioptimalkan, memangkas latensi kueri vektor hingga 64%.\n• Layanan WebSockets SignalR dipastikan berjalan stabil dengan live sync pembaruan berkas tanpa refresh.\n• Backup snapshot harian otomatis telah terhubung ke cloud storage Google Drive.',
      source: 'Laporan_Infrastruktur_DevOps_Agt2026.docx',
      page: 'Halaman 2 - 3',
      confidence: '98.8% Match',
      execTime: '0.45s',
      tags: ['DevOps Engineer', 'Bidang TIK', 'Agustus 2026', 'Infrastruktur'],
      imagePreview: {
        caption: 'Topologi Server & Monitoring Latensi SignalR',
        pageNumber: 2,
      },
    },
    {
      id: 'qa-bugfix',
      category: '🛡️ Persandian & Keamanan',
      label: 'Hasil Audit & Uji Penetrasi',
      q: 'Bagaimana status pengujian keamanan data dan penanganan kerentanan sistem?',
      a: 'Berdasarkan Laporan Kerja Tenaga Ahli Keamanan Informasi (Agustus 2026):\n• Sebanyak 32 skenario uji penetrasi dan otorisasi dokumen antar-bidang telah dijalankan.\n• Isolasi data laporan per bidang dipastikan aman dan tidak terjadi kebocoran hak akses antar tenaga ahli.\n• Validasi enkripsi berkas lolos uji audit kepatuhan SPBE.',
      source: 'Laporan_Audit_Keamanan_Agt2026.pdf',
      page: 'Halaman 8',
      confidence: '100% Match',
      execTime: '0.49s',
      tags: ['Security Analyst', 'Persandian & Siber', 'Agustus 2026', 'Audit Lolos'],
      imagePreview: {
        caption: 'Hasil Scan Kerentanan & Matriks Otorisasi RBAC',
        pageNumber: 8,
      },
    },
    {
      id: 'rekap-output',
      category: '📊 Sekretariat & Statistik',
      label: 'Rekapitulasi Capaian Bulanan',
      q: 'Tampilkan rekapitulasi capaian output utama seluruh tenaga ahli periode bulan ini.',
      a: 'Rekapitulasi Capaian Kinerja Tenaga Ahli (Agustus 2026):\n1. Programmer: Rilis modul AI RAG presisi, integrasi dokumen PDF/DOCX, dan multi-sesi chat.\n2. Network Engineer: Peningkatan bandwidth server data center dan konfigurasi backup cloud harian.\n3. Data Specialist: Pembersihan 1.200+ chunk dokumen dan penataan repositori arsip 6 bidang Diskominfo.',
      source: 'Kompilasi_Laporan_Kinerja_Agt2026.pdf',
      page: 'Halaman 1 - 4',
      confidence: '99.1% Match',
      execTime: '0.67s',
      tags: ['Sekretariat', 'Kompilasi Laporan', 'Agustus 2026', 'Executive Summary'],
      imagePreview: {
        caption: 'Matriks Capaian Kinerja Tenaga Ahli Seluruh Bidang',
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
    }, 24);

    return () => clearInterval(timer);
  }, [selectedPromptIdx]);

  const handleCopyDemo = async () => {
    try {
      await navigator.clipboard.writeText(samplePrompts[selectedPromptIdx].a);
      setCopiedDemo(true);
      setTimeout(() => setCopiedDemo(false), 2000);
    } catch {
      // ignore
    }
  };

  const workflowSteps = [
    {
      num: '01',
      title: 'Unggah Berkas Laporan',
      desc: 'Tenaga ahli mengunggah laporan bulanan dalam format PDF, Word (DOCX/DOC), atau TXT lengkap dengan metadata bidang dan periode.',
      icon: 'fa-cloud-upload-alt',
      badge: 'Multi-Format PDF & Word',
    },
    {
      num: '02',
      title: 'Ekstraksi Teks & Citra AI',
      desc: 'Mesin cerdas otomatis mengekstrak konten teks, membedah gambar/foto dokumentasi kegiatan per halaman, dan mengindeks vektor semantik.',
      icon: 'fa-layer-group',
      badge: 'Otomatisasi Teks & Foto',
    },
    {
      num: '03',
      title: 'Konsultasi RAG Multi-Sesi',
      desc: 'Kasubag dan tim evaluator menanyakan progres, evaluasi kendala, atau capaian pekerjaan dengan riwayat sesi percakapan yang tersimpan rapi.',
      icon: 'fa-comments',
      badge: 'RAG Cerdas & Riwayat Sesi',
    },
    {
      num: '04',
      title: 'Verifikasi Rujukan & Bukti Asli',
      desc: 'Setiap jawaban AI menyertakan rujukan nama dokumen, nomor halaman sah, serta galeri foto dokumentasi kerja dengan pembesar visual Lightbox.',
      icon: 'fa-check-circle',
      badge: '100% Bukti Terverifikasi',
    },
  ];

  const bidangList = [
    {
      name: 'Bidang APTIKA',
      desc: 'Aplikasi Informatika & SPBE',
      icon: 'fa-code',
      color: 'from-blue-600 to-indigo-600',
      tag: 'Pengembangan & Integrasi',
    },
    {
      name: 'Bidang TIK',
      desc: 'Teknologi Informasi & Komunikasi',
      icon: 'fa-network-wired',
      color: 'from-cyan-600 to-blue-700',
      tag: 'Infrastruktur & Server',
    },
    {
      name: 'Bidang IKP',
      desc: 'Informasi & Komunikasi Publik',
      icon: 'fa-bullhorn',
      color: 'from-emerald-600 to-teal-700',
      tag: 'Media & Komunikasi',
    },
    {
      name: 'Bidang Statistik',
      desc: 'Statistik Sektoral & Satu Data',
      icon: 'fa-chart-pie',
      color: 'from-amber-600 to-orange-600',
      tag: 'Pengolahan Data Daerah',
    },
    {
      name: 'Bidang Persandian',
      desc: 'Keamanan Informasi & Sandi Siber',
      icon: 'fa-shield-alt',
      color: 'from-rose-600 to-red-700',
      tag: 'Audit Siber & Enkripsi',
    },
    {
      name: 'Sekretariat',
      desc: 'Tata Usaha & Evaluasi Kinerja',
      icon: 'fa-briefcase',
      color: 'from-slate-700 to-slate-900',
      tag: 'Administrasi & Kinerja',
    },
  ];

  const faqs = [
    {
      q: 'Apa itu platform SIPENTA?',
      a: 'SIPENTA (Sistem Informasi Pelaporan Tenaga Ahli) adalah sistem cerdas yang dikembangkan khusus untuk instansi Dinas Komunikasi dan Informatika (Diskominfo) guna mengelola, menelusuri, dan mengevaluasi dokumen laporan kerja tenaga ahli secara terpusat dengan bantuan kecerdasan buatan (AI & RAG) yang terhubung dengan basis data cloud.',
    },
    {
      q: 'Bagaimana teknologi RAG (Retrieval-Augmented Generation) bekerja di SIPENTA?',
      a: 'Saat laporan diunggah, dokumen diekstraksi menjadi segmen teks terindeks (vector chunks). Ketika Anda bertanya pada Asisten AI, sistem menelusuri segmen dokumen yang paling relevan sesuai bidang Anda lalu menyusun jawaban presisi dengan melampirkan kutipan berkas sumber dan nomor halaman aslinya.',
    },
    {
      q: 'Apakah foto atau gambar dokumentasi kegiatan dalam laporan juga diekstrak?',
      a: 'Ya. SIPENTA memiliki modul ekstraksi citra otomatis yang mampu mendeteksi dan mengekstrak gambar dokumentasi/screenshot kegiatan dari file PDF atau Word. Foto tersebut dapat dilihat langsung pada rincian dokumen dan muncul sebagai lampiran visual di ruang Chat AI dengan fitur perbesar (Lightbox).',
    },
    {
      q: 'Apakah riwayat sesi percakapan Asisten AI dapat disimpan?',
      a: 'Sangat bisa. SIPENTA mendukung Multi-Session Chat History. Setiap percakapan disimpan secara otomatis dan terkelompok dalam daftar riwayat sesi di sidebar, memungkinkan Anda membuka kembali analisis sebelumnya, memulai sesi baru, atau menghapus sesi lama kapan saja.',
    },
    {
      q: 'Bagaimana sistem persetujuan (approval) pendaftaran akun baru?',
      a: 'Untuk menjaga keamanan dan privasi data instansi, akun pengguna yang baru mendaftar akan berada dalam status Menunggu Persetujuan (Pending Approval). Administrator atau Kasubag akan memverifikasi identitas dan menentukan penempatan Bidang Diskominfo sebelum akun dapat mengunggah laporan atau mengakses Asisten AI.',
    },
    {
      q: 'Format berkas dokumen apa saja yang didukung oleh sistem?',
      a: 'SIPENTA mendukung format dokumen standar perkantoran: PDF (.pdf), Microsoft Word (.doc dan .docx), serta berkas teks (.txt). Dilengkapi fitur pencarian cepat dengan tombol shortcut keyboard "/" dan filter multidimensi (Bidang, Tenaga Ahli, Periode, dan Jenis Dokumen).',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)] selection:bg-[var(--color-gold-pale)] selection:text-[var(--color-navy)]">
      {/* ─── Modern Frosted Header ───────────────────────────── */}
      <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group select-none min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-navy)] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display text-lg sm:text-xl tracking-wide text-[var(--color-navy)] leading-none">
                  SIPENTA
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-bold bg-[var(--color-gold-pale)] text-[var(--color-navy)] tracking-wider uppercase border border-amber-200/80 shrink-0">
                  AI v2.0
                </span>
              </div>
              <span className="text-[9.5px] sm:text-[10px] text-[var(--color-ink-faint)] tracking-wider sm:tracking-widest uppercase font-sans mt-0.5 truncate">
                Diskominfo • Pelaporan Tenaga Ahli
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-[var(--color-ink-muted)]">
            <a href="#fitur" className="hover:text-[var(--color-navy)] transition-colors">
              Fitur Unggulan
            </a>
            <a href="#demo" className="hover:text-[var(--color-navy)] transition-colors">
              Simulasi AI
            </a>
            <a href="#bidang" className="hover:text-[var(--color-navy)] transition-colors">
              6 Bidang
            </a>
            <a href="#cara-kerja" className="hover:text-[var(--color-navy)] transition-colors">
              Cara Kerja
            </a>
            <a href="#peran" className="hover:text-[var(--color-navy)] transition-colors">
              Manfaat Peran
            </a>
            <a href="#faq" className="hover:text-[var(--color-navy)] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold bg-white text-[var(--color-navy)] border border-black/[0.08] shadow-2xs hover:bg-[var(--color-surface-2)] transition-all"
            >
              <i className="fas fa-comment-dots text-xs text-indigo-600" />
              <span>Asisten AI</span>
            </Link>
            <Link
              href="/dokumen"
              className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-semibold bg-[var(--color-navy)] text-white shadow-xs hover:bg-[var(--color-navy-light)] hover:shadow-md active:scale-95 transition-all"
            >
              <span>Dashboard</span>
              <i className="fas fa-arrow-right text-[8px] sm:text-[9px] text-[var(--color-gold)]" />
            </Link>
            {/* Mobile Navigation Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-700 hover:bg-black/[0.05] border border-black/[0.06] bg-white shadow-2xs transition-all active:scale-90 cursor-pointer ml-0.5"
              aria-label="Buka menu navigasi"
            >
              <i className="fas fa-bars text-sm" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Navigation Drawer for Landing Page ─────────── */}
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
          className="fixed top-0 right-0 bottom-0 z-10 w-[84%] max-w-[320px] h-[100dvh] bg-white shadow-2xl flex flex-col overflow-hidden border-l border-slate-200/80 rounded-l-3xl"
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center shrink-0 border-b border-slate-100 bg-gradient-to-r from-indigo-50/40 to-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-navy)] flex items-center justify-center text-white shadow-xs">
                <img src="/sipenta.svg" alt="SIPENTA" className="w-4.5 h-4.5 object-contain" />
              </div>
              <span className="font-display text-base font-bold text-slate-900">
                Menu SIPENTA
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all active:scale-90 cursor-pointer"
              aria-label="Tutup menu"
            >
              <i className="fas fa-times text-xs" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 flex flex-col gap-1 flex-1 overflow-y-auto overscroll-contain">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
                <i className="fas fa-layer-group" />
              </div>
              <span>Fitur Unggulan</span>
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <i className="fas fa-sparkles" />
              </div>
              <span>Simulasi AI RAG</span>
            </a>
            <a
              href="#bidang"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-xs">
                <i className="fas fa-sitemap" />
              </div>
              <span>6 Bidang Diskominfo</span>
            </a>
            <a
              href="#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <i className="fas fa-tasks" />
              </div>
              <span>Cara Kerja Sistem</span>
            </a>
            <a
              href="#peran"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs">
                <i className="fas fa-users" />
              </div>
              <span>Manfaat Peran</span>
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs">
                <i className="fas fa-question-circle" />
              </div>
              <span>Tanya Jawab (FAQ)</span>
            </a>

            <div className="h-px w-full my-2 bg-slate-100" />

            {/* Quick Actions */}
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href="/chat"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs hover:bg-indigo-100 transition-all"
              >
                <i className="fas fa-comment-dots" />
                <span>Asisten AI Dokumen</span>
              </Link>
              <Link
                href="/dokumen"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-navy)] text-white text-xs font-bold shadow-xs hover:bg-[var(--color-navy-light)] transition-all"
              >
                <i className="fas fa-file-alt text-[var(--color-gold)]" />
                <span>Kelola Laporan Kerja</span>
              </Link>
            </div>
          </nav>

          {/* Footer Info */}
          <div className="p-3.5 border-t border-slate-100 bg-slate-50 text-center shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
              SIPENTA AI Platform &bull; v2.0
            </p>
          </div>
        </div>
      </div>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-10 pb-10 sm:pt-16 sm:pb-14 md:pt-20 md:pb-18 px-3.5 sm:px-4 overflow-hidden apple-glow">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-gradient-to-tr from-blue-200/35 via-teal-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none transform-gpu" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Status Live Indicator Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 mb-5 sm:mb-6 rounded-full border border-black/[0.08] bg-white/90 backdrop-blur-md shadow-xs animate-fade-in max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] sm:text-xs font-medium text-[var(--color-ink-muted)] truncate sm:whitespace-normal">
              <span className="hidden sm:inline">Sistem Tata Kelola Laporan Tenaga Ahli Berbasis RAG AI Diskominfo</span>
              <span className="sm:hidden">Tata Kelola Laporan RAG AI Diskominfo</span>
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.18] sm:leading-[1.14] tracking-tight text-[var(--color-navy)] mb-4 sm:mb-6 max-w-4xl animate-fade-up">
            Evaluasi Laporan Tenaga Ahli. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--color-navy)] via-[#1262a4] to-[#009688] bg-clip-text text-transparent">
              Cepat, Akuntabel, Terverifikasi.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-base md:text-xl text-[var(--color-ink-muted)] max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed font-normal animate-fade-up stagger-1 px-1">
            Platform terpadu untuk menelaah dokumen kerja bulanan tenaga ahli dengan teknologi <strong className="font-semibold text-[var(--color-ink)]">RAG AI Presisi</strong>. Temukan capaian progres, ekstraksi bukti foto otomatis, dan verifikasi nomor halaman tanpa membaca manual ratusan lembar.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mb-8 sm:mb-10 w-full sm:w-auto animate-fade-up stagger-2">
            <Link
              href="/dokumen"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-navy)] text-white shadow-sm hover:shadow-lg hover:bg-[var(--color-navy-light)] active:scale-95 transition-all"
            >
              <i className="fas fa-file-alt text-xs text-[var(--color-gold)]" />
              <span>Kelola Laporan Kerja</span>
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-white text-[var(--color-navy)] border border-black/[0.08] shadow-xs hover:bg-[var(--color-surface-2)] active:scale-95 transition-all"
            >
              <i className="fas fa-sparkles text-xs text-indigo-600" />
              <span>Coba Asisten AI Dokumen</span>
            </Link>
          </div>

          {/* Feature Highlight Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--color-ink-muted)] animate-fade-up stagger-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-brain text-indigo-600 text-[10px] sm:text-[11px]" />
              RAG AI Anti-Halusinasi
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-camera text-amber-500 text-[10px] sm:text-[11px]" />
              Ekstraksi Citra &amp; Foto Bukti
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-history text-blue-500 text-[10px] sm:text-[11px]" />
              Riwayat Sesi Tersimpan
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-shield-alt text-emerald-500 text-[10px] sm:text-[11px]" />
              Approval Gate &amp; RBAC 3 Level
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-sync-alt text-teal-500 text-[10px] sm:text-[11px]" />
              Realtime Sync SignalR
            </span>
          </div>
        </div>

        {/* ─── Interactive AI Live Simulation Showcase ──────────── */}
        <div id="demo" className="max-w-4xl mx-auto mt-8 sm:mt-12 px-1 sm:px-4 animate-scale-up stagger-3">
          <div className="apple-card overflow-hidden border border-black/[0.1] shadow-2xl rounded-2xl bg-white">
            {/* Window Titlebar */}
            <div className="bg-[var(--color-surface-2)]/90 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-black/[0.06] flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] inline-block border border-black/10" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] inline-block border border-black/10" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] inline-block border border-black/10" />
                <span className="ml-2 text-[10px] sm:text-[11px] font-mono text-[var(--color-ink-faint)] hidden sm:inline">
                  sipenta-ai-rag // interactive-demonstrator
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-[11px] font-mono text-[var(--color-ink-faint)] hidden md:inline">
                  Latency: {samplePrompts[selectedPromptIdx].execTime}
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-sync" />
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-emerald-700">RAG Aktif</span>
                </div>
              </div>
            </div>

            {/* Scenario Selector Pills - Smooth Horizontal Scroll on Mobile */}
            <div className="p-2.5 sm:p-4 bg-[var(--color-surface)] border-b border-black/[0.05] flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-ink-muted)] uppercase tracking-wider whitespace-nowrap mr-1 shrink-0">
                Pilih Skenario:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPromptIdx(idx)}
                  className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedPromptIdx === idx
                      ? 'bg-[var(--color-navy)] text-white shadow-xs'
                      : 'bg-white text-[var(--color-ink-muted)] border border-black/[0.07] hover:border-[var(--color-gold)] hover:text-[var(--color-navy)]'
                  }`}
                >
                  {p.category}
                </button>
              ))}
            </div>

            {/* Chat Interaction Area */}
            <div className="p-3.5 sm:p-7 space-y-4 sm:space-y-5 bg-white">
              {/* User Question Bubble */}
              <div className="flex items-start gap-2.5 sm:gap-3 justify-end">
                <div className="max-w-[85%] sm:max-w-xl bg-indigo-600 text-white p-3 sm:px-4.5 sm:py-3 rounded-2xl rounded-tr-xs text-[12.5px] sm:text-[13.5px] leading-relaxed shadow-xs">
                  <p className="font-medium">{samplePrompts[selectedPromptIdx].q}</p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs text-xs font-bold">
                  <i className="fas fa-user-tie text-[11px]" />
                </div>
              </div>

              {/* AI Answer Bubble */}
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[var(--color-navy)] flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
                </div>
                <div className="max-w-[92%] sm:max-w-2xl flex-1 bg-white text-[var(--color-ink)] p-3.5 sm:p-5 rounded-2xl rounded-tl-xs text-[12.5px] sm:text-[13.5px] leading-relaxed border border-black/[0.08] shadow-xs">
                  {/* Verified Source Citation Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-black/[0.06]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 max-w-[220px] sm:max-w-none truncate">
                        <i className="fas fa-file-pdf text-[9px]" />
                        <span className="truncate">{samplePrompts[selectedPromptIdx].source}</span>
                        <span className="text-indigo-400 font-normal shrink-0">({samplePrompts[selectedPromptIdx].page})</span>
                      </span>
                      <span className="text-[10.5px] sm:text-[11px] font-bold text-emerald-600">
                        <i className="fas fa-check-circle mr-1" />
                        {samplePrompts[selectedPromptIdx].confidence}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyDemo}
                      className="text-[11px] sm:text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] flex items-center gap-1 cursor-pointer px-2 py-0.5 rounded hover:bg-[var(--color-surface-2)] transition-all font-medium"
                      title="Salin jawaban ringkasan"
                    >
                      <i className={`fas ${copiedDemo ? 'fa-check text-emerald-600' : 'fa-copy text-[10px]'}`} />
                      <span>{copiedDemo ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  {/* Document Image Evidence Preview */}
                  <div className="mb-3 p-2 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                      <i className="fas fa-camera text-amber-500 text-[9px]" />
                      <span>Foto Dokumentasi Terlampir dalam Laporan:</span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg bg-indigo-100/70 border border-indigo-200/80 flex items-center justify-center text-indigo-600 shrink-0 relative overflow-hidden group/img cursor-pointer">
                        <i className="fas fa-image text-lg sm:text-xl" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8.5px] sm:text-[9px] text-white text-center py-0.5 font-mono">
                          Hal. {samplePrompts[selectedPromptIdx].imagePreview.pageNumber}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] sm:text-xs font-semibold text-slate-800 line-clamp-1">
                          {samplePrompts[selectedPromptIdx].imagePreview.caption}
                        </p>
                        <p className="text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-2 sm:line-clamp-none">
                          Diekstrak otomatis dari berkas {samplePrompts[selectedPromptIdx].source}.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Text with typing cursor */}
                  <div className="text-[12.5px] sm:text-[13.5px] leading-relaxed text-[var(--color-ink)] whitespace-pre-line font-normal">
                    {displayedText}
                    {isTyping && <span className="cursor-blink" />}
                  </div>

                  {/* Document Tags */}
                  {!isTyping && (
                    <div className="mt-3 pt-2 sm:pt-2.5 border-t border-black/[0.04] flex flex-wrap gap-1 items-center animate-fade-in">
                      <span className="text-[10px] text-[var(--color-ink-faint)] mr-0.5">Tags:</span>
                      {samplePrompts[selectedPromptIdx].tags.map(tag => (
                        <span key={tag} className="px-1.5 sm:px-2 py-0.5 rounded text-[9.5px] sm:text-[10.5px] font-medium bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-black/[0.04]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Footer Strip */}
            <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[var(--color-surface)] border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[var(--color-ink-muted)] text-center sm:text-left">
              <span className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                <i className="fas fa-info-circle text-[var(--color-navy)]" />
                Ingin menanyakan laporan bidang Anda langsung?
              </span>
              <Link
                href="/chat"
                className="font-bold text-[var(--color-navy)] hover:text-[var(--color-gold)] flex items-center gap-1 transition-colors text-xs"
              >
                <span>Buka Ruang Asisten AI</span>
                <i className="fas fa-chevron-right text-[9px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Numbers / Impact Strip ───────────────────────────── */}
      <section className="py-8 sm:py-12 bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center divide-x-0 md:divide-x divide-black/[0.06]">
            <div className="px-2 sm:px-3">
              <span className="block font-display text-2xl sm:text-4xl lg:text-5xl text-[var(--color-navy)] mb-1">
                &lt; 0.8 Detik
              </span>
              <span className="text-[11px] sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Kecepatan Temu Balik RAG
              </span>
            </div>
            <div className="px-2 sm:px-3">
              <span className="block font-display text-2xl sm:text-4xl lg:text-5xl text-[var(--color-navy)] mb-1">
                100%
              </span>
              <span className="text-[11px] sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Rujukan Dokumen Sah
              </span>
            </div>
            <div className="px-2 sm:px-3">
              <span className="block font-display text-2xl sm:text-4xl lg:text-5xl text-[var(--color-navy)] mb-1">
                6 Bidang
              </span>
              <span className="text-[11px] sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Terintegrasi Diskominfo
              </span>
            </div>
            <div className="px-2 sm:px-3">
              <span className="block font-display text-2xl sm:text-4xl lg:text-5xl text-[var(--color-navy)] mb-1">
                Dual Auth
              </span>
              <span className="text-[11px] sm:text-sm font-medium text-[var(--color-ink-muted)]">
                JWT + Google OAuth SSO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6 Bidang Diskominfo Section ──────────────────────── */}
      <section id="bidang" className="py-12 sm:py-18 md:py-24 px-3.5 sm:px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Struktur Organisasi Diskominfo
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-2.5 sm:mb-3.5">
            Dukungan Tata Kelola 6 Bidang Instansi
          </h2>
          <p className="text-xs sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
            Arsip dokumen dan analisis AI dikelompokkan secara terstruktur berdasarkan bidang tugas dan fungsi masing-masing di Dinas Komunikasi dan Informatika.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {bidangList.map((b, idx) => (
            <div
              key={idx}
              className="apple-card p-5 sm:p-6 flex flex-col justify-between group hover:border-[var(--color-navy)] transition-all bg-white"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${b.color} text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <i className={`fas ${b.icon} text-sm sm:text-base`} />
                  </div>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-bold bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-black/[0.05]">
                    {b.tag}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[var(--color-navy)] mb-1">
                  {b.name}
                </h3>
                <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                  {b.desc}
                </p>
              </div>
              <div className="mt-4 sm:mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[10.5px] sm:text-[11px] text-[var(--color-ink-faint)]">
                <span>Terisolasi Hak Akses RBAC</span>
                <i className="fas fa-lock text-[10px] text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Bento Grid Features Section ──────────────────────── */}
      <section id="fitur" className="py-12 sm:py-18 md:py-26 px-3.5 sm:px-4 bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
              Kapabilitas Canggih
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-2.5 sm:mb-3.5">
              Fitur Dirancang untuk Efisiensi Penilaian
            </h2>
            <p className="text-xs sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
              Kombinasi teknologi ekstraksi berkas, basis data vektor, kecerdasan buatan, dan sinkronisasi real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1 - Large Span RAG */}
            <div className="md:col-span-2 apple-card p-5 sm:p-7 md:p-9 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-surface-2)]">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-4 sm:mb-5 text-white shadow-xs">
                  <i className="fas fa-brain text-base sm:text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[var(--color-navy)] mb-2 sm:mb-2.5">
                  RAG Semantik &amp; Anti-Halusinasi
                </h3>
                <p className="text-xs sm:text-sm md:text-[15px] text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
                  Dokumen laporan kerja dipecah menjadi segmen vektor terindeks. Asisten AI hanya menjawab berdasarkan fakta sah yang tertulis pada laporan dan menyertakan rujukan nama dokumen serta nomor halaman untuk verifikasi silang.
                </p>
              </div>

              <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-black/[0.06] flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <i className="fas fa-check-circle mr-1" />
                  Bebas Halusinasi
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--color-ink-faint)]">
                  Didukung LLM Groq &amp; Embeddings Vektor Teroptimasi
                </span>
              </div>
            </div>

            {/* Card 2 - Ekstraksi Foto Bukti */}
            <div className="apple-card p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 sm:mb-5 shadow-xs">
                  <i className="fas fa-camera text-base sm:text-lg" />
                </div>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[var(--color-navy)] mb-2 sm:mb-2.5">
                  Ekstraksi Foto Bukti &amp; Lightbox
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  Foto dan screenshot dokumentasi pekerjaan dalam berkas PDF/Word diekstrak secara otomatis per halaman dan dapat dibuka dalam modal Lightbox resolusi penuh.
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-black/[0.06]">
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                  <i className="fas fa-images text-[11px]" />
                  Visual Evidence Ready
                </span>
              </div>
            </div>

            {/* Card 3 - Multi-Session Chat */}
            <div className="apple-card p-5 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 sm:mb-5 shadow-xs">
                  <i className="fas fa-history text-base sm:text-lg" />
                </div>
                <h3 className="font-display text-lg sm:text-xl md:text-2xl text-[var(--color-navy)] mb-2 sm:mb-2.5">
                  Multi-Sesi &amp; Riwayat Chat
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  Kelola banyak sesi percakapan analisis sekaligus. Setiap percakapan tersimpan rapi, bisa dibuka kembali kapan saja, dan tersinkronisasi antar perangkat.
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-black/[0.06]">
                <span className="text-xs text-[var(--color-ink-faint)] font-mono">
                  Sesi Baru &bull; Riwayat &bull; Hapus Sesi
                </span>
              </div>
            </div>

            {/* Card 4 - Span 2 Security & Approval */}
            <div className="md:col-span-2 apple-card p-5 sm:p-7 md:p-9 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-surface)]">
              <div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-4 sm:mb-5 text-white shadow-xs">
                  <i className="fas fa-shield-alt text-base sm:text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-[var(--color-navy)] mb-2 sm:mb-2.5">
                  Approval Gate &amp; Keamanan RBAC 3 Level
                </h3>
                <p className="text-xs sm:text-sm md:text-[15px] text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
                  Pendaftaran akun terlindungi sistem persetujuan (approval) oleh Admin/Kasubag. Penerapan isolasi data dokumen antar-bidang, autentikasi ganda Google OAuth 2.0, dan enkripsi token JWT terproteksi.
                </p>
              </div>

              <div className="mt-5 sm:mt-7 pt-4 sm:pt-5 border-t border-black/[0.06] flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
                  Admin &bull; Kasubag &bull; Tenaga Ahli
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--color-ink-faint)]">
                  SignalR Live Sync &amp; Client-Side Route Guard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4-Step Workflow Section (Cara Kerja) ─────────────── */}
      <section id="cara-kerja" className="py-12 sm:py-18 md:py-26 px-3.5 sm:px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Alur Kerja Sistematis
          </div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-2.5 sm:mb-3.5">
            Bagaimana SIPENTA Bekerja?
          </h2>
          <p className="text-xs sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
            Empat tahapan terstruktur mulai dari pengunggahan laporan hingga verifikasi bukti autentik oleh pimpinan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="apple-card p-5 sm:p-7 flex flex-col justify-between relative group hover:border-[var(--color-gold)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-navy)] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <i className={`fas ${step.icon} text-base sm:text-lg text-[var(--color-gold)]`} />
                  </div>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-black/15">
                    {step.num}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-navy)] border border-black/[0.05]">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl text-[var(--color-navy)] mb-1.5 sm:mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 sm:mt-6 pt-3 border-t border-black/[0.05] flex items-center text-[10.5px] sm:text-[11px] text-[var(--color-ink-faint)]">
                <span>Tahap {idx + 1} dari 4</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Role-Based Value Proposition ─────────────────────── */}
      <section id="peran" className="py-12 sm:py-18 md:py-26 px-3.5 sm:px-4 bg-[var(--color-surface-2)]/60 border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
              Personalisasi Kebutuhan
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-2.5 sm:mb-3.5">
              Dirancang untuk Setiap Peran di Instansi
            </h2>
            <p className="text-xs sm:text-base text-[var(--color-ink-muted)] leading-relaxed">
              Pengalaman penggunaan yang intuitif sesuai hak wewenang dan tanggung jawab masing-masing pihak.
            </p>

            {/* Role Toggle 3 Tabs - Horizontal Scroll on Mobile */}
            <div className="inline-flex max-w-full overflow-x-auto p-1 mt-5 sm:mt-6 bg-white rounded-2xl sm:rounded-full border border-black/[0.08] shadow-2xs no-scrollbar">
              <button
                onClick={() => setActiveTabRole('evaluator')}
                className={`px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTabRole === 'evaluator'
                    ? 'bg-[var(--color-navy)] text-white shadow-xs'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <i className="fas fa-user-tie mr-1.5" />
                Kasubag / Penilai
              </button>
              <button
                onClick={() => setActiveTabRole('expert')}
                className={`px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTabRole === 'expert'
                    ? 'bg-[var(--color-navy)] text-white shadow-xs'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <i className="fas fa-laptop-code mr-1.5" />
                Tenaga Ahli
              </button>
              <button
                onClick={() => setActiveTabRole('admin')}
                className={`px-3.5 sm:px-5 py-2 rounded-xl sm:rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTabRole === 'admin'
                    ? 'bg-[var(--color-navy)] text-white shadow-xs'
                    : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                }`}
              >
                <i className="fas fa-shield-alt mr-1.5" />
                Administrator
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {activeTabRole === 'evaluator' && (
              <div className="apple-card p-5 sm:p-7 md:p-9 bg-white border border-black/[0.08] shadow-md rounded-2xl animate-fade-in">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-blue-50 text-[var(--color-navy)] flex items-center justify-center text-xl sm:text-2xl border border-blue-100 shrink-0">
                    <i className="fas fa-chart-line" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-2xl text-[var(--color-navy)]">
                      Kemudahan untuk Kasubag &amp; Tim Penilai
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--color-ink-muted)]">
                      Evaluasi komprehensif, cepat, dan objektif berbasis bukti berkas laporan sah
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3.5 sm:pt-4 border-t border-black/[0.06]">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-search-plus text-indigo-600" />
                      Pencarian &amp; Shortcut Cepat
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Temukan laporan berdasarkan nama tenaga ahli, periode, atau kata kunci topik dengan shortcut keyboard <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[10px]">/</kbd>.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-tasks text-indigo-600" />
                      Ringkasan Kinerja Otomatis
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      AI merangkum capaian pekerjaan bulanan, hambatan teknis, dan rekomendasi tindak lanjut dalam hitungan detik.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-file-check text-indigo-600" />
                      Verifikasi Rujukan &amp; Bukti Foto
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Setiap jawaban AI menyertakan nomor halaman dokumen dan foto dokumentasi kegiatan asli yang dapat diperbesar.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-user-check text-indigo-600" />
                      Approval Tenaga Ahli Bidang
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Persetujuan akun pendaftar tenaga ahli baru di bawah bidang Anda secara langsung dan terkoordinasi.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabRole === 'expert' && (
              <div className="apple-card p-5 sm:p-7 md:p-9 bg-white border border-black/[0.08] shadow-md rounded-2xl animate-fade-in">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-teal-50 text-[var(--color-gold)] flex items-center justify-center text-xl sm:text-2xl border border-teal-100 shrink-0">
                    <i className="fas fa-file-upload" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-2xl text-[var(--color-navy)]">
                      Kemudahan untuk Tenaga Ahli
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--color-ink-muted)]">
                      Pengunggahan dokumen praktis, repositori teratur, dan penelusuran riwayat kerja
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3.5 sm:pt-4 border-t border-black/[0.06]">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-cloud-upload text-[var(--color-gold)]" />
                      Unggah Berkas Multi-Format
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Cukup seret dan lepas (drag-and-drop) berkas PDF, Word (DOCX), atau dokumen teks laporan bulanan Anda.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-database text-[var(--color-gold)]" />
                      Penyimpanan Cloud Aman
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Laporan tersimpan di cloud storage Google Drive terintegrasi dengan penandaan periode bidang yang rapi.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-magic text-[var(--color-gold)]" />
                      Ekstraksi Teks &amp; Foto Otomatis
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Sistem AI otomatis membedah poin pekerjaan dan foto lampiran tanpa perlu mengetik ulang isi laporan.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-history text-[var(--color-gold)]" />
                      Riwayat &amp; Asisten AI Pribadi
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Tanyakan konteks laporan bulan-bulan sebelumnya untuk menyusun laporan baru dengan bantuan Asisten AI.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTabRole === 'admin' && (
              <div className="apple-card p-5 sm:p-7 md:p-9 bg-white border border-black/[0.08] shadow-md rounded-2xl animate-fade-in">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl sm:text-2xl border border-amber-100 shrink-0">
                    <i className="fas fa-shield-alt" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-2xl text-[var(--color-navy)]">
                      Kemudahan untuk Administrator
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--color-ink-muted)]">
                      Kontrol penuh manajemen pengguna, hak akses RBAC, dan audit sistem
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3.5 sm:pt-4 border-t border-black/[0.06]">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-users-cog text-amber-600" />
                      Manajemen Pengguna &amp; Bidang
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Verifikasi pendaftaran pengguna, tentukan penempatan 6 bidang Diskominfo, dan ubah role pengguna.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-chart-pie text-amber-600" />
                      Dashboard Metrik Terpadu
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Pantau total berkas laporan, sebaran tenaga ahli, pengguna aktif, dan statistik sesi chat AI secara terpusat.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-user-shield text-amber-600" />
                      Gerbang Approval Ketat
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Filter status akun (Menunggu, Disetujui, Ditolak) untuk mencegah akses data yang tidak berwenang.
                    </p>
                  </div>
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                    <div className="text-[var(--color-navy)] font-bold text-xs sm:text-sm mb-1 flex items-center gap-2">
                      <i className="fas fa-sync text-amber-600" />
                      Sinkronisasi Live SignalR
                    </div>
                    <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                      Setiap aksi approval, unggahan baru, atau perubahan user langsung tersinkronisasi instan ke seluruh antarmuka.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── FAQ Accordion ───────────────────────────────────── */}
      <section id="faq" className="py-12 sm:py-18 md:py-26 px-3.5 sm:px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Tanya Jawab
          </div>
          <h2 className="font-display text-2xl sm:text-4xl text-[var(--color-navy)] mb-2.5 sm:mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-base text-[var(--color-ink-muted)]">
            Semua hal yang perlu Anda ketahui mengenai penggunaan dan integrasi platform SIPENTA.
          </p>
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="apple-card overflow-hidden border border-black/[0.06] rounded-xl transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-3.5 cursor-pointer hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <span className="font-display text-xs sm:text-base text-[var(--color-navy)] font-bold">
                    {faq.q}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-xs text-[var(--color-ink-faint)] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--color-gold)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-[var(--color-ink-muted)] leading-relaxed border-t border-black/[0.04] animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Call to Action Banner ─────────────────────── */}
      <section className="py-12 sm:py-18 px-3.5 sm:px-4 bg-[var(--color-navy)] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-gold)]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4 sm:mb-5 shadow-sm border border-white/20">
            <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
          </div>
          <h2 className="font-display text-xl sm:text-3xl md:text-5xl mb-3 sm:mb-4 leading-tight px-1">
            Mulai Transformasi Evaluasi Tenaga Ahli Sekarang
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light px-2">
            Tingkatkan efisiensi penelaahan dokumen kerja dan akuntabilitas evaluasi kinerja instansi Diskominfo dengan teknologi RAG AI terkini.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/dokumen"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-[var(--color-gold)] text-[var(--color-navy)] shadow-md hover:bg-[var(--color-gold-light)] active:scale-95 transition-all"
            >
              <span>Akses Dashboard Laporan</span>
              <i className="fas fa-arrow-right text-xs" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
            >
              <i className="fas fa-comment-dots text-xs text-[var(--color-gold)]" />
              <span>Buka Asisten AI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Professional Footer ──────────────────────────────── */}
      <footer className="bg-white py-8 sm:py-10 px-3.5 sm:px-4 border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-navy)] flex items-center justify-center shadow-xs shrink-0">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4.5 h-4.5 object-contain" />
            </div>
            <div>
              <span className="font-display text-sm sm:text-base tracking-wide text-[var(--color-navy)] block leading-tight">
                SIPENTA &bull; Sistem Pelaporan Tenaga Ahli
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--color-ink-faint)]">
                Dinas Komunikasi dan Informatika (Diskominfo)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs text-[var(--color-ink-muted)]">
            <Link href="/dokumen" className="hover:text-[var(--color-navy)] transition-colors">
              Laporan Kerja
            </Link>
            <Link href="/chat" className="hover:text-[var(--color-navy)] transition-colors">
              Chat AI
            </Link>
            <Link href="/admin/dashboard" className="hover:text-[var(--color-navy)] transition-colors">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-[var(--color-navy)] transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[var(--color-navy)] transition-colors">
              Daftar
            </Link>
          </div>

          <p className="text-[11px] sm:text-xs text-[var(--color-ink-faint)] text-center md:text-right">
            &copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika. Seluruh Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
