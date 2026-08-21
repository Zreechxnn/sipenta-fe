### File: \dokumen\siap\siap-fe\src\app\layout.tsx 
```tsx 
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/presentation/components/common/Providers';

export const metadata: Metadata = {
  title: 'SIPENTA - Sistem Pelaporan Tenaga Ahli',
  description: 'Platform cerdas bertenaga AI untuk membantu instansi Diskominfo menganalisis, mencari, dan memahami dokumen laporan dengan cepat dan akurat.',
  icons: {
    icon: '/sipenta.svg',
    shortcut: '/sipenta.svg',
    apple: '/sipenta.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="text-ink min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

 
``` 

### File: \dokumen\siap\siap-fe\src\app\page.tsx 
```tsx 
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTabRole, setActiveTabRole] = useState<'evaluator' | 'expert'>('evaluator');

  // Interactive AI Demo State
  const samplePrompts = [
    {
      id: 'modul-auth',
      category: '🚀 Modul & Fitur',
      label: 'Progres Modul Autentikasi',
      q: 'Bagaimana progres integrasi modul autentikasi dan keamanan sistem bulan ini?',
      a: '  Berdasarkan Laporan Kerja Tenaga Ahli Programmer (Agustus 2026):\n• Modul autentikasi telah diselesaikan 100% dengan standar token JWT dan Google OAuth 2.0.\n• Proteksi rute berbasis peran (RBAC) telah diterapkan untuk Kasubag dan Tenaga Ahli.\n• Uji penetrasi internal mencatatkan hasil aman tanpa celah otorisasi kritis.',
      source: 'Laporan_Kerja_Programmer_Agt2026.pdf (Halaman 4-6)',
      confidence: '99.4% Match',
      execTime: '0.62s',
      tags: ['Programmer', 'Agustus 2026', 'Fitur Selesai'],
    },
    {
      id: 'infra-server',
      category: '🌐 Jaringan & Server',
      label: 'Optimalisasi Server & Database',
      q: 'Apa tindakan pemeliharaan infrastruktur dan perbaikan latensi yang dilakukan tim jaringan?',
      a: '  Sesuai Laporan Kerja Tenaga Ahli Jaringan & DevOps (Agustus 2026):\n• Konfigurasi indeks database pgvector telah dioptimalkan, memangkas latensi kueri vektor hingga 64%.\n• Layanan WebSockets SignalR dipastikan berjalan stabil dengan uptime 99.98%.\n• Backup snapshot harian otomatis telah dijadwalkan ke Google Drive terenkripsi.',
      source: 'Laporan_Infrastruktur_DevOps_Agt2026.docx (Halaman 2)',
      confidence: '98.8% Match',
      execTime: '0.48s',
      tags: ['DevOps', 'Agustus 2026', 'Infrastruktur'],
    },
    {
      id: 'qa-bugfix',
      category: '🐞 Pengujian & QA',
      label: 'Hasil Uji & Perbaikan Bug',
      q: 'Bagaimana ringkasan hasil pengujian sistem dan penanganan kendala aplikasi?',
      a: '  Berdasarkan Laporan Kerja Tenaga Ahli QA (Juli 2026):\n• Sebanyak 28 kasus uji fungsional telah dijalankan pada modul akuisisi berkas dan pencarian semantik.\n• Seluruh kendala pada filter nama dan periode laporan telah tuntas diperbaiki dan lolos verifikasi produksi.',
      source: 'Laporan_Pengujian_QA_Juli2026.pdf (Halaman 8)',
      confidence: '100% Match',
      execTime: '0.51s',
      tags: ['QA Tester', 'Juli 2026', 'Verifikasi Selesai'],
    },
    {
      id: 'rekap-output',
      category: '📊 Rekapitulasi Output',
      label: 'Capaian Output Kerja Bulanan',
      q: 'Tampilkan rekapitulasi output utama yang dihasilkan seluruh tenaga ahli periode bulan ini.',
      a: '  Rekapitulasi Capaian Tenaga Ahli (Agustus 2026):\n1. Programmer: Rilis modul AI RAG dan migrasi arsitektur UI Next.js 16.\n2. Network Engineer: Peningkatan alokasi bandwidth dan monitoring trafik server 24/7.\n3. Data Specialist: Pembersihan 1.200+ chunk dokumen dan penataan repositori arsip.',
      source: 'Kompilasi_Laporan_Tenaga_Ahli_Agt2026.pdf (Halaman 1-3)',
      confidence: '99.1% Match',
      execTime: '0.74s',
      tags: ['Kompilasi Laporan', 'Agustus 2026', 'Executive Summary'],
    },
  ];

  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedDemo, setCopiedDemo] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = samplePrompts[selectedPromptIdx].a;
    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    timer = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 10);

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
      desc: 'Tenaga ahli mengunggah laporan kerja dalam format PDF, Word (DOC/DOCX), atau berkas teks dengan pengisian metadata ringkas.',
      icon: 'fa-cloud-upload-alt',
      badge: 'Multi-Upload Cepat',
    },
    {
      num: '02',
      title: 'Ekstraksi & Indeksasi AI',
      desc: 'Sistem secara otomatis membaca seluruh isi dokumen, memecahnya menjadi segmen teks terindeks (vector chunks) ke basis data cerdas.',
      icon: 'fa-microchip',
      badge: 'Embedding Semantik',
    },
    {
      num: '03',
      title: 'Tanya Jawab & Telaah Instan',
      desc: 'Kasubag atau tim penilai mengajukan pertanyaan apa pun seputar progres, kendala, atau capaian pekerjaan tanpa membaca ratusan halaman manual.',
      icon: 'fa-comments',
      badge: 'RAG Powered',
    },
    {
      num: '04',
      title: 'Verifikasi Sumber Asli',
      desc: 'Setiap ringkasan dan jawaban AI menyertakan rujukan nama dokumen dan nomor halaman sah yang bisa langsung dibuka berkas aslinya.',
      icon: 'fa-check-circle',
      badge: '100% Akurat',
    },
  ];

  const faqs = [
    {
      q: 'Apa itu platform SIPENTA?',
      a: 'SIPENTA (Sistem Informasi Pelaporan Tenaga Ahli) adalah sistem cerdas yang dikembangkan khusus untuk instansi Dinas Komunikasi dan Informatika (Diskominfo) guna mengelola, menelusuri, dan mengevaluasi dokumen laporan kerja tenaga ahli secara terpusat dengan bantuan kecerdasan buatan (AI & RAG).',
    },
    {
      q: 'Bagaimana teknologi RAG (Retrieval-Augmented Generation) bekerja di SIPENTA?',
      a: 'Saat dokumen laporan diunggah, mesin ekstraksi memecah teks menjadi potongan segmen (chunks) dan menghasilkan representasi vektor semantik. Ketika Anda bertanya, AI menelusuri segmen dokumen yang paling relevan lalu menyusun jawaban presisi dengan melampirkan kutipan dokumen sumber aslinya.',
    },
    {
      q: 'Apakah jawaban AI dapat dipercaya dan tidak mengarang (halusinasi)?',
      a: 'Sangat terpercaya. Prompt sistem SIPENTA dirancang ketat hanya menyajikan fakta yang tertulis di dalam dokumen laporan yang telah diunggah. Setiap jawaban selalu disertai badge rujukan resmi dan tombol buka dokumen asli untuk verifikasi silang.',
    },
    {
      q: 'Format berkas dokumen apa saja yang didukung oleh sistem?',
      a: 'SIPENTA mendukung format dokumen perkantoran standar: PDF (.pdf), Microsoft Word (.doc dan .docx), serta dokumen teks (.txt). Sistem dilengkapi pemrosesan OCR otomatis untuk dokumen hasil scan.',
    },
    {
      q: 'Bagaimana pembagian hak akses pengguna di SIPENTA?',
      a: 'Sistem menerapkan Role-Based Access Control (RBAC). Tenaga Ahli dapat mengunggah dan mengelola dokumen laporan mereka sendiri, sedangkan Kasubag / Penilai memiliki akses evaluasi, pencarian cerdas ke seluruh arsip laporan, dan manajemen pengguna.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)] selection:bg-[var(--color-gold-pale)] selection:text-[var(--color-navy)]">
      {/* ─── Apple-Style Frosted Header ───────────────────────── */}
      <header className="sticky top-0 z-50 apple-glass border-b border-black/[0.06] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group select-none">
            <div className="w-9 h-9 rounded-xl bg-[var(--color-navy)] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-xl tracking-wide text-[var(--color-navy)] leading-none">
                  SIPENTA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--color-gold-pale)] text-[var(--color-navy)] tracking-wider uppercase border border-amber-200/80">
                  AI v2.0
                </span>
              </div>
              <span className="text-[10px] text-[var(--color-ink-faint)] tracking-widest uppercase font-sans mt-0.5">
                Diskominfo • Pelaporan Tenaga Ahli
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-[13.5px] font-medium text-[var(--color-ink-muted)]">
            <a href="#fitur" className="hover:text-[var(--color-navy)] transition-colors">
              Fitur Unggulan
            </a>
            <a href="#demo" className="hover:text-[var(--color-navy)] transition-colors">
              Simulasi AI
            </a>
            <a href="#cara-kerja" className="hover:text-[var(--color-navy)] transition-colors">
              Cara Kerja
            </a>
            <a href="#peran" className="hover:text-[var(--color-navy)] transition-colors">
              Manfaat Pengguna
            </a>
            <a href="#faq" className="hover:text-[var(--color-navy)] transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
            >
              Masuk
            </Link>
            <Link
              href="/chat"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-white text-[var(--color-navy)] border border-black/[0.08] shadow-2xs hover:bg-[var(--color-surface-2)] transition-all"
            >
              <i className="fas fa-robot text-xs text-[var(--color-gold)]" />
              <span>Tanya AI</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium bg-[var(--color-navy)] text-white shadow-xs hover:bg-[var(--color-navy-light)] hover:shadow-md active:scale-95 transition-all"
            >
              <span>Akses Dashboard</span>
              <i className="fas fa-arrow-right text-[9px] text-[var(--color-gold)]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section (Editorial Grade) ───────────────────── */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 px-4 overflow-hidden apple-glow">
        {/* Subtle decorative background blur balls */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[720px] h-[340px] bg-gradient-to-tr from-blue-200/30 via-teal-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 rounded-full border border-black/[0.08] bg-white/90 backdrop-blur-md shadow-xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-[var(--color-ink-muted)]">
              Platform Cerdas Tata Kelola Laporan Tenaga Ahli Diskominfo
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.12] tracking-tight text-[var(--color-navy)] mb-6 max-w-4xl animate-fade-up">
            Evaluasi Laporan Tenaga Ahli. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[var(--color-navy)] via-[#1262a4] to-[#009688] bg-clip-text text-transparent">
              Cepat, Presisi, Terverifikasi.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[var(--color-ink-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-normal animate-fade-up stagger-1">
            Penelaahan dokumen laporan kerja tenaga ahli dengan teknologi <strong className="font-semibold text-[var(--color-ink)]">RAG & AI</strong>. Dapatkan ringkasan capaian, deteksi kendala, dan verifikasi progres tanpa repot membaca ratusan halaman secara manual.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-12 animate-fade-up stagger-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium bg-[var(--color-navy)] text-white shadow-sm hover:shadow-lg hover:bg-[var(--color-navy-light)] active:scale-95 transition-all"
            >
              <i className="fas fa-folder-open text-xs text-[var(--color-gold)]" />
              <span>Kelola Dokumen Laporan</span>
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium bg-white text-[var(--color-navy)] border border-black/[0.08] shadow-xs hover:bg-[var(--color-surface-2)] active:scale-95 transition-all"
            >
              <i className="fas fa-sparkles text-xs text-[var(--color-gold)]" />
              <span>Tanya AI Asisten SIPENTA</span>
            </Link>
          </div>

          {/* Quick Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-[var(--color-ink-muted)] animate-fade-up stagger-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-bolt text-amber-500 text-[11px]" />
              Pencarian Semantik &lt; 1 Detik
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-file-invoice text-blue-500 text-[11px]" />
              Dukungan PDF & Word DOCX
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-shield-alt text-emerald-500 text-[11px]" />
              Proteksi Akses Peran RBAC
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/[0.06] shadow-2xs">
              <i className="fas fa-sync-alt text-teal-500 text-[11px]" />
              Sinkronisasi Realtime SignalR
            </span>
          </div>
        </div>

        {/* ─── Interactive AI Live Simulation Showcase ──────────── */}
        <div id="demo" className="max-w-4xl mx-auto mt-12 px-2 sm:px-4 animate-scale-up stagger-3">
          <div className="apple-card overflow-hidden border border-black/[0.1] shadow-2xl rounded-2xl bg-white">
            {/* Window Titlebar */}
            <div className="bg-[var(--color-surface-2)]/90 px-4 py-3 border-b border-black/[0.06] flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block border border-black/10" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block border border-black/10" />
                <span className="ml-3 text-[11px] font-mono text-[var(--color-ink-faint)] hidden sm:inline">
                  sipenta-rag-assistant // live-demonstrator
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[var(--color-ink-faint)] hidden md:inline">
                  Latency: {samplePrompts[selectedPromptIdx].execTime}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-sync" />
                  <span className="text-[11px] font-medium text-emerald-700">RAG Engine Aktif</span>
                </div>
              </div>
            </div>

            {/* Scenario Selector Pills */}
            <div className="p-4 bg-[var(--color-surface)] border-b border-black/[0.05] flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-[var(--color-ink-muted)] uppercase tracking-wider mr-1">
                Contoh Skenario Pertanyaan:
              </span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPromptIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedPromptIdx === idx
                      ? 'bg-[var(--color-navy)] text-white shadow-xs'
                      : 'bg-white text-[var(--color-ink-muted)] border border-black/[0.07] hover:border-[var(--color-gold)] hover:text-[var(--color-navy)]'
                  }`}
                >
                  {p.category}
                </button>
              ))}
            </div>

            {/* Chat Interaction Box */}
            <div className="p-6 sm:p-8 space-y-6 bg-white">
              {/* User Question */}
              <div className="flex items-start gap-3.5 justify-end">
                <div className="max-w-xl bg-[var(--color-surface-2)] text-[var(--color-ink)] px-5 py-3.5 rounded-2xl rounded-tr-xs text-[14px] leading-relaxed shadow-2xs border border-black/[0.04]">
                  <p className="font-medium">{samplePrompts[selectedPromptIdx].q}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[var(--color-navy)] flex items-center justify-center shrink-0 text-white shadow-xs">
                  <i className="fas fa-user-tie text-xs text-[var(--color-gold)]" />
                </div>
              </div>

              {/* AI Answer */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-navy)] flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-6 h-6 object-contain" />
                </div>
                <div className="max-w-2xl flex-1 bg-white text-[var(--color-ink)] p-5 sm:p-6 rounded-2xl rounded-tl-xs text-[14px] leading-relaxed border border-black/[0.08] shadow-xs">
                  {/* Verified Citation Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200/80">
                        <i className="fas fa-bookmark text-[9px] text-[var(--color-gold)]" />
                        <span>{samplePrompts[selectedPromptIdx].source}</span>
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 hidden sm:inline">
                        <i className="fas fa-check-circle mr-1" />
                        {samplePrompts[selectedPromptIdx].confidence}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyDemo}
                      className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-navy)] flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md hover:bg-[var(--color-surface-2)] transition-all"
                      title="Salin jawaban ringkasan"
                    >
                      <i className={`fas ${copiedDemo ? 'fa-check text-emerald-600' : 'fa-copy text-[11px]'}`} />
                      <span>{copiedDemo ? 'Tersalin' : 'Salin Teks'}</span>
                    </button>
                  </div>

                  {/* Body text with typing cursor */}
                  <div className="text-[14px] leading-relaxed text-[var(--color-ink)] whitespace-pre-line">
                    {displayedText}
                    {isTyping && <span className="cursor-blink" />}
                  </div>

                  {/* Document Tags */}
                  {!isTyping && (
                    <div className="mt-4 pt-3 border-t border-black/[0.04] flex flex-wrap gap-1.5 items-center animate-fade-in">
                      <span className="text-[11px] text-[var(--color-ink-faint)] mr-1">Topik Terkait:</span>
                      {samplePrompts[selectedPromptIdx].tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-black/[0.04]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Demo Footer Strip */}
            <div className="px-6 py-3.5 bg-[var(--color-surface)] border-t border-black/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--color-ink-muted)]">
              <span className="flex items-center gap-1.5">
                <i className="fas fa-info-circle text-[var(--color-navy)]" />
                Ingin mencoba mengajukan pertanyaan kustom pada seluruh arsip laporan?
              </span>
              <Link
                href="/chat"
                className="font-medium text-[var(--color-navy)] hover:text-[var(--color-gold)] flex items-center gap-1 transition-colors"
              >
                <span>Buka Ruang Chat AI</span>
                <i className="fas fa-chevron-right text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Numbers / Impact Strip ───────────────────────────── */}
      <section className="py-14 bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-black/[0.06]">
            <div className="px-4">
              <span className="block font-display text-4xl sm:text-5xl text-[var(--color-navy)] mb-1.5">
                &lt; 1 Detik
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Kecepatan Temu Kembali Informasi
              </span>
            </div>
            <div className="px-4">
              <span className="block font-display text-4xl sm:text-5xl text-[var(--color-navy)] mb-1.5">
                100%
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Rujukan Dokumen Terverifikasi
              </span>
            </div>
            <div className="px-4">
              <span className="block font-display text-4xl sm:text-5xl text-[var(--color-navy)] mb-1.5">
                Multi-Format
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Mendukung PDF, Word, &amp; Scan OCR
              </span>
            </div>
            <div className="px-4">
              <span className="block font-display text-4xl sm:text-5xl text-[var(--color-navy)] mb-1.5">
                SPBE Ready
              </span>
              <span className="text-xs sm:text-sm font-medium text-[var(--color-ink-muted)]">
                Standar Tata Kelola Digital Pemerintah
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4-Step Workflow Section (Cara Kerja) ─────────────── */}
      <section id="cara-kerja" className="py-20 md:py-28 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Alur Kerja Sistematis
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-4">
            Bagaimana SIPENTA Bekerja?
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            Empat langkah sederhana dari pengunggahan dokumen hingga evaluasi komprehensif berbasis kecerdasan buatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              className="apple-card p-6 sm:p-7 flex flex-col justify-between relative group hover:border-[var(--color-gold)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-navy)] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <i className={`fas ${step.icon} text-lg text-[var(--color-gold)]`} />
                  </div>
                  <span className="font-mono text-2xl font-bold text-black/15">
                    {step.num}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--color-surface-2)] text-[var(--color-navy)] border border-black/[0.05]">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-display text-xl text-[var(--color-navy)] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-[var(--color-ink-muted)] leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-black/[0.05] flex items-center text-[11px] text-[var(--color-ink-faint)]">
                <span>Langkah {idx + 1} dari 4</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Apple Bento Grid Features ────────────────────────── */}
      <section id="fitur" className="py-20 md:py-28 px-4 bg-white border-y border-black/[0.06]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
              Kapabilitas Canggih
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-4">
              Fitur Dirancang Khusus untuk Efisiensi Instansi
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
              Arsitektur terintegrasi yang memadukan keamanan data, pemrosesan bahasa alami, dan kecepatan pelaporan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Large Span */}
            <div className="md:col-span-2 apple-card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-surface-2)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-6 text-white shadow-xs">
                  <i className="fas fa-brain text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--color-navy)] mb-3">
                  Retrieval-Augmented Generation (RAG) Presisi
                </h3>
                <p className="text-[15px] text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
                  Dokumen laporan dipindai, diekstrak, dan diindeks secara semantik ke dalam basis data vektor. AI hanya menjawab berdasarkan progres sah yang tercantum dalam laporan dan secara otomatis melampirkan berkas rujukan resmi.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <i className="fas fa-check-circle mr-1" />
                  Bebas Halusinasi
                </span>
                <span className="text-xs text-[var(--color-ink-faint)]">
                  Didukung LLM Groq / Embeddings Vektor Teroptimasi
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="apple-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-6 text-white shadow-xs">
                  <i className="fas fa-bolt text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-[var(--color-navy)] mb-3">
                  Sinkronisasi Real-Time
                </h3>
                <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">
                  Pembaruan berkas laporan dan penambahan data pengguna langsung tersinkronisasi seketika di seluruh browser tanpa perlu me-refresh halaman berkat WebSockets SignalR.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/[0.06]">
                <span className="text-xs font-medium text-[var(--color-navy)] flex items-center gap-1.5">
                  <i className="fas fa-wifi text-emerald-500 text-[10px]" /> SignalR Connection Active
                </span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="apple-card p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-6 text-white shadow-xs">
                  <i className="fas fa-layer-group text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl text-[var(--color-navy)] mb-3">
                  Pemeriksaan Chunk Semantik
                </h3>
                <p className="text-[14px] text-[var(--color-ink-muted)] leading-relaxed">
                  Transparansi penuh terhadap bagaimana laporan dipecah menjadi potongan segmen teks terindeks dengan alat bantu baca chunk dan navigasi keyboard cepat.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/[0.06]">
                <span className="text-xs text-[var(--color-ink-faint)] font-mono">
                  Dukungan Pintasan Keyboard Alt+← / Alt+→
                </span>
              </div>
            </div>

            {/* Card 4 - Span 2 */}
            <div className="md:col-span-2 apple-card p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white via-white to-[var(--color-surface)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[var(--color-navy)] flex items-center justify-center mb-6 text-white shadow-xs">
                  <i className="fas fa-shield-alt text-lg text-[var(--color-gold)]" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-[var(--color-navy)] mb-3">
                  Role-Based Access &amp; Keamanan Terstandar
                </h3>
                <p className="text-[15px] text-[var(--color-ink-muted)] leading-relaxed max-w-xl">
                  Pemisahan hak akses yang ketat antara Kasubag / Penilai dan Tenaga Ahli. Dilengkapi enkripsi token JWT, autentikasi ganda Google OAuth, dan isolasi repositori data antar pengguna.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-black/[0.06] flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
                  JWT &amp; OAuth 2.0
                </span>
                <span className="text-xs text-[var(--color-ink-faint)]">
                  Keamanan Terproteksi Rute API &amp; Client-Side Guard
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Role-Based Value Proposition (Untuk Siapa SIPENTA) ─ */}
      <section id="peran" className="py-20 md:py-28 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Personalisasi Kebutuhan
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[var(--color-navy)] mb-4">
            Dirancang untuk Setiap Peran di Instansi
          </h2>
          <p className="text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed">
            Menghadirkan pengalaman penggunaan yang mudah, intuitif, dan sesuai dengan tanggung jawab masing-masing pihak.
          </p>

          {/* Role Toggle Tabs */}
          <div className="inline-flex p-1 mt-6 bg-[var(--color-surface-2)] rounded-full border border-black/[0.06]">
            <button
              onClick={() => setActiveTabRole('evaluator')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTabRole === 'evaluator'
                  ? 'bg-[var(--color-navy)] text-white shadow-xs'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <i className="fas fa-user-tie mr-1.5" />
              Untuk Kasubag / Tim Penilai
            </button>
            <button
              onClick={() => setActiveTabRole('expert')}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTabRole === 'expert'
                  ? 'bg-[var(--color-navy)] text-white shadow-xs'
                  : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
              }`}
            >
              <i className="fas fa-laptop-code mr-1.5" />
              Untuk Tenaga Ahli
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {activeTabRole === 'evaluator' ? (
            <div className="apple-card p-8 sm:p-10 bg-white border border-black/[0.08] shadow-md rounded-2xl animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[var(--color-navy)] flex items-center justify-center text-2xl border border-blue-100">
                  <i className="fas fa-chart-line" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--color-navy)]">
                    Kemudahan untuk Kasubag &amp; Tim Evaluator
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    Evaluasi komprehensif, cepat, dan objektif berbasis bukti berkas laporan
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/[0.06]">
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-search-plus text-[var(--color-gold)]" />
                    Pencarian Laporan Instan
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Temukan laporan berdasarkan nama tenaga ahli, periode, atau kata kunci topik tanpa membuka berkas satu per satu.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-tasks text-[var(--color-gold)]" />
                    Ringkasan Kinerja Otomatis
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    AI merangkum capaian pekerjaan bulanan, hambatan teknis, dan rekomendasi tindak lanjut dalam hitungan detik.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-file-check text-[var(--color-gold)]" />
                    Verifikasi Bukti Sah
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Setiap jawaban AI menyertakan tautan dokumen rujukan asli sehingga penilaian tetap akuntabel dan transparan.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-users-cog text-[var(--color-gold)]" />
                    Manajemen Akun Terpusat
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Kelola data tenaga ahli, penugasan keahlian, dan pantau aktivitas sistem dari dasbor administrasi.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="apple-card p-8 sm:p-10 bg-white border border-black/[0.08] shadow-md rounded-2xl animate-fade-in">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[var(--color-gold)] flex items-center justify-center text-2xl border border-teal-100">
                  <i className="fas fa-file-upload" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-[var(--color-navy)]">
                    Kemudahan untuk Tenaga Ahli
                  </h3>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    Pengunggahan dokumen ringkas, penataan arsip rapi, dan riwayat pekerjaan terdokumentasi
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/[0.06]">
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-cloud-upload text-[var(--color-gold)]" />
                    Unggah Berkas Cepat
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Cukup seret dan lepas (drag-and-drop) berkas PDF atau Word laporan bulanan Anda ke dalam sistem.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-database text-[var(--color-gold)]" />
                    Repositori Terorganisir
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Semua laporan tersimpan aman di cloud Google Drive terintegrasi dengan penandaan periode yang rapi.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-magic text-[var(--color-gold)]" />
                    Ekstraksi Otomatis
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Tidak perlu mengetik ulang isi laporan; sistem AI otomatis mengekstraksi dan mengindeks seluruh poin pekerjaan.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-black/[0.04]">
                  <div className="text-[var(--color-navy)] font-semibold text-sm mb-1 flex items-center gap-2">
                    <i className="fas fa-history text-[var(--color-gold)]" />
                    Riwayat Kinerja Pribadi
                  </div>
                  <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
                    Akses kembali laporan kerja bulan-bulan sebelumnya kapan saja dengan mudah dan cepat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Apple-Style FAQ Accordion ────────────────────────── */}
      <section id="faq" className="py-20 md:py-28 px-4 max-w-4xl mx-auto w-full">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200">
            Tanya Jawab
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[var(--color-navy)] mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-base text-[var(--color-ink-muted)]">
            Semua hal yang perlu Anda ketahui mengenai penggunaan dan integrasi platform SIPENTA.
          </p>
        </div>

        <div className="space-y-3.5">
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
                  className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <span className="font-display text-base sm:text-lg text-[var(--color-navy)]">
                    {faq.q}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-xs text-[var(--color-ink-faint)] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[var(--color-gold)]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] text-[var(--color-ink-muted)] leading-relaxed border-t border-black/[0.04] animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Bottom Call to Action Banner ─────────────────────── */}
      <section className="py-20 px-4 bg-[var(--color-navy)] text-white text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-gold)]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-white/20">
            <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-7 h-7 object-contain" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl mb-5 leading-tight">
            Mulai Transformasi Evaluasi Tenaga Ahli Sekarang
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed font-light">
            Tingkatkan efisiensi penelaahan dokumen kerja dan akuntabilitas evaluasi kinerja instansi Diskominfo dengan teknologi AI terkini.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-medium bg-[var(--color-gold)] text-[var(--color-navy)] shadow-md hover:bg-[var(--color-gold-light)] active:scale-95 transition-all"
            >
              <span>Akses Dashboard Sistem</span>
              <i className="fas fa-arrow-right text-xs" />
            </Link>
            <Link
              href="/chat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
            >
              <i className="fas fa-comments text-xs text-[var(--color-gold)]" />
              <span>Coba Asisten AI</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Professional Footer ──────────────────────────────── */}
      <footer className="bg-white py-12 px-4 border-t border-black/[0.06]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-navy)] flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4.5 h-4.5 object-contain" />
            </div>
            <div>
              <span className="font-display text-base tracking-wide text-[var(--color-navy)] block leading-tight">
                SIPENTA • Sistem Pelaporan Tenaga Ahli
              </span>
              <span className="text-[11px] text-[var(--color-ink-faint)]">
                Dinas Komunikasi dan Informatika (Diskominfo)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--color-ink-muted)]">
            <Link href="/dashboard" className="hover:text-[var(--color-navy)] transition-colors">
              Laporan Kerja
            </Link>
            <Link href="/chat" className="hover:text-[var(--color-navy)] transition-colors">
              Chat AI
            </Link>
            <Link href="/login" className="hover:text-[var(--color-navy)] transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[var(--color-navy)] transition-colors">
              Daftar
            </Link>
          </div>

          <p className="text-xs text-[var(--color-ink-faint)] text-center md:text-right">
            &copy; {new Date().getFullYear()} Dinas Komunikasi dan Informatika. Seluruh Hak Cipta Dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
 
``` 

### File: \dokumen\siap\siap-fe\src\app\chat\page.tsx 
```tsx 
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { PendingApprovalNotice } from '@/presentation/components/common/PendingApprovalNotice';
import { ChatSidebar } from '@/presentation/components/chat/ChatSidebar';
import { ChatMessages, ChatMessagesRef } from '@/presentation/components/chat/ChatMessages';
import { ChatInput } from '@/presentation/components/chat/ChatInput';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useChat } from '@/presentation/hooks/useChat';
import { useToast } from '@/presentation/hooks/useToast';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';

export default function ChatPage() {
  const { isLoading: authLoading, isPendingApproval, checkAuth } = useAuth(true, false);
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileChatHistoryOpen, setMobileChatHistoryOpen] = useState(false);
  const chatMessagesRef = useRef<ChatMessagesRef>(null);

  const {
    sessions,
    currentSessionId,
    messages,
    isSending,
    fetchSessions,
    loadSessionDetails,
    newChat,
    deleteSession,
    sendMessage,
  } = useChat();

  const handleChatChange = useCallback((event: string, data?: any) => {
    fetchSessions();
    if (event === 'ChatSessionUpdated' && data?.sessionId && data.sessionId === currentSessionId) {
      loadSessionDetails(data.sessionId);
    }
  }, [fetchSessions, loadSessionDetails, currentSessionId]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, undefined, handleChatChange);

  useEffect(() => {
    if (!authLoading && !isPendingApproval) {
      fetchSessions();
    }
  }, [authLoading, isPendingApproval, fetchSessions]);

  if (authLoading) return null;

  const handleDeleteSession = async (id: string) => {
    const res = await deleteSession(id);
    if (!res.ok) {
      showToast('Gagal menghapus sesi: ' + (res.message || ''), true);
    }
  };

  const handleInputFocus = () => {
    chatMessagesRef.current?.scrollToBottom();
  };

  const handleSendMessage = (msg: string) => {
    if (isPendingApproval) {
      showToast('Akun Anda masih menunggu persetujuan Admin/Kasubag sebelum dapat menggunakan Asisten AI.', true);
      return;
    }
    sendMessage(msg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col animate-fadeIn">
        {/* Pending Approval Alert */}
        {isPendingApproval && (
          <div className="mb-6">
            <PendingApprovalNotice onRefresh={checkAuth} />
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <i className="fas fa-comment-dots text-base"></i>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Asisten AI Dokumen
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Sistem akan mencari konteks dokumen laporan bidang Anda serta dokumen yang dibagikan secara otomatis.
            </p>
          </div>

          {/* Mobile Chat Controls */}
          <div className="flex w-full md:hidden items-center justify-between gap-3 mt-2 pt-3 border-t border-slate-200">
            <button
              onClick={() => setMobileChatHistoryOpen(true)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <i className="fas fa-history"></i> Riwayat Sesi
            </button>
            <button
              onClick={newChat}
              disabled={isPendingApproval}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              <i className="fas fa-plus text-xs"></i> Sesi Baru
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-220px)] min-h-[480px]">
          {/* Chat Sessions History Sidebar */}
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={loadSessionDetails}
            onNewChat={newChat}
            onDeleteSession={handleDeleteSession}
            isOpenMobile={mobileChatHistoryOpen}
            onCloseMobile={() => setMobileChatHistoryOpen(false)}
          />

          {/* Chat Messages & Input Area */}
          <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col overflow-hidden relative">
            <ChatMessages 
              ref={chatMessagesRef} 
              messages={messages} 
              isSending={isSending} 
              onSelectPrompt={(prompt) => handleSendMessage(prompt)}
            />
            <ChatInput 
              onSend={handleSendMessage} 
              isSending={isSending} 
              onFocus={handleInputFocus} 
              disabled={isPendingApproval}
            />
          </div>
        </div>
      </main>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\app\dashboard\page.tsx 
```tsx 
'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { Pagination } from '@/presentation/components/common/Pagination';
import { PendingApprovalNotice } from '@/presentation/components/common/PendingApprovalNotice';
import { DocumentTable } from '@/presentation/components/documents/DocumentTable';
import { DocumentModal } from '@/presentation/components/documents/DocumentModal';
import { ShareDocumentModal } from '@/presentation/components/documents/ShareDocumentModal';
import { DocumentLoadingModal } from '@/presentation/components/documents/DocumentLoadingModal';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useDocuments } from '@/presentation/hooks/useDocuments';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { useToast } from '@/presentation/hooks/useToast';
import { Document } from '@/core/domain/document';
import { BIDANG_LIST } from '@/core/constants/bidang';

export default function DashboardPage() {
  const { isLoading: authLoading, role, bidang: userBidang, isPendingApproval, isAdmin, checkAuth } = useAuth(true, false);
  const { bidangs } = useBidangs();
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Document management hook
  const {
    documents,
    currentPage,
    totalPages,
    keyword,
    namaTenagaAhli,
    jenisDokumen,
    periodeLaporan,
    bidang,
    loading,
    setCurrentPage,
    setKeyword,
    setNamaTenagaAhli,
    setJenisDokumen,
    setPeriodeLaporan,
    setBidang,
    fetchDocuments,
    saveDocument,
    deleteDocument,
    downloadDocument,
    fetchShares,
    shareDocument,
    revokeShare,
  } = useDocuments();

  // Modals state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [sharingDoc, setSharingDoc] = useState<Document | null>(null);
  const [docToDelete, setDocToDelete] = useState<{ id: string; name?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openingDoc, setOpeningDoc] = useState<{ id: string; name?: string } | null>(null);

  // Helper for Indonesian Month & Year conversion
  const MONTH_NAMES_ID = useMemo(() => [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ], []);

  const formatMonthYearToIndonesian = useCallback((value: string): string => {
    if (/^\d{4}-\d{2}$/.test(value)) {
      const [year, monthStr] = value.split('-');
      const monthIndex = parseInt(monthStr, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
      }
    }
    return value;
  }, [MONTH_NAMES_ID]);

  const parseToMonthInput = useCallback((val: string): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}$/.test(val)) return val;
    const match = val.match(/([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const monthName = match[1].toLowerCase();
      const year = match[2];
      const monthIndex = MONTH_NAMES_ID.findIndex(m => m.toLowerCase() === monthName);
      if (monthIndex >= 0) {
        const mm = String(monthIndex + 1).padStart(2, '0');
        return `${year}-${mm}`;
      }
    }
    return '';
  }, [MONTH_NAMES_ID]);

  // Generate unique Tenaga Ahli list automatically from registered documents
  const uniqueTenagaAhliList = useMemo(() => {
    const names = new Set<string>();
    documents.forEach(doc => {
      if (doc.namaTenagaAhli && doc.namaTenagaAhli.trim()) {
        names.add(doc.namaTenagaAhli.trim());
      }
    });
    return Array.from(names).sort();
  }, [documents]);

  // Generate unique Jenis Dokumen list automatically
  const uniqueJenisDokumenList = useMemo(() => {
    const types = new Set<string>();
    documents.forEach(doc => {
      if (doc.jenisDokumen && doc.jenisDokumen.trim()) {
        types.add(doc.jenisDokumen.trim());
      }
    });
    return Array.from(types).sort();
  }, [documents]);

  // Auto-refresh document list on SignalR events
  const handleDocumentChange = useCallback((event: string, data?: any) => {
    fetchDocuments();
    if (event === 'DocumentCreated') {
      showToast('Dokumen baru telah ditambahkan!');
    } else if (event === 'DocumentUpdated') {
      showToast('Data dokumen diperbarui!');
    } else if (event === 'DocumentDeleted') {
      showToast('Dokumen telah dihapus!');
    } else if (event === 'DocumentShared') {
      showToast(`Dokumen berhasil dibagikan!`);
    } else if (event === 'DocumentAccessRevoked') {
      showToast('Hak akses dokumen dicabut!');
    }
  }, [fetchDocuments, showToast]);

  const { isConnected: isSignalRConnected } = useDataSignalR(handleDocumentChange);

  const isInitialMount = useRef(true);

  // Global shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDocuments();
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchDocuments({ page: 1, searchKey: keyword, tenagaAhli: namaTenagaAhli, jenisDok: jenisDokumen, periode: periodeLaporan, bidang });
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, namaTenagaAhli, jenisDokumen, periodeLaporan, bidang, authLoading]);

  if (authLoading) return null;

  const handleOpenUploadModal = () => {
    if (isPendingApproval) {
      showToast('Akun Anda masih menunggu persetujuan Admin/Kasubag sebelum dapat mengunggah dokumen.', true);
      return;
    }
    setEditingDoc(null);
    setIsDocModalOpen(true);
  };

  const handleOpenEditModal = (doc: Document) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  const handleShareClick = (doc: Document) => {
    setSharingDoc(doc);
  };

  const handleDeleteClick = (id: string) => {
    const target = documents.find(d => d.id === id);
    setDocToDelete({
      id,
      name: target?.nama || target?.namaFile || 'Dokumen Tanpa Judul',
    });
  };

  const handleConfirmDelete = async () => {
    if (!docToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteDocument(docToDelete.id);
      if (res.ok) {
        showToast('Dokumen berhasil dihapus');
      } else {
        showToast(res.message || 'Gagal menghapus dokumen', true);
      }
    } catch {
      showToast('Kesalahan saat menghapus dokumen', true);
    } finally {
      setIsDeleting(false);
      setDocToDelete(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword('');
    setNamaTenagaAhli('');
    setJenisDokumen('');
    setPeriodeLaporan('');
    setBidang('');
    setCurrentPage(1);
    fetchDocuments({ page: 1, searchKey: '', tenagaAhli: '', jenisDok: '', periode: '', bidang: '' });
  };

  const hasActiveFilters = Boolean(keyword || namaTenagaAhli || jenisDokumen || periodeLaporan || bidang);

  const handleShowDocument = async (id: string) => {
    const target = documents.find(d => d.id === id);
    const docName = target?.nama || target?.namaFile || 'Laporan Kerja';
    setOpeningDoc({ id, name: docName });

    try {
      await downloadDocument(id, target?.namaFile);
    } catch {
      showToast('Gagal memuat berkas dokumen', true);
    } finally {
      setTimeout(() => {
        setOpeningDoc(null);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 animate-fadeIn">
        {/* Pending Approval Notice */}
        {isPendingApproval && (
          <div className="mb-6">
            <PendingApprovalNotice onRefresh={checkAuth} />
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Laporan Kerja Tenaga Ahli
              </h1>
              {hasActiveFilters && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Filter Aktif
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {userBidang ? (
                <>
                  Bidang Anda: <strong className="text-slate-800">{userBidang}</strong> &bull; Anda dapat membaca dokumen bidang ini dan dokumen yang dibagikan secara khusus ke akun Anda.
                </>
              ) : (
                'Kelola dokumen laporan tenaga ahli di lingkungan Dinas Komunikasi dan Informatika.'
              )}
            </p>
          </div>
          
          <button
            onClick={handleOpenUploadModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            <i className="fas fa-plus text-xs"></i>
            <span>Unggah Dokumen Baru</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-6 shadow-xs flex flex-wrap gap-3 items-center">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[220px]">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Cari judul atau isi laporan... (Tekan /)"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-800"
            />
            {keyword ? (
              <button
                onClick={() => setKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs cursor-pointer"
                title="Hapus pencarian"
              >
                <i className="fas fa-times" />
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 hidden sm:inline">
                /
              </kbd>
            )}
          </div>

          {/* Bidang Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select
              value={bidang}
              onChange={e => setBidang(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium"
            >
              <option value="">Semua Bidang</option>
              {bidangs.length > 0 ? (
                bidangs.map(b => (
                  <option key={b.id} value={b.nama}>
                    {b.nama}
                  </option>
                ))
              ) : (
                <>
                  <option value="Bidang APTIKA">Bidang APTIKA</option>
                  <option value="Bidang TIK">Bidang TIK</option>
                  <option value="Bidang IKP">Bidang IKP</option>
                  <option value="Bidang Statistik">Bidang Statistik</option>
                  <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                  <option value="Sekretariat">Sekretariat</option>
                </>
              )}
            </select>
          </div>

          {/* Nama Tenaga Ahli Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[170px]">
            <select
              value={namaTenagaAhli}
              onChange={e => setNamaTenagaAhli(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium"
            >
              <option value="">Semua Tenaga Ahli</option>
              {uniqueTenagaAhliList.map(nama => (
                <option key={nama} value={nama}>
                  {nama}
                </option>
              ))}
            </select>
          </div>

          {/* Jenis Dokumen Dropdown Filter */}
          <div className="relative w-full sm:w-auto min-w-[160px]">
            <select
              value={jenisDokumen}
              onChange={e => setJenisDokumen(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer font-medium"
            >
              <option value="">Semua Jenis</option>
              {uniqueJenisDokumenList.map(jenis => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </div>

          {/* Periode Calendar Filter */}
          <div className="relative w-full sm:w-auto min-w-[150px]">
            <input
              type="month"
              value={parseToMonthInput(periodeLaporan)}
              onChange={e => {
                const val = e.target.value;
                setPeriodeLaporan(val ? formatMonthYearToIndonesian(val) : '');
              }}
              title="Pilih kalender periode bulan laporan"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-700 cursor-pointer"
            />
            {periodeLaporan && (
              <button
                onClick={() => setPeriodeLaporan('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center text-xs cursor-pointer"
                title="Hapus filter periode"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Reset semua filter"
            >
              <i className="fas fa-redo-alt text-[10px] text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Document Table */}
        <DocumentTable
          documents={documents}
          isLoading={loading}
          onShow={handleShowDocument}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteClick}
          onShare={handleShareClick}
          onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          onOpenUpload={handleOpenUploadModal}
          userRole={role?.toLowerCase()}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page => {
            setCurrentPage(page);
            fetchDocuments({ page });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* Document Loading Popup */}
      <DocumentLoadingModal
        isOpen={!!openingDoc}
        docTitle={openingDoc?.name}
        onCancel={() => setOpeningDoc(null)}
      />

      {/* Upload/Edit Modal */}
      <DocumentModal
        isOpen={isDocModalOpen}
        editingDocument={editingDoc}
        onClose={() => setIsDocModalOpen(false)}
        onSubmit={saveDocument}
        showToast={showToast}
        userBidang={userBidang}
        isAdmin={isAdmin}
      />

      {/* Share Document Modal */}
      <ShareDocumentModal
        isOpen={!!sharingDoc}
        document={sharingDoc}
        onClose={() => setSharingDoc(null)}
        onShare={shareDocument}
        onRevoke={revokeShare}
        fetchShares={fetchShares}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!docToDelete}
        title="Hapus Dokumen"
        message="Apakah Anda yakin ingin menghapus dokumen ini dari sistem? Seluruh indeksasi AI dan data pencarian terkait akan dihapus secara permanen."
        itemName={docToDelete?.name}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDocToDelete(null)}
      />

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\app\login\page.tsx 
```tsx 
'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/hooks/useToast';
import { LoginForm } from '@/presentation/components/auth/LoginForm';
import { Toast } from '@/presentation/components/common/Toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!isLoading && token) {
      const isAdmin = role && ['admin', 'kasubag'].includes(role.toLowerCase());
      router.push(isAdmin ? '/dashboard' : '/chat');
    }
  }, [token, role, isLoading, router]);

  if (isLoading || token) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-navy)' }}>
        {/* Abstract shapes / gradients */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-20 blur-[100px]" style={{ backgroundColor: 'var(--color-gold)' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-30 blur-[80px]" style={{ backgroundColor: '#1a3a5c' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide text-white">SIPENTA</span>
          </div>
          
          <div className="mt-auto max-w-sm">
            <h1 className="font-display text-4xl text-white leading-tight mb-4 animate-fade-up">
              Sistem Pelaporan<br/>
              <span className="text-white/70">Tenaga Ahli.</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed animate-fade-up stagger-1">
              Platform untuk menelusuri laporan kerja, mengevaluasi progres, dan menyusun ringkasan kinerja tenaga ahli.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-white/50 border-t border-white/10 pt-6 mt-12 animate-fade-up stagger-2">
            <span>&copy; 2026 Diskominfo</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Aman & Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-[var(--color-surface)] relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile branding */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide" style={{ color: 'var(--color-navy)' }}>SIPENTA</span>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-display mb-2" style={{ color: 'var(--color-navy)' }}>Selamat Datang</h3>
            <p className="text-[15px]" style={{ color: 'var(--color-ink-muted)' }}>Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-[var(--color-border)]">
            <Suspense fallback={<div className="text-sm text-center py-4" style={{ color: 'var(--color-ink-muted)' }}>Memuat form...</div>}>
              <LoginForm showToast={showToast} />
            </Suspense>
          </div>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\app\profile\page.tsx 
```tsx 
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useProfile } from '@/presentation/hooks/useProfile';
import { useToast } from '@/presentation/hooks/useToast';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { formatDate } from '@/presentation/utils/formatters';

export default function ProfilePage() {
  const { isLoading: authLoading } = useAuth(true, false);
  const { profile, loading, saving, fetchProfile, updateProfile } = useProfile();
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUserChange = useCallback((event: string) => {
    if (event === 'UserUpdated' || event === 'UserCreated') {
      fetchProfile();
    }
  }, [fetchProfile]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, handleUserChange);

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setUsername(profile.username || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  if (authLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showPasswordChange && newPassword) {
      if (!currentPassword) {
        showToast('Masukkan password saat ini untuk mengganti password', true);
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Konfirmasi password baru tidak cocok', true);
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password baru minimal 6 karakter', true);
        return;
      }
    }

    const payload: {
      fullName: string;
      username: string;
      email: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      fullName,
      username,
      email,
    };

    if (showPasswordChange && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    const result = await updateProfile(payload);
    if (result.ok) {
      showToast('Profil berhasil diperbarui!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
    } else {
      showToast(result.message || 'Gagal memperbarui profil', true);
    }
  };

  const getInitials = (name?: string | null, fallbackUsername?: string) => {
    const text = name?.trim() || fallbackUsername?.trim() || 'U';
    const parts = text.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface)]">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-up">
        {/* Banner Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-1.5 text-[var(--color-navy)]">Profil Pengguna</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Kelola data identitas akun dan kredensial keamanan instansi Anda.
          </p>
        </div>

        {loading && !profile ? (
          <div className="apple-card p-12 text-center shadow-xs">
            <i className="fas fa-circle-notch fa-spin text-2xl mb-4 text-[var(--color-navy)]"></i>
            <p className="text-sm text-[var(--color-ink-muted)]">Memuat data profil...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="apple-card p-8 flex flex-col items-center text-center relative overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-inner bg-[var(--color-surface-2)]">
                  <span className="font-display text-2xl text-[var(--color-navy)]">
                    {getInitials(profile?.fullName, profile?.username)}
                  </span>
                </div>

                <h2 className="text-lg font-semibold mb-0.5 text-[var(--color-ink)]">
                  {profile?.fullName || profile?.username || 'Pengguna'}
                </h2>
                <p className="text-xs mb-3 text-[var(--color-ink-muted)]">@{profile?.username}</p>

                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      ['admin', 'kasubag'].includes(profile?.role?.toLowerCase() || '')
                        ? 'text-[var(--color-gold)] bg-[var(--color-navy)]'
                        : 'text-[var(--color-navy)] bg-[var(--color-surface-2)] border border-black/[0.06]'
                    }`}
                  >
                    <i className="fas fa-shield-alt mr-1"></i> {profile?.role === 'admin' ? 'Kasubag' : (profile?.role === 'user' ? 'Tenaga Ahli' : (profile?.role || 'User'))}
                  </span>
                </div>

                <div className="w-full border-t border-black/[0.06] pt-5 text-left space-y-4">
                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1 text-[var(--color-ink-muted)]">
                      Email Terdaftar
                    </span>
                    <span className="text-sm break-all text-[var(--color-ink)]">{profile?.email || '-'}</span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider mb-1 text-[var(--color-ink-muted)]">
                      Terdaftar Sejak
                    </span>
                    <span className="text-sm text-[var(--color-ink)]">
                      {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Edit Profile Form */}
            <div className="lg:col-span-2">
              <div className="apple-card overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
                <div className="border-b border-black/[0.06] px-8 py-5 bg-[var(--color-surface)]/80">
                  <h3 className="text-base font-display text-[var(--color-navy)]">
                    Informasi Akun
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="fullName">
                        Nama Lengkap <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="username">
                        Username <span className="text-[var(--color-error)]">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="email">
                      Alamat Email <span className="text-[var(--color-error)]">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                    />
                  </div>

                  {/* Password Toggle Section */}
                  <div className="mt-8 pt-6 border-t border-black/[0.06]">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-[var(--color-ink)]">
                          Pengaturan Keamanan
                        </h4>
                        <p className="text-xs mt-0.5 text-[var(--color-ink-muted)]">
                          Perbarui kata sandi akun Anda secara berkala untuk menjaga keamanan.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-4 py-2 rounded-full text-xs font-medium transition-all border border-black/[0.09] hover:bg-black/[0.04] active:scale-95 cursor-pointer"
                      >
                        {showPasswordChange ? 'Batal Mengubah' : 'Ubah Kata Sandi'}
                      </button>
                    </div>

                    {showPasswordChange && (
                      <div className="p-5 rounded-xl border border-black/[0.07] bg-[var(--color-surface)] space-y-4 animate-fade-in mt-4">
                        <div>
                          <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                            Kata Sandi Saat Ini
                          </label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                              Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={e => setNewPassword(e.target.value)}
                              placeholder="Minimal 6 karakter"
                              className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]">
                              Konfirmasi Kata Sandi Baru
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={e => setConfirmPassword(e.target.value)}
                              className="w-full border border-black/[0.09] px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 rounded-xl transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end pt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 rounded-full text-white text-xs font-medium transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px] bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-circle-notch fa-spin mr-2 text-xs"></i>
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan Perubahan'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\app\register\page.tsx 
```tsx 
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useToast } from '@/presentation/hooks/useToast';
import { RegisterForm } from '@/presentation/components/auth/RegisterForm';
import { Toast } from '@/presentation/components/common/Toast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { token, role, isLoading } = useAuth();
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!isLoading && token) {
      const isAdmin = role && ['admin', 'kasubag'].includes(role.toLowerCase());
      router.push(isAdmin ? '/dashboard' : '/chat');
    }
  }, [token, role, isLoading, router]);

  if (isLoading || token) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Left side - Branding (hidden on mobile) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 lg:p-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-navy)' }}>
        {/* Abstract shapes / gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[100px]" style={{ backgroundColor: 'var(--color-gold)' }}></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[70%] h-[70%] rounded-full opacity-30 blur-[80px]" style={{ backgroundColor: '#1a3a5c' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-sm bg-white flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide text-white">SIPENTA</span>
          </div>
          
          <div className="mt-auto max-w-sm">
            <h1 className="font-display text-4xl text-white leading-tight mb-4 animate-fade-up">
              Sistem Pelaporan<br/>
              <span className="text-white/70">Tenaga Ahli.</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed animate-fade-up stagger-1">
              Platform untuk menelusuri laporan kerja, mengevaluasi progres, dan menyusun ringkasan kinerja tenaga ahli.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-white/50 border-t border-white/10 pt-6 mt-12 animate-fade-up stagger-2">
            <span>&copy; 2026 Diskominfo</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>Aman & Terenkripsi</span>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-16 lg:p-24 bg-[var(--color-surface)] relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile branding */}
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ backgroundColor: 'var(--color-navy)' }}>
              <img src="/sipenta.svg" alt="SIPENTA" className="w-6 h-6 object-contain" />
            </div>
            <span className="font-display text-2xl tracking-wide" style={{ color: 'var(--color-navy)' }}>SIPENTA</span>
          </div>

          <div className="mb-8">
            <h3 className="text-3xl font-display mb-2" style={{ color: 'var(--color-navy)' }}>Daftar Akun Baru</h3>
            <p className="text-[15px]" style={{ color: 'var(--color-ink-muted)' }}>Lengkapi informasi di bawah untuk membuat akun baru.</p>
          </div>

          <div className="bg-white p-8 rounded-sm shadow-sm border border-[var(--color-border)]">
            <RegisterForm showToast={showToast} />
          </div>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\app\users\page.tsx 
```tsx 
'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Header } from '@/presentation/components/common/Header';
import { MobileSidebar } from '@/presentation/components/common/MobileSidebar';
import { Toast } from '@/presentation/components/common/Toast';
import { UserTable } from '@/presentation/components/users/UserTable';
import { UserModal } from '@/presentation/components/users/UserModal';
import { ApproveUserModal } from '@/presentation/components/users/ApproveUserModal';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useUsers } from '@/presentation/hooks/useUsers';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { useDataSignalR } from '@/presentation/hooks/useDataSignalR';
import { useToast } from '@/presentation/hooks/useToast';
import { UserAccount } from '@/core/domain/user';
import { BIDANG_LIST } from '@/core/constants/bidang';

export default function UsersPage() {
  const { isLoading: authLoading } = useAuth(true, true); // requireAuth = true, requireAdmin = true
  const { toast, showToast } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { users, loading: usersLoading, fetchUsers, createUser, updateUser, approveUser, deleteUser } = useUsers();
  const { bidangs } = useBidangs();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [approvingUser, setApprovingUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [bidangFilter, setBidangFilter] = useState<string>('all');

  // Auto-refresh user list on SignalR
  const handleUserChange = useCallback((event: string, data?: any) => {
    fetchUsers();
    if (event === 'UserRegistered') {
      const username = data?.username || 'baru';
      showToast(`Pengguna baru @${username} mendaftar dan membutuhkan persetujuan!`);
    } else if (event === 'UserCreated') {
      showToast('Pengguna baru telah ditambahkan!');
    } else if (event === 'UserUpdated') {
      showToast('Data pengguna diperbarui!');
    } else if (event === 'UserDeleted') {
      showToast('Pengguna telah dihapus!');
    }
  }, [fetchUsers, showToast]);

  const { isConnected: isSignalRConnected } = useDataSignalR(undefined, handleUserChange);

  useEffect(() => {
    if (!authLoading) {
      fetchUsers();
    }
  }, [authLoading, fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const isAdmin = ['admin', 'kasubag'].includes(u.role?.toLowerCase() || '');
      const isApproved = isAdmin || u.isApproved;

      // Status filter
      if (statusFilter === 'pending' && isApproved) return false;
      if (statusFilter === 'approved' && !isApproved) return false;

      // Bidang filter
      if (bidangFilter !== 'all') {
        if (bidangFilter === 'unassigned') {
          if (u.bidang) return false;
        } else if (u.bidang !== bidangFilter) {
          return false;
        }
      }

      // Keyword search
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = u.fullName?.toLowerCase().includes(kw);
        const matchUsername = u.username.toLowerCase().includes(kw);
        const matchEmail = u.email.toLowerCase().includes(kw);
        const matchBidang = u.bidang?.toLowerCase().includes(kw);
        if (!matchName && !matchUsername && !matchEmail && !matchBidang) return false;
      }

      return true;
    });
  }, [users, statusFilter, bidangFilter, searchKeyword]);

  const stats = useMemo(() => {
    const total = users.length;
    const pending = users.filter((u) => !['admin', 'kasubag'].includes(u.role?.toLowerCase() || '') && !u.isApproved).length;
    const approved = total - pending;
    return { total, pending, approved };
  }, [users]);

  if (authLoading) return null;

  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenApprove = (user: UserAccount) => {
    setApprovingUser(user);
  };

  const handleDeleteClick = (id: string) => {
    const target = users.find(u => u.id === id);
    setUserToDelete({
      id,
      name: target?.fullName || target?.username || 'Pengguna',
    });
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await deleteUser(userToDelete.id);
      if (res.ok) {
        showToast('Pengguna berhasil dihapus');
      } else {
        showToast(res.message || 'Gagal menghapus pengguna', true);
      }
    } catch {
      showToast('Kesalahan saat menghapus pengguna', true);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header onToggleMobileSidebar={() => setMobileOpen(true)} isLiveSyncing={isSignalRConnected} />
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10 animate-fadeIn">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Manajemen Pengguna & Bidang</h1>
            <p className="text-sm text-slate-500 mt-1">
              Verifikasi pendaftaran pengguna baru, atur penempatan bidang Diskominfo, dan kelola hak akses.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 shrink-0 cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <i className="fas fa-user-plus text-xs"></i>
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-xs flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <i className="fa-solid fa-users text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengguna</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('pending')}
            className={`rounded-2xl border p-4.5 shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
              statusFilter === 'pending'
                ? 'border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20'
                : 'border-slate-200/80 bg-white hover:border-amber-300'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <i className="fa-solid fa-clock-rotate-left text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Menunggu Persetujuan</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-amber-900">{stats.pending}</p>
                {stats.pending > 0 && (
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full animate-pulse">
                    Perlu Tindakan
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter('approved')}
            className={`rounded-2xl border p-4.5 shadow-xs flex items-center gap-3.5 cursor-pointer transition-all ${
              statusFilter === 'approved'
                ? 'border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-400/20'
                : 'border-slate-200/80 bg-white hover:border-emerald-300'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <i className="fa-solid fa-circle-check text-lg"></i>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Aktif / Disetujui</p>
              <p className="text-xl font-bold text-emerald-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <i className="fa-solid fa-magnifying-glass text-xs"></i>
              </span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari nama, username, email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 w-full md:w-auto shrink-0 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Menunggu</span>
                {stats.pending > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${statusFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'}`}>
                    {stats.pending}
                  </span>
                )}
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  statusFilter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Disetujui ({stats.approved})
              </button>
            </div>

            {/* Bidang Dropdown */}
            <div className="w-full md:w-56 shrink-0">
              <select
                value={bidangFilter}
                onChange={(e) => setBidangFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-medium"
              >
                <option value="all">Semua Bidang</option>
                <option value="unassigned">-- Belum Ada Bidang --</option>
                {bidangs.length > 0 ? (
                  bidangs.map((b) => (
                    <option key={b.id} value={b.nama}>
                      {b.nama}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Bidang APTIKA">Bidang APTIKA</option>
                    <option value="Bidang TIK">Bidang TIK</option>
                    <option value="Bidang IKP">Bidang IKP</option>
                    <option value="Bidang Statistik">Bidang Statistik</option>
                    <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                    <option value="Sekretariat">Sekretariat</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <UserTable
            users={filteredUsers}
            isLoading={usersLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteClick}
            onApproveClick={handleOpenApprove}
          />
        </div>
      </main>

      {/* User Add / Edit Modal */}
      <UserModal
        isOpen={isModalOpen}
        editingUser={editingUser}
        onClose={() => setIsModalOpen(false)}
        onCreate={createUser}
        onUpdate={updateUser}
        showToast={showToast}
      />

      {/* Approve User Modal */}
      <ApproveUserModal
        isOpen={!!approvingUser}
        user={approvingUser}
        onClose={() => setApprovingUser(null)}
        onApprove={approveUser}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menghapus akun pengguna ini? Tindakan ini permanen dan pengguna tidak akan dapat login kembali."
        itemName={userToDelete?.name}
        confirmText="Hapus Pengguna"
        cancelText="Batal"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setUserToDelete(null)}
      />

      <Toast show={toast.show} message={toast.message} isError={toast.isError} />
    </div>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\constants\bidang.ts 
```tsx 
export const BIDANG_LIST = [
  'Bidang APTIKA',
  'Bidang TIK',
  'Bidang IKP',
  'Bidang Statistik',
  'Bidang Persandian dan Keamanan Informasi',
] as const;

export type BidangType = (typeof BIDANG_LIST)[number];

export const BIDANG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Bidang APTIKA': {
    bg: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
    text: 'text-blue-700',
  },
  'Bidang TIK': {
    bg: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  'Bidang IKP': {
    bg: 'bg-purple-50 text-purple-700',
    border: 'border-purple-200',
    text: 'text-purple-700',
  },
  'Bidang Statistik': {
    bg: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  'Bidang Persandian dan Keamanan Informasi': {
    bg: 'bg-rose-50 text-rose-700',
    border: 'border-rose-200',
    text: 'text-rose-700',
  },
  'Sekretariat': {
    bg: 'bg-slate-100 text-slate-700',
    border: 'border-slate-300',
    text: 'text-slate-700',
  }
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\domain\auth.ts 
```tsx 
export interface User {
  id: string;
  username: string;
  email?: string;
  fullName?: string | null;
  role: string;
  bidangId?: number | null;
  bidang?: string | null;
  isApproved?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string | null;
    role?: string;
    Role?: string;
    bidangId?: number | null;
    bidang?: string | null;
    isApproved?: boolean;
  };
  User?: {
    Role?: string;
    BidangId?: number | null;
    Bidang?: string | null;
    IsApproved?: boolean;
  };
  message?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName?: string;
  password: string;
}

export interface RegisterResponse {
  token?: string;
  user?: {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string | null;
    role?: string;
    Role?: string;
    bidangId?: number | null;
    bidang?: string | null;
    isApproved?: boolean;
    createdAt?: string;
  };
  User?: {
    Role?: string;
    BidangId?: number | null;
    Bidang?: string | null;
    IsApproved?: boolean;
  };
  sukses?: boolean;
  pesan?: string;
  message?: string;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\domain\bidang.ts 
```tsx 
export interface Bidang {
  id: number;
  nama: string;
  kode?: string;
  deskripsi?: string;
  userCount?: number;
  documentCount?: number;
  createdAt?: string;
}

export interface CreateBidangDto {
  nama: string;
  kode?: string;
  deskripsi?: string;
}

export interface UpdateBidangDto {
  nama: string;
  kode?: string;
  deskripsi?: string;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\domain\chat.ts 
```tsx 
export interface ChatSession {
  id?: string;
  Id?: string;
  title?: string;
  Title?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id?: string;
  role?: string;
  Role?: string;
  content?: string;
  Content?: string;
  timestamp?: string;
  sources?: any[];
  Sources?: any[];
}

export interface SendMessagePayload {
  message: string;
  topK?: number;
  sessionId?: string | null;
}

export interface ChatApiResponse {
  sukses?: boolean;
  Sukses?: boolean;
  pesan?: string;
  Pesan?: string;
  data?: {
    answer?: string;
    Answer?: string;
    sessionId?: string;
    SessionId?: string;
    sources?: any[];
    Sources?: any[];
  };
  Data?: {
    answer?: string;
    Answer?: string;
    sessionId?: string;
    SessionId?: string;
    sources?: any[];
    Sources?: any[];
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\domain\document.ts 
```tsx 
export interface DocumentAccessUser {
  id: string;
  userId: string;
  username: string;
  fullName?: string | null;
  email?: string | null;
  bidangId?: number | null;
  bidang?: string | null;
  accessLevel: string;
  createdAt: string;
}

export interface Document {
  id: string;
  nama?: string;
  namaFile?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string;
  bidangId?: number | null;
  bidang?: string | null;
  bidangKode?: string | null;
  ukuran?: number;
  mimeType?: string;
  tanggalUpload?: string;
  userId?: string | null;
  uploaderUsername?: string | null;
  uploaderFullName?: string | null;
  isOwner?: boolean;
  isSharedWithMe?: boolean;
  sharedWith?: DocumentAccessUser[];
}

export interface DocumentChunk {
  id?: string;
  Id?: string;
  content?: string;
  Content?: string;
  preview?: string;
  Preview?: string;
  teks?: string;
  Teks?: string;
}

export interface DocumentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string;
  bidangId?: number;
  bidang?: string;
}

export interface DocumentPagedResponse {
  sukses: boolean;
  pesan?: string;
  data: {
    data: Document[];
    totalRecords: number;
    pageSize: number;
    pageNumber: number;
  };
}

export interface SaveDocumentDto {
  id?: string;
  nama?: string;
  namaTenagaAhli?: string;
  jenisDokumen?: string;
  periodeLaporan?: string | null;
  bidangId?: number | null;
  bidang?: string | null;
  files?: FileList | File[];
}

export interface ShareDocumentDto {
  documentId: string;
  username: string;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\domain\user.ts 
```tsx 
export interface UserAccount {
  id: string;
  username: string;
  email: string;
  fullName?: string | null;
  role: string;
  bidangId?: number | null;
  bidang?: string | null;
  isApproved?: boolean;
  createdAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  fullName?: string;
  password?: string;
  roleId: number;
  bidangId?: number | null;
  bidang?: string;
  isApproved?: boolean;
}

export interface UpdateUserDto {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  password?: string;
  roleId: number;
  bidangId?: number | null;
  bidang?: string;
  isApproved?: boolean;
}

export interface ApproveUserDto {
  id: string;
  bidangId?: number | null;
  bidang: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  fullName?: string;
  currentPassword?: string;
  newPassword?: string;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\repositories\IAuthRepository.ts 
```tsx 
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../domain/auth';

export interface IAuthRepository {
  login(credentials: LoginRequest): Promise<LoginResponse>;
  googleLogin(idToken: string): Promise<LoginResponse>;
  register(data: RegisterRequest): Promise<RegisterResponse>;
  getToken(): string | null;
  getRole(): string | null;
  getUser(): any;
  setAuth(token: string, role: string, user?: any): void;
  logout(): void;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\repositories\IBidangRepository.ts 
```tsx 
import { Bidang, CreateBidangDto, UpdateBidangDto } from '../domain/bidang';

export interface IBidangRepository {
  getAll(): Promise<Bidang[]>;
  getById(id: number): Promise<Bidang>;
  create(dto: CreateBidangDto): Promise<Bidang>;
  update(id: number, dto: UpdateBidangDto): Promise<Bidang>;
  delete(id: number): Promise<boolean>;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\repositories\IChatRepository.ts 
```tsx 
import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '../domain/chat';

export interface IChatRepository {
  getSessions(): Promise<ChatSession[]>;
  getSessionDetails(sessionId: string): Promise<ChatMessage[]>;
  deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }>;
  sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse>;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\repositories\IDocumentRepository.ts 
```tsx 
import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentChunk, DocumentAccessUser } from '../domain/document';

export interface IDocumentRepository {
  getDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse>;
  getCategories(): Promise<string[]>;
  createDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }>;
  updateDocument(id: string, data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }>;
  deleteDocument(id: string): Promise<{ ok: boolean; message?: string }>;
  downloadDocument(id: string): Promise<Blob>;
  getChunks(id: string): Promise<DocumentChunk[]>;
  updateChunk(documentId: string, chunkId: string, content: string): Promise<{ ok: boolean; message?: string }>;

  // Document Sharing
  getShares(documentId: string): Promise<DocumentAccessUser[]>;
  shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }>;
  revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }>;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\repositories\IUserRepository.ts 
```tsx 
import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '../domain/user';

export interface IUserRepository {
  getUsers(): Promise<UserAccount[]>;
  createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }>;
  updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }>;
  approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }>;
  deleteUser(id: string): Promise<{ ok: boolean; message?: string }>;
  getProfile(): Promise<UserAccount>;
  updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }>;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\services\ISignalRService.ts 
```tsx 
export interface ISignalRService {
  startConnection(): Promise<void>;
  stopConnection(): Promise<void>;
  onDocumentChanged(callback: (event: string, data?: any) => void): void;
  onUserChanged(callback: (event: string, data?: any) => void): void;
  onChatChanged(callback: (event: string, data?: any) => void): void;
  offAll(): void;
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\usecases\authUseCases.ts 
```tsx 
import { IAuthRepository } from '../repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../domain/auth';

export class AuthUseCases {
  constructor(private authRepo: IAuthRepository) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await this.authRepo.login(credentials);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const result = await this.authRepo.googleLogin(idToken);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'User';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const result = await this.authRepo.register(data);
    if (result.token) {
      const user = result.user || (result.User as any) || {};
      const userRole = user.role || user.Role || 'user';
      this.authRepo.setAuth(result.token, userRole, user);
    }
    return result;
  }

  logout(): void {
    this.authRepo.logout();
  }

  getAuthState(): { token: string | null; role: string | null; isAdmin: boolean; user: any; bidangId: number | null; bidang: string | null; isApproved: boolean } {
    const token = this.authRepo.getToken();
    const role = this.authRepo.getRole();
    const user = this.authRepo.getUser();
    const isAdmin = !!(role && ['admin', 'kasubag'].includes(role.toLowerCase()));
    const bidangId = user?.bidangId ? Number(user.bidangId) : (typeof window !== 'undefined' && localStorage.getItem('bidangId') ? Number(localStorage.getItem('bidangId')) : null);
    const bidang = user?.bidang || (typeof window !== 'undefined' ? localStorage.getItem('bidang') : null);
    const isApproved = isAdmin || (user?.isApproved ?? (typeof window !== 'undefined' ? localStorage.getItem('isApproved') === 'true' : false));

    return { token, role, isAdmin, user, bidangId, bidang, isApproved };
  }
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\usecases\bidangUseCases.ts 
```tsx 
import { IBidangRepository } from '../repositories/IBidangRepository';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '../domain/bidang';

export class BidangUseCases {
  constructor(private repo: IBidangRepository) {}

  async getAllBidangs(): Promise<Bidang[]> {
    return this.repo.getAll();
  }

  async getBidangById(id: number): Promise<Bidang> {
    return this.repo.getById(id);
  }

  async createBidang(dto: CreateBidangDto): Promise<Bidang> {
    return this.repo.create(dto);
  }

  async updateBidang(id: number, dto: UpdateBidangDto): Promise<Bidang> {
    return this.repo.update(id, dto);
  }

  async deleteBidang(id: number): Promise<boolean> {
    return this.repo.delete(id);
  }
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\usecases\chatUseCases.ts 
```tsx 
import { IChatRepository } from '../repositories/IChatRepository';
import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '../domain/chat';

export class ChatUseCases {
  constructor(private chatRepo: IChatRepository) {}

  async fetchSessions(): Promise<ChatSession[]> {
    return await this.chatRepo.getSessions();
  }

  async fetchSessionDetails(sessionId: string): Promise<ChatMessage[]> {
    return await this.chatRepo.getSessionDetails(sessionId);
  }

  async deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }> {
    return await this.chatRepo.deleteSession(sessionId);
  }

  async sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
    return await this.chatRepo.sendMessage(payload);
  }
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\usecases\documentUseCases.ts 
```tsx 
import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentChunk, DocumentAccessUser } from '../domain/document';

export class DocumentUseCases {
  constructor(private docRepo: IDocumentRepository) {}

  async fetchDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse> {
    return await this.docRepo.getDocuments(params);
  }

  async fetchCategories(): Promise<string[]> {
    return await this.docRepo.getCategories();
  }

  async saveDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    if (data.id) {
      return await this.docRepo.updateDocument(data.id, data);
    } else {
      return await this.docRepo.createDocument(data);
    }
  }

  async deleteDocument(id: string): Promise<{ ok: boolean; message?: string }> {
    return await this.docRepo.deleteDocument(id);
  }

  async downloadDocument(id: string): Promise<Blob> {
    return await this.docRepo.downloadDocument(id);
  }

  async fetchChunks(id: string): Promise<DocumentChunk[]> {
    return await this.docRepo.getChunks(id);
  }

  async saveChunk(documentId: string, chunkId: string, content: string): Promise<{ ok: boolean; message?: string }> {
    return await this.docRepo.updateChunk(documentId, chunkId, content);
  }

  async fetchShares(documentId: string): Promise<DocumentAccessUser[]> {
    return await this.docRepo.getShares(documentId);
  }

  async shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }> {
    return await this.docRepo.shareDocument(documentId, username);
  }

  async revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }> {
    return await this.docRepo.revokeShare(documentId, targetUserId);
  }
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\core\usecases\userUseCases.ts 
```tsx 
import { IUserRepository } from '../repositories/IUserRepository';
import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '../domain/user';

export class UserUseCases {
  constructor(private userRepo: IUserRepository) {}

  async fetchUsers(): Promise<UserAccount[]> {
    return await this.userRepo.getUsers();
  }

  async createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.createUser(dto);
  }

  async updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.updateUser(dto);
  }

  async approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.approveUser(id, bidang);
  }

  async deleteUser(id: string): Promise<{ ok: boolean; message?: string }> {
    return await this.userRepo.deleteUser(id);
  }

  async getProfile(): Promise<UserAccount> {
    return await this.userRepo.getProfile();
  }

  async updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }> {
    return await this.userRepo.updateProfile(dto);
  }
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\api\apiClient.ts 
```tsx 
export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(payloadBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);

    if (!parsed.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return parsed.exp <= currentTime + 5;
  } catch {
    return true;
  }
}

export function handleAutoLogout(reason = 'expired'): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = `/login?reason=${reason}`;
    }
  }
}

export function getAuthHeaders(isJson = false): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        handleAutoLogout('expired');
        return headers;
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      handleAutoLogout('expired');
      throw new Error('JWT token expired');
    }
  }

  const response = await fetch(input, init);
  if (response.status === 401) {
    handleAutoLogout('unauthorized');
  }
  return response;
}

export const API_ENDPOINTS = {
  get AUTH() { return `${getApiBaseUrl()}/Auth`; },
  get DOCUMENTS() { return `${getApiBaseUrl()}/Documents`; },
  get USER() { return `${getApiBaseUrl()}/User`; },
  get CHAT() { return `${getApiBaseUrl()}/Chat`; },
  get BIDANG() { return `${getApiBaseUrl()}/bidang`; },
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\repositories\AuthRepository.ts 
```tsx 
import { IAuthRepository } from '@/core/repositories/IAuthRepository';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/core/domain/auth';
import { API_ENDPOINTS, isTokenExpired } from '../api/apiClient';

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { message: result.message || result.pesan || 'Login gagal' };
    }
    return result;
  }

  async googleLogin(idToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { message: result.message || result.pesan || 'Login with Google gagal' };
    }
    return result;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await fetch(`${API_ENDPOINTS.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        sukses: false,
        message: result.message || result.pesan || 'Registrasi gagal',
      };
    }
    return {
      sukses: true,
      message: result.message || result.pesan || 'Registrasi berhasil',
      ...result,
    };
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  getRole(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return localStorage.getItem('role');
  }

  getUser(): any {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setAuth(token: string, role: string, user?: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.bidangId) localStorage.setItem('bidangId', String(user.bidangId));
      else localStorage.removeItem('bidangId');
      if (user.bidang) localStorage.setItem('bidang', user.bidang);
      else localStorage.removeItem('bidang');
      localStorage.setItem('isApproved', String(user.isApproved ?? false));
    }
  }

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('bidangId');
    localStorage.removeItem('bidang');
    localStorage.removeItem('isApproved');
  }
}

export const authRepository = new AuthRepository();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\repositories\BidangRepository.ts 
```tsx 
import { IBidangRepository } from '@/core/repositories/IBidangRepository';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '@/core/domain/bidang';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class BidangRepository implements IBidangRepository {
  async getAll(): Promise<Bidang[]> {
    const res = await authFetch(API_ENDPOINTS.BIDANG, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const result = await res.json().catch(() => ({}));
    return result.data || [];
  }

  async getById(id: number): Promise<Bidang> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Bidang tidak ditemukan');
    const result = await res.json().catch(() => ({}));
    return result.data;
  }

  async create(dto: CreateBidangDto): Promise<Bidang> {
    const res = await authFetch(API_ENDPOINTS.BIDANG, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal menambahkan bidang');
    return result.data;
  }

  async update(id: number, dto: UpdateBidangDto): Promise<Bidang> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal memperbarui bidang');
    return result.data;
  }

  async delete(id: number): Promise<boolean> {
    const res = await authFetch(`${API_ENDPOINTS.BIDANG}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(result.pesan || result.message || 'Gagal menghapus bidang');
    return result.data ?? true;
  }
}

export const bidangRepository = new BidangRepository();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\repositories\ChatRepository.ts 
```tsx 
import { IChatRepository } from '@/core/repositories/IChatRepository';
import { ChatSession, ChatMessage, SendMessagePayload, ChatApiResponse } from '@/core/domain/chat';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class ChatRepository implements IChatRepository {
  async getSessions(): Promise<ChatSession[]> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (result.sukses || result.Sukses) {
      return result.data || result.Data || [];
    }
    return [];
  }

  async getSessionDetails(sessionId: string): Promise<ChatMessage[]> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions/${sessionId}`, { headers: getAuthHeaders() });
    const result = await res.json();
    if (result.sukses || result.Sukses) {
      const data = result.data || result.Data;
      return data?.messages || data?.Messages || [];
    }
    return [];
  }

  async deleteSession(sessionId: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.CHAT}/Sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (result.sukses || result.Sukses || res.ok) {
      return { ok: true };
    }
    return { ok: false, message: result.pesan || result.Pesan || 'Gagal menghapus sesi' };
  }

  async sendMessage(payload: SendMessagePayload): Promise<ChatApiResponse> {
    const res = await authFetch(API_ENDPOINTS.CHAT, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    return await res.json();
  }
}

export const chatRepository = new ChatRepository();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\repositories\DocumentRepository.ts 
```tsx 
import { IDocumentRepository } from '@/core/repositories/IDocumentRepository';
import { DocumentPagedResponse, DocumentQueryParams, SaveDocumentDto, DocumentChunk, DocumentAccessUser } from '@/core/domain/document';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class DocumentRepository implements IDocumentRepository {
  async getDocuments(params: DocumentQueryParams): Promise<DocumentPagedResponse> {
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 10;
    let url = `${API_ENDPOINTS.DOCUMENTS}?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (params.keyword) url += `&Keyword=${encodeURIComponent(params.keyword)}`;
    if (params.namaTenagaAhli) url += `&NamaTenagaAhli=${encodeURIComponent(params.namaTenagaAhli)}`;
    if (params.jenisDokumen) url += `&JenisDokumen=${encodeURIComponent(params.jenisDokumen)}`;
    if (params.periodeLaporan) url += `&PeriodeLaporan=${encodeURIComponent(params.periodeLaporan)}`;
    if (params.bidangId) url += `&BidangId=${params.bidangId}`;
    if (params.bidang) url += `&Bidang=${encodeURIComponent(params.bidang)}`;

    const res = await authFetch(url, { headers: getAuthHeaders() });
    const result = await res.json();
    return result;
  }

  async getCategories(): Promise<string[]> {
    try {
      const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/categories`, { headers: getAuthHeaders() });
      if (!res.ok) return [];
      const result = await res.json();
      if (result.sukses && Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result.data)) {
        return result.data;
      } else if (Array.isArray(result)) {
        return result;
      }
      return [];
    } catch {
      return [];
    }
  }

  async createDocument(data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    const formData = new FormData();
    if (data.files && data.files.length > 0) {
      for (let i = 0; i < data.files.length; i++) {
        formData.append('Files', data.files[i]);
      }
    }
    if (data.nama) formData.append('Nama', data.nama);
    if (data.namaTenagaAhli) formData.append('NamaTenagaAhli', data.namaTenagaAhli);
    if (data.jenisDokumen) formData.append('JenisDokumen', data.jenisDokumen);
    if (data.periodeLaporan) formData.append('PeriodeLaporan', data.periodeLaporan);
    if (data.bidangId) formData.append('BidangId', String(data.bidangId));
    if (data.bidang) formData.append('Bidang', data.bidang);

    const res = await authFetch(API_ENDPOINTS.DOCUMENTS, {
      method: 'POST',
      headers: getAuthHeaders(false),
      body: formData,
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal menyimpan dokumen' };
  }

  async updateDocument(id: string, data: SaveDocumentDto): Promise<{ ok: boolean; message?: string }> {
    const payload: Record<string, any> = {
      nama: data.nama,
      namaTenagaAhli: data.namaTenagaAhli,
      jenisDokumen: data.jenisDokumen,
      periodeLaporan: data.periodeLaporan || null,
    };
    if (data.bidangId) payload.bidangId = data.bidangId;
    if (data.bidang) payload.bidang = data.bidang;

    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal memperbarui dokumen' };
  }

  async deleteDocument(id: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.pesan || result.message || 'Gagal menghapus dokumen' };
  }

  async downloadDocument(id: string): Promise<Blob> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/download`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error('Gagal mengunduh dokumen');
    }
    return await res.blob();
  }

  async getChunks(id: string): Promise<DocumentChunk[]> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${id}/chunks`, {
      headers: getAuthHeaders(),
    });
    const result = await res.json();
    let data: DocumentChunk[] = [];
    if (result.sukses !== undefined) {
      if (result.data?.chunks) data = result.data.chunks;
      else if (result.data?.Chunks) data = result.data.Chunks;
      else if (Array.isArray(result.data)) data = result.data;
    } else if (result.chunks) data = result.chunks;
    else if (result.Chunks) data = result.Chunks;
    else if (Array.isArray(result)) data = result;

    return data;
  }

  async updateChunk(documentId: string, chunkId: string, content: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/chunks/${chunkId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ Content: content }),
    });

    if (res.ok) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.message || result.pesan || 'Gagal memperbarui chunk' };
  }

  // Document Sharing
  async getShares(documentId: string): Promise<DocumentAccessUser[]> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    const result = await res.json().catch(() => ({}));
    if (result.sukses && Array.isArray(result.data)) {
      return result.data;
    }
    return Array.isArray(result) ? result : [];
  }

  async shareDocument(documentId: string, username: string): Promise<{ ok: boolean; message?: string; user?: DocumentAccessUser }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ username }),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      return { ok: true, message: result.pesan || result.message, user: result.data };
    }
    return { ok: false, message: result.pesan || result.message || 'Gagal membagikan dokumen' };
  }

  async revokeShare(documentId: string, targetUserId: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.DOCUMENTS}/${documentId}/shares/${targetUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true, message: result.pesan || result.message };
    return { ok: false, message: result.pesan || result.message || 'Gagal mencabut hak akses' };
  }
}

export const documentRepository = new DocumentRepository();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\repositories\UserRepository.ts 
```tsx 
import { IUserRepository } from '@/core/repositories/IUserRepository';
import { UserAccount, CreateUserDto, UpdateUserDto, UpdateProfileDto } from '@/core/domain/user';
import { API_ENDPOINTS, getAuthHeaders, authFetch } from '../api/apiClient';

export class UserRepository implements IUserRepository {
  async getUsers(): Promise<UserAccount[]> {
    const res = await authFetch(API_ENDPOINTS.USER, { headers: getAuthHeaders() });
    if (!res.ok) {
      throw new Error('Gagal memuat pengguna');
    }
    const data = await res.json();
    return data;
  }

  async createUser(dto: CreateUserDto): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(API_ENDPOINTS.USER, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal membuat pengguna' };
  }

  async updateUser(dto: UpdateUserDto): Promise<{ ok: boolean; message?: string }> {
    const payload: Partial<UpdateUserDto> = {
      username: dto.username,
      email: dto.email,
      fullName: dto.fullName,
      roleId: dto.roleId,
      bidang: dto.bidang,
      isApproved: dto.isApproved,
    };
    if (dto.password) payload.password = dto.password;

    const res = await authFetch(`${API_ENDPOINTS.USER}/${dto.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal memperbarui pengguna' };
  }

  async approveUser(id: string, bidang: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify({ bidang }),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) return { ok: true };
    return { ok: false, message: result.message || 'Gagal menyetujui pengguna' };
  }

  async deleteUser(id: string): Promise<{ ok: boolean; message?: string }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (res.ok || res.status === 204) return { ok: true };
    const result = await res.json().catch(() => ({}));
    return { ok: false, message: result.message || 'Gagal menghapus pengguna' };
  }

  async getProfile(): Promise<UserAccount> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || 'Gagal memuat profil pengguna');
    }
    return await res.json();
  }

  async updateProfile(dto: UpdateProfileDto): Promise<{ ok: boolean; message?: string; user?: UserAccount }> {
    const res = await authFetch(`${API_ENDPOINTS.USER}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(dto),
    });
    const result = await res.json().catch(() => ({}));
    if (res.ok) {
      return { ok: true, user: result };
    }
    return { ok: false, message: result.message || 'Gagal memperbarui profil' };
  }
}

export const userRepository = new UserRepository();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\infrastructure\signalr\SignalRService.ts 
```tsx 
import * as signalR from '@microsoft/signalr';
import { ISignalRService } from '@/core/services/ISignalRService';
import { getApiBaseUrl } from '../api/apiClient';

export class SignalRService implements ISignalRService {
  private connection: signalR.HubConnection | null = null;

  private getHubUrl(): string {
    const baseUrl = getApiBaseUrl();
    return baseUrl.replace(/\/api\/?$/, '') + '/hubs/data';
  }

  async startConnection(): Promise<void> {
    if (this.connection && this.connection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    const hubUrl = this.getHubUrl();
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || '';
          }
          return '';
        },
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount > 10) return null;
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 10000);
        },
      })
      .configureLogging(signalR.LogLevel.None)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR DataHub connected to:', hubUrl);
    } catch (err) {
      console.warn('SignalR DataHub connection warning:', hubUrl);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      } finally {
        this.connection = null;
      }
    }
  }

  onDocumentChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('DocumentCreated', data => callback('DocumentCreated', data));
    this.connection.on('DocumentUpdated', data => callback('DocumentUpdated', data));
    this.connection.on('DocumentDeleted', data => callback('DocumentDeleted', data));
  }

  onUserChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('UserRegistered', data => callback('UserRegistered', data));
    this.connection.on('UserCreated', data => callback('UserCreated', data));
    this.connection.on('UserUpdated', data => callback('UserUpdated', data));
    this.connection.on('UserDeleted', data => callback('UserDeleted', data));
  }

  onChatChanged(callback: (event: string, data?: any) => void): void {
    if (!this.connection) return;
    this.connection.on('ChatSessionUpdated', data => callback('ChatSessionUpdated', data));
    this.connection.on('ChatSessionDeleted', data => callback('ChatSessionDeleted', data));
    this.connection.on('ReceiveSessionMessage', data => callback('ReceiveSessionMessage', data));
  }

  offAll(): void {
    if (this.connection) {
      this.connection.off('DocumentCreated');
      this.connection.off('DocumentUpdated');
      this.connection.off('DocumentDeleted');
      this.connection.off('UserRegistered');
      this.connection.off('UserCreated');
      this.connection.off('UserUpdated');
      this.connection.off('UserDeleted');
      this.connection.off('ChatSessionUpdated');
      this.connection.off('ChatSessionDeleted');
      this.connection.off('ReceiveSessionMessage');
    }
  }
}

export const signalRService = new SignalRService();
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\auth\LoginForm.tsx 
```tsx 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

interface LoginFormProps {
  showToast: (msg: string, isError?: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ showToast }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reason = searchParams.get('reason');
    if (reason === 'expired' || reason === 'unauthorized') {
      showToast('Sesi Anda telah berakhir (JWT Expired). Silakan login kembali.', true);
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ username, password });
      if (result.token) {
        showToast('Login berhasil!');
        const savedRole = localStorage.getItem('role');
        const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
        setTimeout(() => {
          router.push(isAdmin ? '/dashboard' : '/chat');
        }, 600);
      } else {
        showToast(result.message || 'Login gagal', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-2 text-[var(--color-ink-muted)]" htmlFor="loginUsername">
          Username
        </label>
        <input
          type="text"
          id="loginUsername"
          required
          placeholder="Ketik username Anda..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)]" htmlFor="loginPassword">
            Kata Sandi
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] transition-colors"
          >
            {showPassword ? 'Sembunyikan' : 'Tampilkan'}
          </button>
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          id="loginPassword"
          required
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-sm text-white text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center cursor-pointer mt-2"
        style={{ backgroundColor: 'var(--color-navy)' }}
        onMouseEnter={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
        }}
        onMouseLeave={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
            <span>Memproses Autentikasi...</span>
          </span>
        ) : (
          'Masuk ke Sistem'
        )}
      </button>

      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-[var(--color-border)] w-full"></div>
        <span className="bg-white px-3 absolute text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          atau
        </span>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              setLoading(true);
              try {
                const result = await googleLogin(credentialResponse.credential);
                if (result.token) {
                  showToast('Login dengan Google berhasil!');
                  const savedRole = localStorage.getItem('role');
                  const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
                  setTimeout(() => {
                    router.push(isAdmin ? '/dashboard' : '/chat');
                  }, 600);
                } else {
                  showToast(result.message || 'Login dengan Google gagal', true);
                }
              } catch {
                showToast('Terjadi kesalahan jaringan', true);
              } finally {
                setLoading(false);
              }
            }
          }}
          onError={() => {
            showToast('Login dengan Google gagal', true);
          }}
        />
      </div>

      <div className="text-center pt-4 border-t border-[var(--color-border)] text-[13px] text-[var(--color-ink-muted)]">
        Belum memiliki akun?{' '}
        <Link
          href="/register"
          className="font-medium text-[var(--color-navy)] hover:underline ml-1"
        >
          Daftar akun baru
        </Link>
      </div>
    </form>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\auth\RegisterForm.tsx 
```tsx 
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

interface RegisterFormProps {
  showToast: (msg: string, isError?: boolean) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ showToast }) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register({
        fullName,
        username,
        email,
        password,
      });
      if (result.token || result.sukses !== false) {
        showToast('Pendaftaran akun berhasil!');
        const savedRole = localStorage.getItem('role');
        const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
        setTimeout(() => {
          router.push(isAdmin ? '/dashboard' : '/chat');
        }, 600);
      } else {
        showToast(result.message || 'Registrasi gagal', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regFullName">
          Nama Lengkap
        </label>
        <input
          type="text"
          id="regFullName"
          placeholder="Contoh: Budi Santoso"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regUsername">
          Username <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="text"
          id="regUsername"
          required
          placeholder="Ketik username..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regEmail">
          Email <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="email"
          id="regEmail"
          required
          placeholder="nama@instansi.go.id"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)]"
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-wider mb-1.5 text-[var(--color-ink-muted)]" htmlFor="regPassword">
          Kata Sandi <span className="text-[var(--color-error)]">*</span>
        </label>
        <input
          type="password"
          id="regPassword"
          required
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-[var(--color-border)] px-4 py-2.5 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-colors rounded-sm text-[var(--color-ink)] font-mono"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-sm text-white text-sm font-medium transition-all shadow-xs hover:shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center cursor-pointer mt-3"
        style={{ backgroundColor: 'var(--color-navy)' }}
        onMouseEnter={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
        }}
        onMouseLeave={e => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
        }}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <i className="fas fa-circle-notch fa-spin text-xs"></i>
            <span>Mendaftarkan Akun...</span>
          </span>
        ) : (
          'Daftar Akun Baru'
        )}
      </button>

      <div className="relative my-5 flex items-center justify-center">
        <div className="border-t border-[var(--color-border)] w-full"></div>
        <span className="bg-white px-3 absolute text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
          atau
        </span>
      </div>

      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (credentialResponse.credential) {
              setLoading(true);
              try {
                const result = await googleLogin(credentialResponse.credential);
                if (result.token) {
                  showToast('Pendaftaran dengan Google berhasil!');
                  const savedRole = localStorage.getItem('role');
                  const isAdmin = savedRole && ['admin', 'kasubag'].includes(savedRole.toLowerCase());
                  setTimeout(() => {
                    router.push(isAdmin ? '/dashboard' : '/chat');
                  }, 600);
                } else {
                  showToast(result.message || 'Login dengan Google gagal', true);
                }
              } catch {
                showToast('Terjadi kesalahan jaringan', true);
              } finally {
                setLoading(false);
              }
            }
          }}
          onError={() => {
            showToast('Login dengan Google gagal', true);
          }}
        />
      </div>

      <div className="text-center pt-4 border-t border-[var(--color-border)] text-[13px] text-[var(--color-ink-muted)]">
        Sudah memiliki akun terdaftar?{' '}
        <Link
          href="/login"
          className="font-medium text-[var(--color-navy)] hover:underline ml-1"
        >
          Masuk di sini
        </Link>
      </div>
    </form>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\chat\ChatInput.tsx 
```tsx 
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isSending: boolean;
  onFocus?: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isSending, onFocus, disabled = false }) => {
  const [input, setInput] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;

    const updateOffset = () => {
      const vv = window.visualViewport;
      if (!vv) return;
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      setKeyboardOffset(Math.max(0, offset));
    };

    const vv = window.visualViewport;
    vv.addEventListener('resize', updateOffset);
    vv.addEventListener('scroll', updateOffset);

    updateOffset();

    return () => {
      vv.removeEventListener('resize', updateOffset);
      vv.removeEventListener('scroll', updateOffset);
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={keyboardOffset > 0 ? { bottom: `${keyboardOffset}px` } : undefined}
      className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-lg border-t border-black/[0.06] pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-end gap-2.5 transition-[bottom] duration-100 ease-out md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:p-4 md:pb-4 md:border-t"
    >
      <div className="relative flex-1 group">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            onFocus?.();
            setTimeout(() => {
              onFocus?.();
            }, 300);
          }}
          placeholder={disabled ? "Akun Anda sedang menunggu persetujuan Admin sebelum dapat menggunakan AI..." : "Tanyakan sesuatu mengenai laporan... (Shift+Enter untuk baris baru)"}
          disabled={disabled || isSending}
          rows={1}
          className="w-full border border-black/[0.08] px-4.5 py-3 text-[14px] bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all rounded-2xl shadow-2xs min-w-0 pr-12 resize-none overflow-y-auto leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ minHeight: '46px', maxHeight: '120px' }}
        />
        <div className="absolute right-3.5 bottom-3.5 flex items-center opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none text-[10px] font-semibold text-[var(--color-ink-faint)] uppercase tracking-widest hidden sm:block">
          ↵ Enter
        </div>
      </div>
      
      <button
        onClick={handleSend}
        disabled={disabled || isSending || !input.trim()}
        className="inline-flex items-center justify-center w-[46px] h-[46px] rounded-full transition-all text-sm cursor-pointer disabled:opacity-40 shrink-0 shadow-xs hover:shadow-md active:scale-90"
        style={{ 
          backgroundColor: 'var(--color-navy)',
          color: 'var(--color-gold)'
        }}
        onMouseEnter={e => {
          if (!isSending && input.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
          }
        }}
        onMouseLeave={e => {
          if (!isSending && input.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
          }
        }}
      >
        <i className="fas fa-arrow-up text-sm"></i>
      </button>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\chat\ChatMessages.tsx 
```tsx 
'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ChatMessage } from '@/core/domain/chat';
import { getApiBaseUrl } from '@/infrastructure/api/apiClient';
import { MarkdownRenderer } from './MarkdownRenderer';

const getSourceLabel = (src: any) => {
  const namaTenagaAhli = src.namaTenagaAhli || src.NamaTenagaAhli;
  const periodeLaporan = src.periodeLaporan || src.PeriodeLaporan;
  const title = src.documentTitle || src.DocumentTitle;
  const fileName = src.namaFile || src.NamaFile;

  if (namaTenagaAhli && periodeLaporan) {
    return `Laporan ${namaTenagaAhli} - ${periodeLaporan}`;
  }

  if (namaTenagaAhli) {
    return `Laporan ${namaTenagaAhli}`;
  }

  if (title) {
    return title.length > 45 ? title.substring(0, 42) + '...' : title;
  }

  if (fileName) {
    return fileName.length > 30 ? fileName.substring(0, 27) + '...' : fileName;
  }

  return 'Dokumen Sumber';
};

interface ChatMessagesProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSelectPrompt?: (prompt: string) => void;
}

export interface ChatMessagesRef {
  scrollToBottom: () => void;
}

const STARTER_PROMPTS = [
  {
    title: 'Progres Pekerjaan',
    prompt: 'Apa progres pengerjaan modul autentikasi bulan Agustus?',
    icon: 'fa-tasks',
  },
  {
    title: 'Penyelesaian Bug',
    prompt: 'Bagaimana status perbaikan bug pada fitur pelaporan?',
    icon: 'fa-bug',
  },
  {
    title: 'Hambatan Tim',
    prompt: 'Apa saja hambatan operasional yang dialami tim infrastruktur?',
    icon: 'fa-exclamation-triangle',
  },
];

export const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(
  ({ messages, isSending, onSelectPrompt }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [showScrollBottom, setShowScrollBottom] = useState(false);
    const [selectedLightboxImg, setSelectedLightboxImg] = useState<{ url: string; caption: string } | null>(null);

    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isNearBottom && scrollHeight > clientHeight + 100);
    };

    const handleCopy = async (text: string, index: number) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Gagal menyalin:', err);
      }
    };

    useImperativeHandle(ref, () => ({
      scrollToBottom,
    }));

    useEffect(() => {
      scrollToBottom();
    }, [messages.length, isSending]);

    return (
      <div className="flex-1 relative flex flex-col min-h-0">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8 bg-[var(--color-surface)] flex flex-col pb-28 md:pb-6"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center max-w-xl mx-auto animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-navy)] flex items-center justify-center mb-4 shadow-md border border-white/10 p-2.5">
                <img src="/sipenta.svg" alt="SIPENTA" className="w-9 h-9 object-contain" />
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-2" style={{ color: 'var(--color-navy)' }}>
                Konsultasi & Analisis Kinerja AI
              </h3>
              <p className="text-[14px] leading-relaxed mb-8 max-w-md" style={{ color: 'var(--color-ink-muted)' }}>
                Tanyakan progres pekerjaan, evaluasi, atau kendala tenaga ahli. AI akan menganalisis laporan kerja yang tersimpan di sistem dan menyajikan ringkasan terkait.
              </p>

              {/* Starter Suggestions */}
              <div className="w-full text-left space-y-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)] px-1">
                  💡 Saran Pertanyaan Cepat:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STARTER_PROMPTS.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSelectPrompt?.(item.prompt)}
                      className="p-3.5 bg-white border border-black/[0.08] rounded-xl hover:border-[var(--color-gold)] hover:shadow-xs text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <i className={`fas ${item.icon} text-xs text-[var(--color-gold)]`} />
                        <span className="text-[12px] font-semibold text-[var(--color-navy)] group-hover:text-[var(--color-navy-light)]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--color-ink-muted)] line-clamp-2 leading-snug">
                        {item.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const roleStr = (msg.role || msg.Role || '').toLowerCase();
              const isUser = roleStr === 'user';
              const content = msg.content || msg.Content || '';
              const sourcesList = msg.sources || msg.Sources || [];
              const isCopied = copiedIndex === index;

              return (
                <div
                  key={index}
                  className={`max-w-[92%] sm:max-w-[85%] w-fit relative z-10 animate-fade-up flex flex-col group ${
                    isUser ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
                        <img src="/sipenta.svg" alt="SIPENTA" className="w-4 h-4 object-contain animate-pulse-sync" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-semibold text-[var(--color-navy)] uppercase tracking-wider">
                          SIPENTA AI Analis
                        </span>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-4 sm:p-5 text-[14px] sm:text-[15px] leading-relaxed relative ${
                      isUser
                        ? 'rounded-2xl rounded-tr-xs text-white shadow-xs'
                        : 'rounded-2xl rounded-tl-xs border border-black/[0.08] bg-white text-[var(--color-ink)] shadow-xs'
                    }`}
                    style={{
                      backgroundColor: isUser ? 'var(--color-navy)' : '#fff',
                    }}
                  >
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                      <div>
                        {sourcesList && sourcesList.length > 0 && (() => {
                          const uniqueSources: any[] = [];
                          const seenLabels = new Set<string>();
                          const allImages: any[] = [];

                          sourcesList.forEach((src: any) => {
                            const label = getSourceLabel(src);
                            if (!seenLabels.has(label)) {
                              seenLabels.add(label);
                              uniqueSources.push({ ...src, _label: label });
                            }
                            const imgs = src.images || src.Images || [];
                            imgs.forEach((img: any) => {
                              allImages.push({
                                ...img,
                                sourceLabel: label,
                              });
                            });
                          });

                          return (
                            <div className="space-y-2.5 pb-3 mb-4 border-b border-[var(--color-border)]">
                              <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] flex items-center gap-1">
                                  <i className="fas fa-bookmark text-[var(--color-gold)] text-[9px]" /> Rujukan Laporan:
                                </span>
                                {uniqueSources.map((src: any, srcIdx: number) => (
                                  <span
                                    key={srcIdx}
                                    className="text-[11px] font-medium px-2.5 py-1 rounded-sm flex items-center gap-1.5 border border-amber-200/60"
                                    style={{ backgroundColor: 'var(--color-gold-pale)', color: 'var(--color-navy)' }}
                                  >
                                    <i className="fas fa-file-pdf text-[10px]"></i>
                                    {src._label}
                                  </span>
                                ))}
                              </div>

                              {allImages.length > 0 && (
                                <div className="pt-1.5">
                                  <div className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                                    <i className="fas fa-camera text-amber-500 text-[10px]" />
                                    <span>Foto / Dokumentasi Terlampir ({allImages.length}):</span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {allImages.map((img: any, imgIdx: number) => {
                                      const rawUrl = img.url || img.Url || img.filePath || img.FilePath || '';
                                      const fullUrl = rawUrl.startsWith('http')
                                        ? rawUrl
                                        : `${getApiBaseUrl().replace(/\/api\/?$/, '')}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;

                                      return (
                                        <div
                                          key={imgIdx}
                                          onClick={() => setSelectedLightboxImg({ url: fullUrl, caption: img.caption || img.Caption || `Hal. ${img.pageNumber || img.PageNumber || 1}` })}
                                          className="group/img relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-pointer shadow-xs hover:shadow-md hover:border-amber-400 transition-all shrink-0"
                                          title={img.caption || img.Caption || 'Klik untuk memperbesar'}
                                        >
                                          <img
                                            src={fullUrl}
                                            alt={img.caption || img.Caption || 'Dokumentasi'}
                                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                            loading="lazy"
                                          />
                                          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                            <i className="fas fa-search-plus text-white text-xs" />
                                          </div>
                                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[9px] text-white truncate font-medium">
                                            Hal. {img.pageNumber || img.PageNumber || 1}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        <MarkdownRenderer content={content} />
                      </div>
                    )}
                  </div>
                  
                  {/* Quick Copy Action Bar - MOVED OUTSIDE THE MESSAGE BUBBLE */}
                  <div
                    className={`flex items-center gap-1 mt-1.5 text-[11px] transition-opacity duration-200 ${
                      isUser
                        ? 'text-slate-400 justify-end'
                        : 'text-[var(--color-ink-faint)] justify-between w-full'
                    }`}
                  >
                    {!isUser && (
                      <span className="text-[10px] uppercase tracking-wider text-[var(--color-ink-faint)] ml-1">
                        Analisis Laporan Tenaga Ahli
                      </span>
                    )}
                    <button
                      onClick={() => handleCopy(content, index)}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-all cursor-pointer ${
                        isUser
                          ? 'hover:bg-black/5 text-slate-500'
                          : 'hover:bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                      }`}
                      title="Salin pesan ke clipboard"
                    >
                      <i className={`fas ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy'} text-[10px]`} />
                      <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                  
                </div>
              );
            })
          )}

          {isSending && (
            <div className="max-w-[90%] sm:max-w-[85%] w-fit self-start mr-auto relative z-10 animate-fade-up flex flex-col">
              <div className="flex items-center gap-2 mb-1.5 ml-1">
                <div className="w-5 h-5 rounded-xs flex items-center justify-center shadow-xs" style={{ backgroundColor: 'var(--color-navy)' }}>
                  <i className="fas fa-robot text-[9px]" style={{ color: 'var(--color-gold)' }}></i>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-navy)]">
                  SIPENTA AI Analis
                </span>
              </div>
              <div
                className="p-4 sm:p-5 rounded-tr-lg rounded-br-lg rounded-bl-lg border bg-white shadow-xs flex items-center gap-3"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-[var(--color-navy)] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm font-medium text-[var(--color-ink-muted)]">
                  Mencari data laporan & menyusun jawaban...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 md:bottom-4 right-6 z-20 w-9 h-9 rounded-full bg-[var(--color-navy)] text-white shadow-md hover:bg-[var(--color-navy-light)] flex items-center justify-center transition-all duration-200 animate-scale-up active:scale-95 cursor-pointer border border-white/20"
            title="Gulir ke pesan terbaru"
          >
            <i className="fas fa-arrow-down text-xs text-[var(--color-gold)]" />
          </button>
        )}

        {/* Image Preview Lightbox */}
        {selectedLightboxImg && (
          <div 
            onClick={() => setSelectedLightboxImg(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold truncate">
                  <i className="fas fa-camera text-amber-400" />
                  <span>{selectedLightboxImg.caption || 'Foto Dokumentasi Laporan'}</span>
                </div>
                <button 
                  onClick={() => setSelectedLightboxImg(null)}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="p-2 bg-slate-950 flex items-center justify-center overflow-auto max-h-[80vh]">
                <img
                  src={selectedLightboxImg.url}
                  alt={selectedLightboxImg.caption || 'Dokumentasi'}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatMessages.displayName = 'ChatMessages';
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\chat\ChatSidebar.tsx 
```tsx 
'use client';

import React from 'react';
import { ChatSession } from '@/core/domain/chat';
import { ConfirmModal } from '@/presentation/components/common/ConfirmModal';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const handleSelect = (id: string) => {
    onSelectSession(id);
    if (onCloseMobile) onCloseMobile();
  };

  const handleNew = () => {
    onNewChat();
    if (onCloseMobile) onCloseMobile();
  };

  const [sessionToDelete, setSessionToDelete] = React.useState<{ id: string; title: string } | null>(null);

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  };

  const content = (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center shrink-0 bg-[var(--color-surface)]">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-base text-[var(--color-navy)]">Riwayat Sesi</h3>
          {sessions.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-muted)] border border-[var(--color-border)]">
              {sessions.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-medium rounded-sm bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-light)] transition-all shadow-2xs active:scale-95 cursor-pointer"
            title="Mulai sesi baru"
          >
            <i className="fas fa-plus text-[10px] text-[var(--color-gold)]" />
            <span className="hidden sm:inline">Baru</span>
          </button>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden w-7 h-7 rounded-sm hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)]"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          )}
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {sessions.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-2 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-2)] text-[var(--color-ink-faint)] flex items-center justify-center mx-auto">
              <i className="fas fa-history text-xs" />
            </div>
            <p className="text-[13px] font-medium text-[var(--color-ink-muted)]">Belum ada riwayat</p>
            <p className="text-[11px] text-[var(--color-ink-faint)]">
              Pertanyaan yang Anda ajukan akan otomatis tersimpan di sini.
            </p>
          </div>
        ) : (
          sessions.map(session => {
            const id = session.id || session.Id || '';
            const title = session.title || session.Title || 'Analisis Baru';
            const isSelected = id === currentSessionId;

            return (
              <div
                key={id}
                onClick={() => handleSelect(id)}
                className={`group flex justify-between items-center px-3 py-2.5 rounded-sm cursor-pointer transition-all duration-150 relative overflow-hidden ${
                  isSelected
                    ? 'bg-[var(--color-surface-2)] shadow-2xs'
                    : 'hover:bg-[var(--color-surface)]'
                }`}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-gold)] animate-fade-in" />
                )}
                
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <i className={`fas fa-comment-alt text-[11px] shrink-0 ${isSelected ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink-faint)]'}`} />
                  <span 
                    className={`truncate text-[13px] ${isSelected ? 'font-medium text-[var(--color-navy)]' : 'text-[var(--color-ink)]'}`}
                  >
                    {title}
                  </span>
                </div>
                
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSessionToDelete({ id, title });
                  }}
                  className={`w-6 h-6 rounded-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${
                    isSelected ? 'opacity-70 hover:opacity-100' : ''
                  } text-[var(--color-ink-muted)] hover:text-white hover:bg-[var(--color-error)] active:scale-95`}
                  title="Hapus sesi"
                >
                  <i className="fas fa-trash-alt text-[10px]"></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!sessionToDelete}
        title="Hapus Sesi Analisis"
        message="Riwayat percakapan ini akan dihapus dari arsip Anda."
        itemName={sessionToDelete?.title}
        confirmText="Hapus Sesi"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onClose={() => setSessionToDelete(null)}
      />
    </div>
  );

  return (
    <>
      {/* Desktop view (always visible on md+) */}
      <div className="hidden md:flex w-72 apple-card bg-white border border-black/[0.07] rounded-2xl shadow-xs flex-col overflow-hidden shrink-0">
        {content}
      </div>

      {/* Mobile Drawer view */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm cursor-pointer animate-backdrop"
            onClick={onCloseMobile}
          ></div>

          {/* Drawer container */}
          <div className="relative w-[85%] max-w-sm h-full bg-white z-10 flex flex-col animate-slide-left shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\chat\MarkdownRenderer.tsx 
```tsx 
'use client';

import React, { useState } from 'react';

import { getApiBaseUrl } from '@/infrastructure/api/apiClient';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Component for rendering images with click-to-enlarge lightbox
const ChatImage: React.FC<{ src: string; alt?: string }> = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(false);

  const cleanSrc = (src || '').replace(/^url\s*=\s*/i, '').trim();

  const fullUrl = cleanSrc.startsWith('http')
    ? cleanSrc
    : `${getApiBaseUrl().replace(/\/api\/?$/, '')}${cleanSrc.startsWith('/') ? '' : '/'}${cleanSrc}`;

  if (error || !cleanSrc) return null;

  return (
    <>
      <div className="my-2.5 max-w-sm rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-xs group">
        <div 
          onClick={() => setIsOpen(true)}
          className="relative cursor-zoom-in overflow-hidden bg-slate-100 max-h-60 flex items-center justify-center"
        >
          <img
            src={fullUrl}
            alt={alt || 'Foto Dokumentasi'}
            onError={() => setError(true)}
            className="w-full h-auto max-h-60 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="bg-black/75 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xs">
              <i className="fas fa-search-plus text-[10px]" /> Perbesar
            </span>
          </div>
        </div>
        {alt && (
          <div className="px-3 py-1.5 bg-slate-50/70 border-t border-slate-100 text-[11px] text-slate-600 font-medium truncate flex items-center gap-1.5">
            <i className="fas fa-image text-slate-400 text-[10px]" />
            <span>{alt}</span>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white">
              <div className="flex items-center gap-2 text-xs font-semibold truncate">
                <i className="fas fa-camera text-amber-400" />
                <span>{alt || 'Foto Dokumentasi Laporan'}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="p-2 bg-slate-950 flex items-center justify-center overflow-auto max-h-[80vh]">
              <img
                src={fullUrl}
                alt={alt || 'Foto Dokumentasi'}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Component for code block with copy button
const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-3 border border-[var(--color-border)] bg-[var(--color-navy)] text-slate-100 rounded-sm shadow-xs overflow-hidden">
      <div className="bg-[var(--color-navy-light)] text-slate-300 text-[11px] px-3.5 py-1.5 font-mono uppercase tracking-wider border-b border-slate-700/50 flex justify-between items-center">
        <span>{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10.5px] cursor-pointer"
          title="Salin kode"
        >
          <i className={`fas ${copied ? 'fa-check text-emerald-400' : 'fa-copy text-[var(--color-gold)]'}`} />
          <span>{copied ? 'Tersalin' : 'Salin'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[13px] font-mono leading-relaxed bg-[#0b1c30]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// Helper to parse inline tokens: bold (**), italic (*), strikethrough (~~), inline code (`), citations (【...】), html linebreaks (<br>), images (![...](...)), and links
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  const inlineRegex = /(<br\s*\/?>|`[^`]+`|!\[[^\]]*\]\([^)]+\)|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|~~[^~]+~~|【[^】]+】|\[[^\]]+\]\([^)]+\))/gi;

  const parts = text.split(inlineRegex);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (!part) return;

    if (/^<br\s*\/?>$/i.test(part)) {
      elements.push(<br key={`br-${index}`} className="my-0.5" />);
    } else if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      elements.push(
        <code
          key={index}
          className="bg-[var(--color-surface-2)] text-[var(--color-navy)] px-1.5 py-0.5 rounded-xs font-mono text-[12px] border border-[var(--color-border)] mx-0.5 inline-block font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    } else if (part.startsWith('![') && part.includes('](') && part.endsWith(')')) {
      const imgMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        const [, alt, src] = imgMatch;
        elements.push(<ChatImage key={`img-${index}`} src={src} alt={alt} />);
      } else {
        elements.push(part);
      }
    } else if (
      (part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
      (part.startsWith('___') && part.endsWith('___') && part.length >= 6)
    ) {
      elements.push(
        <strong key={index} className="font-semibold italic text-[var(--color-ink)]">
          {parseInline(part.slice(3, -3))}
        </strong>
      );
    } else if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      elements.push(
        <strong key={index} className="font-semibold text-[var(--color-ink)]">
          {parseInline(part.slice(2, -2))}
        </strong>
      );
    } else if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      elements.push(
        <em key={index} className="italic">
          {parseInline(part.slice(1, -1))}
        </em>
      );
    } else if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      elements.push(
        <del key={index} className="line-through opacity-70">
          {parseInline(part.slice(2, -2))}
        </del>
      );
    } else if (part.startsWith('【') && part.endsWith('】')) {
      const citationText = part.slice(1, -1);
      elements.push(
        <span
          key={index}
          className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 mx-1 my-0.5 bg-[var(--color-gold-pale)] text-[var(--color-navy)] border border-amber-200/80 rounded-xs"
          title={citationText}
        >
          <i className="fas fa-bookmark text-[9px] mr-1.5 text-[var(--color-gold)]"></i>
          {citationText}
        </span>
      );
    } else if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, linkText, url] = match;
        elements.push(
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-navy)] underline font-medium hover:text-[var(--color-gold)] transition-colors inline-flex items-center gap-1"
          >
            {linkText}
            <i className="fas fa-external-link-alt text-[9px]"></i>
          </a>
        );
      } else {
        elements.push(part);
      }
    } else {
      elements.push(part);
    }
  });

  return elements;
}

// Helper to parse table rows
function parseTableRow(rowStr: string): string[] {
  let trimmed = rowStr.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map(cell => cell.trim());
}

// Helper to parse table alignments
function parseTableAlignments(dividerStr: string): ('left' | 'center' | 'right')[] {
  const cells = parseTableRow(dividerStr);
  return cells.map(cell => {
    const hasLeft = cell.startsWith(':');
    const hasRight = cell.endsWith(':');
    if (hasLeft && hasRight) return 'center';
    if (hasRight) return 'right';
    return 'left';
  });
}

function isTableDivider(line: string): boolean {
  const trimmed = line.trim();
  return /^\|?(\s*:?-{2,}:?\s*\|?)+$/.test(trimmed);
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content) return null;

  // Split content by code blocks first
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={`space-y-3 leading-relaxed font-normal text-[var(--color-ink)] ${className}`}>
      {blocks.map((block, blockIndex) => {
        if (!block) return null;

        // Fenced code block
        if (block.startsWith('```') && block.endsWith('```')) {
          const match = block.match(/^```([a-zA-Z0-9_-]*)\n([\s\S]*?)```$/);
          const lang = match ? match[1] : '';
          const code = match ? match[2] : block.slice(3, -3);

          return <CodeBlock key={blockIndex} code={code} lang={lang} />;
        }

        // Standard text lines
        const lines = block.split('\n');
        const renderedElements: React.ReactNode[] = [];
        let currentListItems: React.ReactNode[] = [];
        let isOrderedList = false;

        const flushList = () => {
          if (currentListItems.length > 0) {
            const listKey = `list-${renderedElements.length}`;
            if (isOrderedList) {
              renderedElements.push(
                <ol key={listKey} className="list-decimal pl-5 space-y-1.5 my-2 font-normal">
                  {currentListItems}
                </ol>
              );
            } else {
              renderedElements.push(
                <ul key={listKey} className="space-y-2 my-2 font-normal">
                  {currentListItems}
                </ul>
              );
            }
            currentListItems = [];
            isOrderedList = false;
          }
        };

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim();

          if (!trimmed) {
            flushList();
            continue;
          }

          // Check if this is the start of a Markdown Table
          if (
            trimmed.includes('|') &&
            i + 1 < lines.length &&
            isTableDivider(lines[i + 1])
          ) {
            flushList();
            const headerRow = parseTableRow(trimmed);
            const alignments = parseTableAlignments(lines[i + 1]);
            const bodyRows: string[][] = [];

            i += 2;
            while (i < lines.length && lines[i].trim().includes('|')) {
              bodyRows.push(parseTableRow(lines[i]));
              i++;
            }
            i--;

            renderedElements.push(
              <div
                key={`table-${renderedElements.length}`}
                className="overflow-x-auto my-3 border border-[var(--color-border)] bg-white rounded-sm shadow-xs"
              >
                <table className="min-w-full border-collapse text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                      {headerRow.map((headerText, colIdx) => (
                        <th
                          key={colIdx}
                          className="py-2.5 px-3.5 font-semibold text-[var(--color-navy)] uppercase tracking-wider text-[11px]"
                          style={{ textAlign: alignments[colIdx] || 'left' }}
                        >
                          {parseInline(headerText)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {bodyRows.map((rowCells, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-[var(--color-surface)] transition-colors"
                      >
                        {rowCells.map((cellText, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="py-2.5 px-3.5 align-top leading-relaxed"
                            style={{ textAlign: alignments[cellIdx] || 'left' }}
                          >
                            {parseInline(cellText)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
            continue;
          }

          // Unordered List (- or * or +)
          const unorderedMatch = line.match(/^(\s*)([-*+])\s+(.+)$/);
          if (unorderedMatch) {
            if (isOrderedList && currentListItems.length > 0) {
              flushList();
            }
            isOrderedList = false;
            const itemContent = unorderedMatch[3];
            currentListItems.push(
              <li key={`ul-item-${i}`} className="flex items-start gap-2.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] mt-2 shrink-0"></span>
                <span className="flex-1 leading-relaxed">{parseInline(itemContent)}</span>
              </li>
            );
            continue;
          }

          // Ordered List (1. 2. etc)
          const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
          if (orderedMatch) {
            if (!isOrderedList && currentListItems.length > 0) {
              flushList();
            }
            isOrderedList = true;
            const itemContent = orderedMatch[3];
            currentListItems.push(
              <li key={`ol-item-${i}`} className="pl-1 leading-relaxed">
                {parseInline(itemContent)}
              </li>
            );
            continue;
          }

          // Not a list item, flush any active list
          flushList();

          // Headings
          if (line.startsWith('### ')) {
            renderedElements.push(
              <h3 key={i} className="text-[15px] font-semibold text-[var(--color-navy)] mt-3 mb-1 font-display">
                {parseInline(line.slice(4))}
              </h3>
            );
          } else if (line.startsWith('## ')) {
            renderedElements.push(
              <h2 key={i} className="text-[17px] font-semibold text-[var(--color-navy)] mt-4 mb-1.5 border-b border-[var(--color-border)] pb-1 font-display">
                {parseInline(line.slice(3))}
              </h2>
            );
          } else if (line.startsWith('# ')) {
            renderedElements.push(
              <h1 key={i} className="text-xl font-bold text-[var(--color-navy)] mt-4 mb-2 border-b border-[var(--color-border)] pb-1 font-display">
                {parseInline(line.slice(2))}
              </h1>
            );
          } else if (line.startsWith('> ')) {
            renderedElements.push(
              <blockquote
                key={i}
                className="border-l-2 border-[var(--color-gold)] pl-3.5 py-1.5 my-2 italic bg-[var(--color-surface)] text-[var(--color-ink-muted)] rounded-r-xs"
              >
                {parseInline(line.slice(2))}
              </blockquote>
            );
          } else {
            // Normal paragraph line
            renderedElements.push(
              <p key={i} className="leading-relaxed">
                {parseInline(line)}
              </p>
            );
          }
        }

        // Flush remaining list if any
        flushList();

        return <React.Fragment key={blockIndex}>{renderedElements}</React.Fragment>;
      })}
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\ConfirmModal.tsx 
```tsx 
'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Konfirmasi Penghapusan',
  message = 'Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen.',
  itemName,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />
      
      {/* Modal */}
      <div className="w-full max-w-sm bg-white rounded-sm shadow-xl relative animate-scale-up border border-[var(--color-border)] overflow-hidden">
        {/* Header line */}
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--color-error)' }} />
        
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--color-error)', opacity: 0.1 }}>
              <i className="fas fa-exclamation-triangle text-lg" style={{ color: 'var(--color-error)', opacity: 1 }}></i>
            </div>
            <div>
              <h3 className="text-lg font-display mb-1" style={{ color: 'var(--color-ink)' }}>{title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--color-ink-muted)' }}>
                {message}
              </p>
            </div>
          </div>

          {itemName && (
            <div className="mt-4 p-3 rounded-sm border flex items-start gap-2" style={{ backgroundColor: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <i className="fas fa-file-alt mt-0.5 text-[11px]" style={{ color: 'var(--color-ink-faint)' }}></i>
              <span className="text-[13px] font-medium break-words leading-tight" style={{ color: 'var(--color-ink)' }}>{itemName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 bg-[var(--color-surface)] border-t border-[var(--color-border)] justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-sm text-sm font-medium transition-colors border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-2)] disabled:opacity-50"
            style={{ color: 'var(--color-ink)' }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 rounded-sm text-sm font-medium text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-error)' }}
            onMouseEnter={e => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#8a1d2e';
            }}
            onMouseLeave={e => {
              if (!isLoading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-error)';
            }}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin text-[11px]"></i>
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\Header.tsx 
```tsx 
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  isLiveSyncing?: boolean;
}

interface NavItemConfig {
  href: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  { href: '/dashboard', label: 'Laporan Kerja', icon: 'fa-file-alt' },
  { href: '/users', label: 'Pengguna', icon: 'fa-users', adminOnly: true },
  { href: '/chat', label: 'Chat AI', icon: 'fa-comments' },
  { href: '/profile', label: 'Profil', icon: 'fa-id-card' },
];

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, isLiveSyncing = true }) => {
  const pathname = usePathname();
  const { token, isAdmin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const [sliderStyle, setSliderStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
    opacity: number;
  }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const navRef = useRef<HTMLElement>(null);
  const availableNavItems = useMemo(
    () => NAV_ITEMS.filter(item => !item.adminOnly || isAdmin),
    [isAdmin]
  );

  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const currentTargetHref = hoveredHref || (availableNavItems.find(i => i.href === pathname)?.href || '');

  // Update slider coordinates whenever target, pathname, or window changes
  useEffect(() => {
    if (!token) return;

    const activeEl = itemRefs.current[currentTargetHref];
    if (activeEl && navRef.current) {
      setSliderStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1,
      });
    } else {
      // Check if current pathname matches any item
      const isAnyActive = availableNavItems.some(item => item.href === pathname);
      if (!isAnyActive && !hoveredHref) {
        setSliderStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }
  }, [currentTargetHref, pathname, availableNavItems, token]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      const activeEl = itemRefs.current[currentTargetHref];
      if (activeEl) {
        setSliderStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentTargetHref]);

  // Scroll detection for header elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'apple-glass header-elevated border-b border-black/[0.06]'
          : 'bg-white/90 backdrop-blur-md border-b border-black/[0.05]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 group select-none"
        >
          <div
            className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-sm"
            style={{ backgroundColor: 'var(--color-navy)' }}
          >
            <img src="/sipenta.svg" alt="SIPENTA Logo" className="w-4.5 h-4.5 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg tracking-wide leading-none" style={{ color: 'var(--color-navy)' }}>
                SIPENTA
              </span>
              {token && isLiveSyncing && (
                <span 
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-default"
                  title="Sistem terhubung realtime ke server (SignalR Aktif)"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-sync" />
                  <span className="hidden lg:inline">Live</span>
                </span>
              )}
            </div>
            <span
              className="block text-[10px] tracking-widest uppercase font-sans mt-0.5 text-[var(--color-ink-faint)]"
              style={{ letterSpacing: '0.12em' }}
            >
              Laporan Tenaga Ahli
            </span>
          </div>
          {/* Gold rule accent */}
          <span
            className="hidden sm:block self-stretch w-px ml-1 transition-opacity duration-200 group-hover:opacity-100"
            style={{ backgroundColor: 'var(--color-gold)', opacity: 0.6 }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {!token ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-medium rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-xs font-medium rounded-full text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-black/[0.04] transition-all"
              >
                Daftar
              </Link>
              <Link
                href="/login"
                className="ml-1 px-5 py-2 text-xs font-medium rounded-full transition-all inline-flex items-center gap-2 shadow-xs hover:shadow-md hover:bg-[var(--color-navy-light)] active:scale-95"
                style={{ backgroundColor: 'var(--color-navy)', color: '#fff' }}
              >
                <i className="fas fa-comment-dots text-[10px] text-[var(--color-gold)]" />
                <span>Mulai Chat</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Segmented Sliding Navigation Track */}
              <nav
                ref={navRef}
                onMouseLeave={() => setHoveredHref(null)}
                className="relative flex items-center p-1 bg-black/[0.04] rounded-full border border-black/[0.06]"
              >
                {/* The Sliding Pill Indicator */}
                <div
                  className="absolute bg-[var(--color-navy)] rounded-full pointer-events-none shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    left: `${sliderStyle.left}px`,
                    top: `${sliderStyle.top}px`,
                    width: `${sliderStyle.width}px`,
                    height: `${sliderStyle.height}px`,
                    opacity: sliderStyle.opacity,
                  }}
                >
                  {/* Subtle Gold bottom highlight bar */}
                  <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[var(--color-gold)] rounded-full animate-fade-in" />
                </div>

                {/* Nav Links */}
                {availableNavItems.map(item => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredHref === item.href;
                  const isHighlighted = isHovered || (isActive && !hoveredHref);

                  return (
                    <Link
                      key={item.href}
                      ref={el => {
                        itemRefs.current[item.href] = el;
                      }}
                      href={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      className={`relative z-10 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none ${
                        isHighlighted
                          ? 'text-white'
                          : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                      }`}
                    >
                      <i
                        className={`fas ${item.icon} text-[11px] transition-all duration-200 ${
                          isHighlighted
                            ? 'text-[var(--color-gold)] scale-110'
                            : 'text-[var(--color-ink-faint)]'
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="w-px h-5 mx-0.5 bg-black/[0.1]" />

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer text-[var(--color-error)] hover:bg-red-50/80 active:scale-95"
                title="Keluar dari akun"
              >
                <i className="fas fa-sign-out-alt text-[10px]" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger (only when logged in) */}
        {token && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-full cursor-pointer transition-all text-[var(--color-ink-muted)] hover:bg-black/[0.05] active:scale-95"
            aria-label="Buka menu navigasi"
          >
            <i className="fas fa-bars text-base" />
          </button>
        )}
      </div>
    </header>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\MobileSidebar.tsx 
```tsx 
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/presentation/hooks/useAuth';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  if (!isOpen) return null;

  const NavItem = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all relative overflow-hidden active:scale-98 ${
          isActive
            ? 'bg-[var(--color-navy)] text-white shadow-xs'
            : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-2)]'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--color-gold)]" />
        )}
        <i className={`fas ${icon} w-5 text-center text-sm ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-ink-faint)]'}`} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer animate-backdrop"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-2xl animate-slide-left flex flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-5 flex justify-between items-center shrink-0 border-b border-[var(--color-border)] bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xs bg-[var(--color-navy)] flex items-center justify-center shadow-xs">
              <img src="/sipenta.svg" alt="SIPENTA" className="w-4 h-4 object-contain" />
            </div>
            <div>
              <span className="font-display text-lg tracking-wide block leading-none" style={{ color: 'var(--color-navy)' }}>
                SIPENTA
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[var(--color-ink-faint)]">
                Laporan Tenaga Ahli
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm bg-white border border-[var(--color-border)] hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)] active:scale-95"
            aria-label="Tutup menu"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          <NavItem href="/dashboard" icon="fa-file-alt" label="Laporan Kerja" />
          {isAdmin && (
            <NavItem href="/users" icon="fa-users" label="Daftar Pengguna" />
          )}

          <NavItem href="/chat" icon="fa-comments" label="Asisten Analisis AI" />
          <NavItem href="/profile" icon="fa-id-card" label="Profil Saya" />

          <div className="h-px w-full my-3 bg-[var(--color-border)] opacity-60" />

          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-left transition-all text-[var(--color-error)] hover:bg-red-50 active:scale-98 cursor-pointer"
          >
            <i className="fas fa-sign-out-alt w-5 text-center text-sm"></i>
            <span>Keluar dari Akun</span>
          </button>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-[var(--color-border)] bg-white text-center">
          <p className="text-[11px] text-[var(--color-ink-faint)] font-mono">
            SIPENTA AI Platform v2.0
          </p>
        </div>
      </div>
    </>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\Pagination.tsx 
```tsx 
'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        className="w-9 h-9 rounded-sm flex items-center justify-center border border-[var(--color-border)] bg-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)]"
        style={{ color: 'var(--color-ink)' }}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fas fa-chevron-left text-[10px]"></i>
      </button>
      <span className="text-sm font-medium" style={{ color: 'var(--color-ink-muted)' }}>
        Halaman <span style={{ color: 'var(--color-ink)' }}>{currentPage}</span> dari {totalPages}
      </span>
      <button
        className="w-9 h-9 rounded-sm flex items-center justify-center border border-[var(--color-border)] bg-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)]"
        style={{ color: 'var(--color-ink)' }}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fas fa-chevron-right text-[10px]"></i>
      </button>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\PendingApprovalNotice.tsx 
```tsx 
'use client';

import React from 'react';

interface PendingApprovalNoticeProps {
  onRefresh?: () => void;
}

export const PendingApprovalNotice: React.FC<PendingApprovalNoticeProps> = ({ onRefresh }) => {
  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
          <i className="fa-solid fa-clock-rotate-left text-xl animate-pulse"></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-amber-900">Menunggu Persetujuan Admin & Penentuan Bidang</h3>
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              Pending Approval
            </span>
          </div>
          <p className="mt-1 text-sm text-amber-800 leading-relaxed">
            Akun Anda baru saja terdaftar dan saat ini sedang menunggu verifikasi dari <strong>Administrator / Kasubag Diskominfo</strong> untuk disetujui serta ditentukan penempatan <strong>Bidang</strong> kerjanya.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-amber-700 bg-white/70 px-3 py-1.5 rounded-lg border border-amber-200/60 font-medium">
              <i className="fa-solid fa-circle-info mr-1.5 text-amber-600"></i>
              Fitur upload dokumen, penelusuran laporan, dan tanya jawab AI akan aktif otomatis setelah akun disetujui.
            </span>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition-colors"
              >
                <i className="fa-solid fa-arrows-rotate text-xs"></i>
                Cek Status Persetujuan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\Providers.tsx 
```tsx 
'use client';

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '980294223670-momnoomet1td36fm7s1s00ahjntg16n4.apps.googleusercontent.com';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\common\Toast.tsx 
```tsx 
'use client';

import React from 'react';

interface ToastProps {
  show: boolean;
  message: string;
  isError?: boolean;
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ show, message, isError = false, onDismiss }) => {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-sm p-4 animate-slide-up shadow-xl border backdrop-blur-xs flex flex-col overflow-hidden"
      style={{ 
        backgroundColor: isError ? 'var(--color-error)' : 'var(--color-navy)',
        borderColor: isError ? '#7f1d2d' : '#1e3a5f',
        color: '#fff'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <i className={`fas ${isError ? 'fa-exclamation-circle text-amber-200' : 'fa-check-circle text-[var(--color-gold)]'} text-base`}></i>
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-[13.5px] font-medium leading-snug">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/60 hover:text-white transition-colors text-xs p-1"
            title="Tutup pemberitahuan"
          >
            <i className="fas fa-times" />
          </button>
        )}
      </div>

      {/* Subtle duration bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/20 overflow-hidden">
        <div 
          className="h-full bg-[var(--color-gold)] animate-[shrink_3s_linear_forwards]"
          style={{
            backgroundColor: isError ? '#fecaca' : 'var(--color-gold)',
            animationDuration: '3000ms',
          }}
        />
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\documents\DocumentLoadingModal.tsx 
```tsx 
'use client';

import React from 'react';

interface DocumentLoadingModalProps {
  isOpen: boolean;
  docTitle?: string;
  onCancel?: () => void;
}

export const DocumentLoadingModal: React.FC<DocumentLoadingModalProps> = ({
  isOpen,
  docTitle,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] rounded-sm shadow-2xl relative animate-scale-up p-6 text-center z-10 flex flex-col items-center">
        {/* Animated Icon with Pulsing Radar Rings */}
        <div className="relative mb-5 mt-2">
          <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] flex items-center justify-center relative z-10 border border-[var(--color-border)] shadow-xs">
            <i className="fas fa-file-pdf text-2xl text-[var(--color-navy)] animate-pulse" />
          </div>
          <span className="absolute inset-0 rounded-full bg-[var(--color-gold)]/30 animate-ping opacity-75" />
          <span className="absolute -inset-2 rounded-full border border-[var(--color-gold)]/40 animate-pulse-sync" />
        </div>

        {/* Title */}
        <h3 className="font-display text-xl mb-1.5" style={{ color: 'var(--color-navy)' }}>
          File Sedang Diproses
        </h3>

        {/* Context / Document Name */}
        {docTitle && (
          <p className="text-[13px] font-medium text-[var(--color-ink)] line-clamp-2 mb-2 px-2 bg-[var(--color-surface-2)] py-1.5 rounded-xs border border-[var(--color-border)] w-full">
            {docTitle}
          </p>
        )}

        <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)] mb-5 max-w-xs">
          Mengambil dan memvalidasi berkas laporan dari server. Pratinjau akan terbuka otomatis sesaat lagi.
        </p>

        {/* Progress Indeterminate Bar */}
        <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden mb-5 border border-[var(--color-border)]/60">
          <div className="h-full bg-[var(--color-navy)] rounded-full animate-[shimmer_1.5s_infinite_linear] skeleton-shimmer w-full" />
        </div>

        {/* Action Button */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-error)] transition-colors py-1 px-3 rounded-xs cursor-pointer hover:bg-[var(--color-surface-2)]"
          >
            Batal Memuat
          </button>
        )}
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\documents\DocumentModal.tsx 
```tsx 
'use client';

import { Document, SaveDocumentDto } from '@/core/domain/document';
import { BIDANG_LIST } from '@/core/constants/bidang';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import React, { useEffect, useRef, useState } from 'react';

interface DocumentModalProps {
  isOpen: boolean;
  editingDocument: Document | null;
  onClose: () => void;
  onSubmit: (dto: SaveDocumentDto) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
  userBidang?: string | null;
  isAdmin?: boolean;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  editingDocument,
  onClose,
  onSubmit,
  showToast,
  userBidang,
  isAdmin = false,
}) => {
  const { bidangs } = useBidangs(isOpen);
  const [nama, setNama] = useState('');
  const [namaTenagaAhli, setNamaTenagaAhli] = useState('');
  const [jenisDokumen, setJenisDokumen] = useState('');
  const [periodeLaporan, setPeriodeLaporan] = useState<string>('');
  const [bidang, setBidang] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const formatMonthYearToIndonesian = (value: string): string => {
    if (/^\d{4}-\d{2}$/.test(value)) {
      const [year, monthStr] = value.split('-');
      const monthIndex = parseInt(monthStr, 10) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${MONTH_NAMES_ID[monthIndex]} ${year}`;
      }
    }
    return value;
  };

  const parseToMonthInput = (val: string): string => {
    if (!val) return '';
    if (/^\d{4}-\d{2}$/.test(val)) return val;
    const match = val.match(/([A-Za-z]+)\s+(\d{4})/);
    if (match) {
      const monthName = match[1].toLowerCase();
      const year = match[2];
      const monthIndex = MONTH_NAMES_ID.findIndex(m => m.toLowerCase() === monthName);
      if (monthIndex >= 0) {
        const mm = String(monthIndex + 1).padStart(2, '0');
        return `${year}-${mm}`;
      }
    }
    return '';
  };

  useEffect(() => {
    if (editingDocument) {
      setNama(editingDocument.nama || editingDocument.namaFile || '');
      setNamaTenagaAhli(editingDocument.namaTenagaAhli || '');
      setJenisDokumen(editingDocument.jenisDokumen || '');
      setPeriodeLaporan(editingDocument.periodeLaporan || '');
      setBidang(editingDocument.bidang || '');
      setFiles([]);
    } else {
      setNama('');
      setNamaTenagaAhli('');
      setJenisDokumen('');
      setPeriodeLaporan('');
      setBidang(userBidang || '');
      setFiles([]);
    }
  }, [editingDocument, isOpen, userBidang]);

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

  const isEdit = !!editingDocument;

  const appendFiles = (incomingFiles: File[]) => {
    setFiles(prev => {
      const existingKeys = new Set(prev.map(f => `${f.name}-${f.size}-${f.lastModified}`));
      const newUnique = incomingFiles.filter(f => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`));
      return [...prev, ...newUnique];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      appendFiles(Array.from(e.target.files));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      appendFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'fas fa-file-pdf text-rose-500';
    if (ext === 'doc' || ext === 'docx') return 'fas fa-file-word text-blue-600';
    return 'fas fa-file-alt text-slate-400';
  };

  const totalSizeBytes = files.reduce((acc, f) => acc + f.size, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isEdit && files.length === 0) {
      showToast('Harap pilih file dokumen terlebih dahulu', true);
      return;
    }

    setLoading(true);

    const dto: SaveDocumentDto = isEdit
      ? {
          id: editingDocument?.id,
          nama,
          namaTenagaAhli,
          jenisDokumen,
          periodeLaporan,
          bidang: bidang || null,
        }
      : {
          files,
          bidang: bidang || userBidang || null,
        };

    try {
      const res = await onSubmit(dto);
      if (res.ok) {
        const msg = isEdit
          ? 'Dokumen berhasil diperbarui'
          : files.length > 1
          ? `${files.length} dokumen berhasil diupload`
          : 'Dokumen berhasil diupload';
        showToast(msg);
        onClose();
      } else {
        showToast(res.message || 'Gagal menyimpan dokumen', true);
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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
        onClick={() => !loading && onClose()}
      />
      
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-2xl relative animate-scaleUp max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? 'Ubah Metadata Dokumen' : 'Unggah Dokumen Laporan'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Perbarui informasi laporan' : 'Upload berkas PDF/DOCX untuk dianalisis oleh AI'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit}>
            {!isEdit ? (
              <div className="space-y-4">
                {/* Bidang info/selection on Upload */}
                <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
                  <i className="fas fa-info-circle text-indigo-600 mt-0.5"></i>
                  <div className="text-xs text-indigo-900 flex-1">
                    {isAdmin ? (
                      <div className="space-y-1.5">
                        <span className="font-semibold block">Tentukan Bidang untuk Dokumen yang Diunggah:</span>
                        <select
                          value={bidang}
                          onChange={(e) => setBidang(e.target.value)}
                          className="w-full rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="">-- Gunakan Bidang Pengunggah --</option>
                          {BIDANG_LIST.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                          <option value="Sekretariat">Sekretariat</option>
                        </select>
                      </div>
                    ) : (
                      <span>
                        Dokumen yang diunggah akan otomatis terhubung ke <strong>{userBidang || 'Bidang Anda'}</strong> sehingga dapat dibaca oleh rekan di bidang yang sama.
                      </span>
                    )}
                  </div>
                </div>
                
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                    <i className="fas fa-cloud-upload-alt text-2xl"></i>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    Seret & lepas dokumen di sini, atau klik untuk memilih file
                  </p>
                  <span className="text-xs text-slate-400">Format yang didukung: PDF, DOC, DOCX</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    required={!isEdit && files.length === 0}
                    onChange={handleFileChange}
                  />
                </div>
                
                {files.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-600">
                        <span>{files.length} dokumen</span> siap diproses ({(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                      </p>
                      <button
                        type="button"
                        onClick={handleClearAllFiles}
                        className="text-xs font-semibold text-rose-600 hover:underline transition-colors"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                      {files.map((file, idx) => (
                        <div
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 group hover:border-indigo-400 transition-colors"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <i className={`${getFileIcon(file.name)} text-lg shrink-0`}></i>
                            <span className="truncate text-xs font-medium text-slate-800">{file.name}</span>
                            <span className="text-[11px] text-slate-400 shrink-0">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFile(idx)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-rose-500 hover:bg-rose-50"
                            title="Hapus file"
                          >
                            <i className="fas fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Judul Dokumen
                  </label>
                  <input
                    type="text"
                    value={nama}
                    onChange={e => setNama(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Nama Tenaga Ahli
                    </label>
                    <input
                      type="text"
                      value={namaTenagaAhli}
                      onChange={e => setNamaTenagaAhli(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Bidang Diskominfo
                    </label>
                    <select
                      value={bidang}
                      onChange={e => setBidang(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                    >
                      <option value="">-- Belum Ditentukan --</option>
                      {bidangs.length > 0 ? (
                        bidangs.map((b) => (
                          <option key={b.id} value={b.nama}>
                            {b.nama}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Bidang APTIKA">Bidang APTIKA</option>
                          <option value="Bidang TIK">Bidang TIK</option>
                          <option value="Bidang IKP">Bidang IKP</option>
                          <option value="Bidang Statistik">Bidang Statistik</option>
                          <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                          <option value="Sekretariat">Sekretariat</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Jenis Dokumen
                    </label>
                    <input
                      type="text"
                      list="jenisDokumenList"
                      value={jenisDokumen}
                      placeholder="Pilih atau ketik (contoh: Laporan Bulanan)"
                      onChange={e => setJenisDokumen(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                    />
                    <datalist id="jenisDokumenList">
                      <option value="Laporan Bulanan" />
                      <option value="Laporan Akhir" />
                      <option value="Laporan Antara" />
                      <option value="Laporan Harian" />
                      <option value="Laporan Mingguan" />
                      <option value="Kerangka Acuan Kerja (KAK)" />
                      <option value="Berita Acara (BAST)" />
                      <option value="Dokumen Teknis" />
                      <option value="Laporan Kerja" />
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Periode Laporan
                    </label>
                    <input
                      type="month"
                      value={parseToMonthInput(periodeLaporan)}
                      onChange={e => {
                        const val = e.target.value;
                        setPeriodeLaporan(val ? formatMonthYearToIndonesian(val) : '');
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors cursor-pointer"
                    />
                    {periodeLaporan && (
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Terpilih: <strong>{periodeLaporan}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || (!isEdit && files.length === 0)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center min-w-[130px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-circle-notch fa-spin"></i>
                    <span>Memproses...</span>
                  </span>
                ) : isEdit ? (
                  'Simpan Perubahan'
                ) : files.length > 1 ? (
                  `Unggah ${files.length} Dokumen`
                ) : (
                  'Unggah Dokumen'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\documents\DocumentTable.tsx 
```tsx 
'use client';

import React from 'react';
import { Document } from '@/core/domain/document';
import { formatDate, formatBytes } from '@/presentation/utils/formatters';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface DocumentTableProps {
  documents: Document[];
  isLoading?: boolean;
  onShow: (id: string) => void;
  onEdit: (doc: Document) => void;
  onDelete: (id: string) => void;
  onShare?: (doc: Document) => void;
  onResetFilters?: () => void;
  onOpenUpload?: () => void;
  userRole?: string;
}

export const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  isLoading = false,
  onShow,
  onEdit,
  onDelete,
  onShare,
  onResetFilters,
  onOpenUpload,
  userRole,
}) => {
  const isAdmin = ['admin', 'kasubag'].includes(userRole?.toLowerCase() || '');

  if (isLoading) {
    return (
      <div className="mb-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="h-4 w-32 skeleton-shimmer rounded-md" />
          <div className="h-4 w-20 skeleton-shimmer rounded-md" />
        </div>
        <div className="divide-y divide-slate-100 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 skeleton-shimmer rounded-xl shrink-0" />
                <div className="space-y-2 flex-1 max-w-md">
                  <div className="h-4 skeleton-shimmer rounded w-3/4" />
                  <div className="h-3 skeleton-shimmer rounded w-1/2" />
                </div>
              </div>
              <div className="h-4 skeleton-shimmer rounded w-28 hidden md:block" />
              <div className="h-4 skeleton-shimmer rounded w-20 hidden md:block" />
              <div className="h-8 skeleton-shimmer rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Mobile Card View (hidden on md and larger) */}
      <div className="block md:hidden space-y-4">
        {documents.length === 0 ? (
          <div className="border border-slate-200 bg-white p-8 text-center rounded-2xl text-sm shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <i className="fas fa-folder-open text-base" />
            </div>
            <p className="font-semibold text-slate-800">Tidak ada dokumen ditemukan</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Coba sesuaikan kata kunci pencarian, filter bidang, atau unggah dokumen laporan baru.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              {onResetFilters && (
                <button
                  onClick={onResetFilters}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Reset Filter
                </button>
              )}
              {onOpenUpload && (
                <button
                  onClick={onOpenUpload}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
                >
                  Unggah Dokumen
                </button>
              )}
            </div>
          </div>
        ) : (
          documents.map((doc, idx) => {
            let icon = 'fa-file-alt text-slate-400';
            if (doc.mimeType?.includes('pdf')) icon = 'fa-file-pdf text-rose-500';
            else if (doc.mimeType?.includes('word')) icon = 'fa-file-word text-blue-600';

            const bidangStyle = doc.bidang && BIDANG_COLORS[doc.bidang]
              ? BIDANG_COLORS[doc.bidang]
              : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

            const canManage = isAdmin || doc.isOwner !== false;

            return (
              <div
                key={doc.id}
                className="border border-slate-200 bg-white p-4.5 rounded-2xl flex flex-col gap-3 shadow-xs hover:border-indigo-400 transition-colors animate-fade-up"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Header & Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {doc.bidang && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                      {doc.bidang}
                    </span>
                  )}
                  {doc.isSharedWithMe && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                      <i className="fa-solid fa-users text-[9px]"></i> Dibagikan ke Anda
                    </span>
                  )}
                  {doc.sharedWith && doc.sharedWith.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <i className="fa-solid fa-share-nodes text-[9px]"></i> {doc.sharedWith.length} Pengguna Luar
                    </span>
                  )}
                </div>

                {/* Line 1: Title */}
                <div
                  onClick={() => onShow(doc.id)}
                  className="flex items-start gap-3 cursor-pointer group select-none"
                  title="Klik untuk membuka dokumen"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-50 transition-colors shadow-2xs">
                    <i className={`fas ${icon} text-lg`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm leading-snug break-words text-slate-800 group-hover:text-indigo-600 group-hover:underline transition-colors">
                      {doc.nama || doc.namaFile}
                    </h4>
                    <div className="text-[11px] mt-1 text-slate-400 flex items-center gap-1.5">
                      <span>{formatDate(doc.tanggalUpload)}</span>
                      <span>&bull;</span>
                      <span>{formatBytes(doc.ukuran)}</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Tenaga Ahli</span>
                    <span className="font-medium text-slate-700 line-clamp-1">{doc.namaTenagaAhli || '-'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Jenis</span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 line-clamp-1">
                      {doc.jenisDokumen || 'Laporan Kerja'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider mb-0.5 text-slate-400">Periode</span>
                    <span className="font-medium text-slate-700">{doc.periodeLaporan || '-'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                  {canManage && onShare && (
                    <button
                      title="Bagikan Dokumen ke Pengguna Lain"
                      className="h-8 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                      onClick={() => onShare(doc)}
                    >
                      <i className="fa-solid fa-user-plus text-xs"></i>
                      <span>Bagikan</span>
                    </button>
                  )}
                  {canManage && (
                    <button
                      title="Ubah data metadata"
                      className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium transition-colors text-slate-700 active:scale-95 cursor-pointer"
                      onClick={() => onEdit(doc)}
                    >
                      <i className="fas fa-edit text-xs"></i> Ubah
                    </button>
                  )}
                  {canManage && (
                    <button
                      title="Hapus dokumen dari sistem"
                      className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5 text-xs font-medium transition-colors text-rose-600 active:scale-95 cursor-pointer"
                      onClick={() => onDelete(doc.id)}
                    >
                      <i className="fas fa-trash-alt text-xs"></i> Hapus
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block apple-card overflow-hidden bg-white border border-slate-200/80 rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              <th className="py-3.5 px-5 font-bold">Judul & Berkas</th>
              <th className="py-3.5 px-4 font-bold">Bidang Diskominfo</th>
              <th className="py-3.5 px-4 font-bold">Nama Tenaga Ahli</th>
              <th className="py-3.5 px-4 font-bold">Jenis Dokumen</th>
              <th className="py-3.5 px-4 font-bold">Periode Laporan</th>
              <th className="py-3.5 px-5 text-right font-bold">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <i className="fas fa-folder-open text-lg" />
                  </div>
                  <p className="font-semibold text-slate-800 mb-1">Tidak ada dokumen ditemukan</p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    Tidak ada dokumen yang cocok dengan filter aktif atau belum ada dokumen yang diunggah.
                  </p>
                  <div className="flex justify-center gap-3">
                    {onResetFilters && (
                      <button
                        onClick={onResetFilters}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer"
                      >
                        <i className="fas fa-redo-alt mr-1.5 text-xs text-slate-400" />
                        Reset Filter
                      </button>
                    )}
                    {onOpenUpload && (
                      <button
                        onClick={onOpenUpload}
                        className="px-4 py-2 rounded-xl bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <i className="fas fa-plus text-xs" />
                        Unggah Dokumen Baru
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              documents.map((doc, idx) => {
                let icon = 'fa-file-alt text-slate-400';
                if (doc.mimeType?.includes('pdf')) icon = 'fa-file-pdf text-rose-500';
                else if (doc.mimeType?.includes('word')) icon = 'fa-file-word text-blue-600';

                const bidangStyle = doc.bidang && BIDANG_COLORS[doc.bidang]
                  ? BIDANG_COLORS[doc.bidang]
                  : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

                const canManage = isAdmin || doc.isOwner !== false;

                return (
                  <tr
                    key={doc.id}
                    className="bg-white hover:bg-slate-50/70 transition-all duration-150 group animate-fade-up"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="p-4 align-middle">
                      <div
                        onClick={() => onShow(doc.id)}
                        className="flex items-center gap-3.5 cursor-pointer select-none group/item"
                        title="Klik untuk membuka dokumen asli"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/item:scale-105 group-hover/item:bg-indigo-50 shadow-2xs">
                          <i className={`fas ${icon} text-lg`}></i>
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="font-semibold text-sm leading-snug mb-1 text-slate-900 group-hover/item:text-indigo-600 group-hover/item:underline transition-colors line-clamp-2">
                            {doc.nama || doc.namaFile}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                            <span>{formatDate(doc.tanggalUpload)}</span>
                            <span>&bull;</span>
                            <span>{formatBytes(doc.ukuran)}</span>
                            {doc.isSharedWithMe && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200">
                                <i className="fa-solid fa-users text-[8px]"></i> Dibagikan ke Anda
                              </span>
                            )}
                            {doc.sharedWith && doc.sharedWith.length > 0 && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                                <i className="fa-solid fa-share-nodes text-[8px]"></i> {doc.sharedWith.length} dibagikan
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      {doc.bidang ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {doc.bidang}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">-</span>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="font-medium text-xs text-slate-800">{doc.namaTenagaAhli || '-'}</div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                        {doc.jenisDokumen || 'Laporan Kerja'}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-xs text-slate-700">
                      {doc.periodeLaporan ? <div className="font-medium">{doc.periodeLaporan}</div> : '-'}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage && onShare && (
                          <button
                            title="Bagikan Dokumen"
                            className="h-8 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                            onClick={() => onShare(doc)}
                          >
                            <i className="fa-solid fa-user-plus text-xs"></i>
                            <span className="hidden xl:inline">Bagikan</span>
                          </button>
                        )}
                        {canManage && (
                          <button
                            title="Ubah Metadata"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-all text-slate-600 hover:text-slate-900 active:scale-95 shadow-2xs cursor-pointer"
                            onClick={() => onEdit(doc)}
                          >
                            <i className="fas fa-edit text-xs"></i>
                          </button>
                        )}
                        {canManage && (
                          <button
                            title="Hapus Dokumen"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center transition-all text-rose-600 active:scale-95 shadow-2xs cursor-pointer"
                            onClick={() => onDelete(doc.id)}
                          >
                            <i className="fas fa-trash-alt text-xs"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\documents\ReadChunkModal.tsx 
```tsx 
'use client';

import React, { useState, useEffect } from 'react';
import { DocumentChunk } from '@/core/domain/document';

interface ReadChunkModalProps {
  isOpen: boolean;
  chunkList: DocumentChunk[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSave: (content: string) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const ReadChunkModal: React.FC<ReadChunkModalProps> = ({
  isOpen,
  chunkList,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onSave,
  showToast,
}) => {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (chunkList.length > 0 && chunkList[currentIndex]) {
      const c = chunkList[currentIndex];
      setContent(c.content || c.Content || c.preview || c.Preview || c.teks || c.Teks || '');
    } else {
      setContent('');
    }
  }, [chunkList, currentIndex, isOpen]);

  // Keyboard navigation: Esc to close, Alt+Left / Alt+Right or Left/Right (when not editing) for chunk navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || saving) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.altKey && e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        onPrev();
      } else if (e.altKey && e.key === 'ArrowRight' && currentIndex < chunkList.length - 1) {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, saving, currentIndex, chunkList.length, onClose, onPrev, onNext]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Gagal menyalin teks', true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await onSave(content);
      if (res.ok) {
        showToast('Segmen berhasil diperbarui.');
      } else {
        showToast(res.message || 'Gagal memperbarui segmen.', true);
      }
    } catch {
      showToast('Kesalahan jaringan', true);
    } finally {
      setSaving(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={() => !saving && onClose()}
      />
      
      <div className="w-full max-w-3xl bg-white border border-[var(--color-border)] rounded-sm shadow-xl relative animate-scale-up flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xs bg-[var(--color-navy)] flex items-center justify-center">
              <i className="fas fa-layer-group text-[var(--color-gold)] text-xs"></i>
            </div>
            <div>
              <h3 className="text-lg font-display" style={{ color: 'var(--color-navy)' }}>
                Tinjauan Segmen Dokumen (Chunk)
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--color-ink-muted)' }}>
                Navigasi cepat dengan <span className="font-mono bg-[var(--color-surface-2)] px-1 rounded">Alt+←</span> / <span className="font-mono bg-[var(--color-surface-2)] px-1 rounded">Alt+→</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-sm hover:bg-[var(--color-surface-2)] flex items-center justify-center transition-colors text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 bg-white overflow-y-auto flex-1 flex flex-col">
          {/* Metadata bar */}
          <div className="flex items-center justify-between mb-3 text-[12px] text-[var(--color-ink-muted)]">
            <div className="flex items-center gap-3">
              <span>Panjang: <strong className="text-[var(--color-ink)] font-mono">{charCount}</strong> karakter</span>
              <span>•</span>
              <span><strong className="text-[var(--color-ink)] font-mono">{wordCount}</strong> kata</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-2)] text-[var(--color-ink)] text-[12px] transition-all cursor-pointer active:scale-95"
            >
              <i className={`fas ${copied ? 'fa-check text-emerald-600' : 'fa-copy text-[var(--color-gold)]'} text-xs`} />
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>
          </div>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Konten segmen kosong..."
            className="w-full flex-1 border border-[var(--color-border)] p-4 sm:p-5 text-[13.5px] leading-relaxed font-mono min-h-[280px] sm:min-h-[360px] resize-y bg-[var(--color-surface)] focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] rounded-sm transition-colors shadow-inner text-[var(--color-ink)]"
          />
          
          <div className="flex flex-wrap justify-between items-center gap-4 mt-5 pt-4 border-t border-[var(--color-border)]">
            {/* Prev / Counter / Next Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={currentIndex === 0}
                className="w-9 h-9 border border-[var(--color-border)] bg-white rounded-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)] active:scale-95 text-[var(--color-ink)]"
                title="Segmen Sebelumnya (Alt+←)"
              >
                <i className="fas fa-chevron-left text-xs"></i>
              </button>

              <div className="px-4 h-9 border border-[var(--color-border)] bg-[var(--color-surface)] rounded-sm flex items-center justify-center min-w-[84px] shadow-2xs">
                <span className="text-[12px] font-medium tracking-wide">
                  {chunkList.length > 0 ? (
                    <>
                      <span className="font-semibold" style={{ color: 'var(--color-navy)' }}>{currentIndex + 1}</span>
                      <span className="mx-1 text-[var(--color-ink-faint)]">/</span>
                      <span className="text-[var(--color-ink-muted)]">{chunkList.length}</span>
                    </>
                  ) : (
                    '0 / 0'
                  )}
                </span>
              </div>

              <button
                onClick={onNext}
                disabled={currentIndex >= chunkList.length - 1}
                className="w-9 h-9 border border-[var(--color-border)] bg-white rounded-sm flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--color-surface-2)] active:scale-95 text-[var(--color-ink)]"
                title="Segmen Berikutnya (Alt+→)"
              >
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 h-9 rounded-sm border border-[var(--color-border)] bg-white text-xs font-medium hover:bg-[var(--color-surface-2)] text-[var(--color-ink)] transition-colors"
              >
                Tutup
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 h-9 rounded-sm text-xs font-medium text-white transition-all disabled:opacity-50 flex items-center gap-2 min-w-[130px] justify-center active:scale-95 shadow-xs"
                style={{ backgroundColor: 'var(--color-navy)' }}
                onMouseEnter={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy-light)';
                }}
                onMouseLeave={e => {
                  if (!saving) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-navy)';
                }}
              >
                {saving ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin text-[10px]"></i>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save text-[11px] text-[var(--color-gold)]"></i>
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\documents\ShareDocumentModal.tsx 
```tsx 
'use client';

import React, { useState, useEffect } from 'react';
import { Document, DocumentAccessUser } from '@/core/domain/document';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface ShareDocumentModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onShare: (documentId: string, username: string) => Promise<{ ok: boolean; message?: string }>;
  onRevoke: (documentId: string, targetUserId: string) => Promise<{ ok: boolean; message?: string }>;
  fetchShares: (documentId: string) => Promise<DocumentAccessUser[]>;
}

export const ShareDocumentModal: React.FC<ShareDocumentModalProps> = ({
  isOpen,
  document,
  onClose,
  onShare,
  onRevoke,
  fetchShares,
}) => {
  const [username, setUsername] = useState('');
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
      setFeedback(null);
      loadShares();
    }
  }, [isOpen, document?.id]);

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
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ketik username (contoh: budi_aptika)"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
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
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\users\ApproveUserModal.tsx 
```tsx 
'use client';

import React, { useState, useEffect } from 'react';
import { UserAccount } from '@/core/domain/user';
import { useBidangs } from '@/presentation/hooks/useBidangs';
import { BIDANG_LIST } from '@/core/constants/bidang';

interface ApproveUserModalProps {
  isOpen: boolean;
  user: UserAccount | null;
  onClose: () => void;
  onApprove: (id: string, bidang: string) => Promise<{ ok: boolean; message?: string }>;
  showToast: (msg: string, isError?: boolean) => void;
}

export const ApproveUserModal: React.FC<ApproveUserModalProps> = ({
  isOpen,
  user,
  onClose,
  onApprove,
  showToast,
}) => {
  const { bidangs } = useBidangs(isOpen);
  const [selectedBidang, setSelectedBidang] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (bidangs.length > 0) {
        setSelectedBidang(bidangs[0].nama);
      } else {
        setSelectedBidang(BIDANG_LIST[0]);
      }
    }
  }, [isOpen, bidangs]);

  if (!isOpen || !user) return null;

  const bidangOptions = bidangs.length > 0 ? bidangs.map(b => b.nama) : BIDANG_LIST;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBidang) {
      showToast('Pilih bidang terlebih dahulu', true);
      return;
    }

    setLoading(true);
    try {
      const res = await onApprove(user.id, selectedBidang);
      if (res.ok) {
        showToast(`Pengguna @${user.username} berhasil disetujui untuk ${selectedBidang}!`);
        onClose();
      } else {
        showToast(res.message || 'Gagal menyetujui pengguna', true);
      }
    } catch {
      showToast('Terjadi kesalahan jaringan', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <i className="fa-solid fa-user-check text-lg"></i>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Setujui Pengguna</h3>
              <p className="text-xs text-slate-500">Tentukan penempatan bidang kerja</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs space-y-1">
            <p className="font-bold text-slate-800">{user.fullName || user.username}</p>
            <p className="text-slate-500">@{user.username} &bull; {user.email}</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Pilih Bidang Diskominfo <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBidang}
              onChange={(e) => setSelectedBidang(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 transition focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            >
              {bidangOptions.map((bidang) => (
                <option key={bidang} value={bidang}>
                  {bidang}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[11px] text-slate-500">
              Setelah disetujui, pengguna dapat mengunggah laporan dan mengakses seluruh dokumen laporan yang berada di bidang ini.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <i className="fa-solid fa-circle-notch fa-spin text-sm"></i>
              ) : (
                <>
                  <i className="fa-solid fa-check text-xs"></i>
                  <span>Setujui & Beri Akses</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\users\UserModal.tsx 
```tsx 
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

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  editingUser,
  onClose,
  onCreate,
  onUpdate,
  showToast,
}) => {
  const { bidangs } = useBidangs(isOpen);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState<number>(3); // default user
  const [bidang, setBidang] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName || '');
      setUsername(editingUser.username || '');
      setEmail(editingUser.email || '');
      setPassword('');
      setRoleId(['admin', 'kasubag'].includes(editingUser.role?.toLowerCase() || '') ? 2 : 3);
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
  }, [editingUser, isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const dto: UpdateUserDto = {
          id: editingUser.id,
          fullName,
          username,
          email,
          roleId,
          bidang: bidang || undefined,
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
          bidang: bidang || undefined,
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
                value={bidang}
                onChange={e => setBidang(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
              >
                <option value="">-- Belum Ditentukan --</option>
                {bidangs.length > 0 ? (
                  bidangs.map((b) => (
                    <option key={b.id} value={b.nama}>
                      {b.nama}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Bidang APTIKA">Bidang APTIKA</option>
                    <option value="Bidang TIK">Bidang TIK</option>
                    <option value="Bidang IKP">Bidang IKP</option>
                    <option value="Bidang Statistik">Bidang Statistik</option>
                    <option value="Bidang Persandian dan Keamanan Informasi">Bidang Persandian dan Keamanan Informasi</option>
                    <option value="Sekretariat">Sekretariat</option>
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
                  value={roleId}
                  onChange={e => setRoleId(parseInt(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-colors"
                >
                  <option value={2}>Kasubag / Admin</option>
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
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\components\users\UserTable.tsx 
```tsx 
'use client';

import React, { useState } from 'react';
import { UserAccount } from '@/core/domain/user';
import { formatDate } from '@/presentation/utils/formatters';
import { BIDANG_COLORS } from '@/core/constants/bidang';

interface UserTableProps {
  users: UserAccount[];
  isLoading?: boolean;
  onEdit: (user: UserAccount) => void;
  onDelete: (id: string) => void;
  onApproveClick?: (user: UserAccount) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  onEdit,
  onDelete,
  onApproveClick,
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 1800);
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 gap-4 border-b border-[var(--color-border)] last:border-b-0">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-full skeleton-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1 max-w-xs">
                <div className="h-4 skeleton-shimmer rounded-xs w-3/4" />
                <div className="h-3 skeleton-shimmer rounded-xs w-1/2" />
              </div>
            </div>
            <div className="h-4 skeleton-shimmer rounded-xs w-28 hidden md:block" />
            <div className="h-5 skeleton-shimmer rounded-full w-16 hidden md:block" />
            <div className="h-8 skeleton-shimmer rounded-xs w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-0">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3 p-4">
        {users.length === 0 ? (
          <div className="border border-[var(--color-border)] bg-white p-8 text-center text-sm shadow-2xs rounded-sm" style={{ color: 'var(--color-ink-muted)' }}>
            Belum ada data pengguna terdaftar.
          </div>
        ) : (
          users.map((user, idx) => {
            const isAdmin = ['admin', 'kasubag'].includes(user.role?.toLowerCase() || '');
            const isApproved = isAdmin || user.isApproved;
            const bidangStyle = user.bidang && BIDANG_COLORS[user.bidang]
              ? BIDANG_COLORS[user.bidang]
              : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

            return (
              <div
                key={user.id}
                className={`border bg-white p-4 shadow-2xs rounded-xl flex flex-col gap-3 transition-colors ${
                  !isApproved ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-indigo-400'
                } animate-fade-up`}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 font-bold text-sm">
                      {(user.fullName || user.username).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight">
                        {user.fullName || user.username}
                      </h4>
                      <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${isAdmin ? 'text-amber-700 bg-amber-100' : 'text-indigo-700 bg-indigo-50'}`}>
                      {user.role === 'admin' ? 'Kasubag' : (user.role === 'user' ? 'Tenaga Ahli' : user.role)}
                    </span>
                    {!isApproved ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        Menunggu
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <i className="fa-solid fa-check text-[9px] mr-1"></i> Disetujui
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <i className="fas fa-envelope text-[11px] w-4 text-center text-slate-400"></i>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-layer-group text-[11px] w-4 text-center text-slate-400"></i>
                    <span>
                      Bidang:{' '}
                      {user.bidang ? (
                        <span className={`inline-block font-semibold px-1.5 py-0.2 rounded text-[11px] ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {user.bidang}
                        </span>
                      ) : (
                        <span className="text-amber-600 italic">Belum ditentukan</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <i className="fas fa-calendar-alt text-[11px] w-4 text-center text-slate-400"></i>
                    <span>Terdaftar: {user.createdAt ? formatDate(user.createdAt) : '-'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {!isApproved && onApproveClick && (
                    <button
                      onClick={() => onApproveClick(user)}
                      className="h-8 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 text-xs font-semibold transition-colors shadow-sm cursor-pointer"
                    >
                      <i className="fas fa-check-circle"></i> Setujui
                    </button>
                  )}
                  <button
                    title="Ubah Data Pengguna"
                    className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 text-xs font-medium transition-colors text-slate-700"
                    onClick={() => onEdit(user)}
                  >
                    <i className="fas fa-edit"></i> Ubah
                  </button>
                  <button
                    title="Hapus Pengguna"
                    className="h-8 px-3 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 flex items-center gap-1.5 text-xs font-medium transition-colors text-rose-600"
                    onClick={() => onDelete(user.id)}
                  >
                    <i className="fas fa-trash-alt"></i> Hapus
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block apple-card overflow-hidden bg-white border border-black/[0.07] rounded-2xl shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface)]/80 border-b border-black/[0.06]">
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[22%] text-[var(--color-ink-muted)]">Pengguna</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[18%] text-[var(--color-ink-muted)]">Bidang Diskominfo</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[20%] text-[var(--color-ink-muted)]">Kontak Email</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[12%] text-[var(--color-ink-muted)]">Hak Akses</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider w-[14%] text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-right w-[14%] text-[var(--color-ink-muted)]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-black/[0.04]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <i className="fas fa-users text-sm" />
                  </div>
                  Belum ada data pengguna terdaftar.
                </td>
              </tr>
            ) : (
              users.map((user, idx) => {
                const isAdmin = ['admin', 'kasubag'].includes(user.role?.toLowerCase() || '');
                const isApproved = isAdmin || user.isApproved;
                const isCopied = copiedEmail === user.email;
                const bidangStyle = user.bidang && BIDANG_COLORS[user.bidang]
                  ? BIDANG_COLORS[user.bidang]
                  : { bg: 'bg-slate-100 text-slate-700', border: 'border-slate-200' };

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-slate-50/80 transition-all duration-150 group animate-fade-up ${
                      !isApproved ? 'bg-amber-50/20' : ''
                    }`}
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-100 text-slate-700 font-bold text-xs">
                          {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-[13px] text-slate-900 block truncate">
                            {user.fullName || user.username}
                          </span>
                          <span className="text-[11px] text-slate-400">@{user.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.bidang ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${bidangStyle.bg} border ${bidangStyle.border}`}>
                          {user.bidang}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
                          Belum ditentukan
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[12.5px] text-slate-700">
                      <button
                        onClick={() => handleCopyEmail(user.email)}
                        className="inline-flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer group/btn"
                        title="Klik untuk menyalin email"
                      >
                        <span className="truncate max-w-[160px]">{user.email}</span>
                        <i className={`fas ${isCopied ? 'fa-check text-emerald-600' : 'fa-copy opacity-0 group-hover/btn:opacity-100 text-slate-400'} text-[10px] transition-opacity`} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${isAdmin ? 'text-amber-800 bg-amber-100' : 'text-indigo-700 bg-indigo-50'}`}>
                        {user.role === 'admin' ? 'Kasubag' : (user.role === 'user' ? 'Tenaga Ahli' : user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {!isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </span>
                          Menunggu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200">
                          <i className="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
                          Disetujui
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isApproved && onApproveClick && (
                          <button
                            title="Setujui dan Tentukan Bidang"
                            className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 text-xs font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
                            onClick={() => onApproveClick(user)}
                          >
                            <i className="fas fa-check text-[10px]"></i>
                            <span>Setujui</span>
                          </button>
                        )}
                        <button
                          title="Ubah Data Pengguna"
                          className="w-7 h-7 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all text-slate-700 active:scale-95 cursor-pointer"
                          onClick={() => onEdit(user)}
                        >
                          <i className="fas fa-edit text-[11px]"></i>
                        </button>
                        <button
                          title="Hapus Pengguna"
                          className="w-7 h-7 rounded-lg hover:bg-rose-50 border border-slate-200 hover:border-rose-200 flex items-center justify-center transition-all text-rose-600 active:scale-95 cursor-pointer"
                          onClick={() => onDelete(user.id)}
                        >
                          <i className="fas fa-trash-alt text-[11px]"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useAuth.ts 
```tsx 
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authRepository } from '@/infrastructure/repositories/AuthRepository';
import { AuthUseCases } from '@/core/usecases/authUseCases';
import { LoginRequest, RegisterRequest } from '@/core/domain/auth';

const authUseCases = new AuthUseCases(authRepository);

export function useAuth(requireAuth = false, requireAdmin = false) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [bidangId, setBidangId] = useState<number | null>(null);
  const [bidang, setBidang] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkAuth = useCallback(() => {
    const auth = authUseCases.getAuthState();
    setToken(auth.token);
    setRole(auth.role);
    setUser(auth.user);
    setBidangId(auth.bidangId);
    setBidang(auth.bidang);
    setIsApproved(auth.isApproved);
    setIsAdmin(auth.isAdmin);

    if (requireAuth && !auth.token) {
      router.push('/login?reason=expired');
      return false;
    }

    if (requireAdmin && (!auth.token || !auth.isAdmin)) {
      router.push(auth.token ? '/chat' : '/login?reason=expired');
      return false;
    }

    return true;
  }, [requireAuth, requireAdmin, router]);

  useEffect(() => {
    checkAuth();
    setIsLoading(false);

    // Periodic check every 10 seconds for token expiration
    const interval = setInterval(() => {
      checkAuth();
    }, 10000);

    return () => clearInterval(interval);
  }, [checkAuth, pathname]);

  const login = async (credentials: LoginRequest) => {
    const result = await authUseCases.login(credentials);
    if (result.token) {
      const auth = authUseCases.getAuthState();
      setToken(auth.token);
      setRole(auth.role);
      setUser(auth.user);
      setBidangId(auth.bidangId);
      setBidang(auth.bidang);
      setIsApproved(auth.isApproved);
      setIsAdmin(auth.isAdmin);
    }
    return result;
  };

  const googleLogin = async (idToken: string) => {
    const result = await authUseCases.googleLogin(idToken);
    if (result.token) {
      const auth = authUseCases.getAuthState();
      setToken(auth.token);
      setRole(auth.role);
      setUser(auth.user);
      setBidangId(auth.bidangId);
      setBidang(auth.bidang);
      setIsApproved(auth.isApproved);
      setIsAdmin(auth.isAdmin);
    }
    return result;
  };

  const register = async (data: RegisterRequest) => {
    return await authUseCases.register(data);
  };

  const logout = () => {
    authUseCases.logout();
    setToken(null);
    setRole(null);
    setUser(null);
    setBidangId(null);
    setBidang(null);
    setIsApproved(false);
    setIsAdmin(false);
    router.push('/login');
  };

  const isPendingApproval = !isAdmin && !isApproved;

  return {
    token,
    role,
    user,
    bidangId,
    bidang,
    isApproved,
    isAdmin,
    isPendingApproval,
    isLoading,
    login,
    googleLogin,
    register,
    logout,
    checkAuth,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useBidangs.ts 
```tsx 
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bidang, CreateBidangDto, UpdateBidangDto } from '@/core/domain/bidang';
import { BidangUseCases } from '@/core/usecases/bidangUseCases';
import { bidangRepository } from '@/infrastructure/repositories/BidangRepository';

const bidangUseCases = new BidangUseCases(bidangRepository);

export function useBidangs(autoFetch: boolean = true) {
  const [bidangs, setBidangs] = useState<Bidang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBidangs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bidangUseCases.getAllBidangs();
      setBidangs(data);
    } catch (err: any) {
      setError(err?.response?.data?.pesan || err?.message || 'Gagal memuat daftar bidang');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBidang = useCallback(async (dto: CreateBidangDto) => {
    try {
      const created = await bidangUseCases.createBidang(dto);
      setBidangs(prev => [...prev, created]);
      return { ok: true, data: created };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal menambahkan bidang' };
    }
  }, []);

  const updateBidang = useCallback(async (id: number, dto: UpdateBidangDto) => {
    try {
      const updated = await bidangUseCases.updateBidang(id, dto);
      setBidangs(prev => prev.map(b => (b.id === id ? updated : b)));
      return { ok: true, data: updated };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal memperbarui bidang' };
    }
  }, []);

  const deleteBidang = useCallback(async (id: number) => {
    try {
      await bidangUseCases.deleteBidang(id);
      setBidangs(prev => prev.filter(b => b.id !== id));
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.pesan || err?.message || 'Gagal menghapus bidang' };
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchBidangs();
    }
  }, [autoFetch, fetchBidangs]);

  return {
    bidangs,
    loading,
    error,
    fetchBidangs,
    createBidang,
    updateBidang,
    deleteBidang,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useChat.ts 
```tsx 
'use client';

import { useState, useCallback } from 'react';
import { chatRepository } from '@/infrastructure/repositories/ChatRepository';
import { ChatUseCases } from '@/core/usecases/chatUseCases';
import { ChatSession, ChatMessage } from '@/core/domain/chat';

const chatUseCases = new ChatUseCases(chatRepository);

export function useChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const fetchSessions = useCallback(async () => {
    try {
      const data = await chatUseCases.fetchSessions();
      setSessions(data || []);
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  }, []);

  const loadSessionDetails = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setLoadingMessages(true);
    try {
      const msgs = await chatUseCases.fetchSessionDetails(sessionId);
      setMessages(msgs || []);
      fetchSessions();
    } catch (err) {
      console.error('Failed to fetch session details:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const newChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    fetchSessions();
  };

  const deleteSession = async (sessionId: string) => {
    const res = await chatUseCases.deleteSession(sessionId);
    if (res.ok) {
      if (currentSessionId === sessionId) {
        newChat();
      } else {
        fetchSessions();
      }
    }
    return res;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);

    try {
      const result = await chatUseCases.sendMessage({
        message: text,
        topK: 5,
        sessionId: currentSessionId,
      });

      if (result.sukses || result.Sukses) {
        const data = result.data || result.Data;
        const answer = data?.answer || data?.Answer || 'Respon kosong.';
        const newSessionId = data?.sessionId || data?.SessionId;
        const sources = data?.sources || data?.Sources || [];

        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: answer,
          timestamp: new Date().toISOString(),
          sources: sources,
        };

        setMessages(prev => [...prev, aiMessage]);

        if (!currentSessionId && newSessionId) {
          setCurrentSessionId(newSessionId);
          fetchSessions();
        }
      } else {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan: ' + (result.pesan || result.Pesan || ''),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Kesalahan koneksi.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return {
    sessions,
    currentSessionId,
    messages,
    loadingMessages,
    isSending,
    fetchSessions,
    loadSessionDetails,
    newChat,
    deleteSession,
    sendMessage,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useDataSignalR.ts 
```tsx 
'use client';

import { useEffect, useState } from 'react';
import { signalRService } from '@/infrastructure/signalr/SignalRService';

export function useDataSignalR(
  onDocumentChange?: (event: string, data?: any) => void,
  onUserChange?: (event: string, data?: any) => void,
  onChatChange?: (event: string, data?: any) => void
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initConnection = async () => {
      await signalRService.startConnection();
      if (isMounted) {
        setIsConnected(true);
      }

      if (onDocumentChange) {
        signalRService.onDocumentChanged((event, data) => {
          onDocumentChange(event, data);
        });
      }

      if (onUserChange) {
        signalRService.onUserChanged((event, data) => {
          onUserChange(event, data);
        });
      }

      if (onChatChange) {
        signalRService.onChatChanged((event, data) => {
          onChatChange(event, data);
        });
      }
    };

    initConnection();

    return () => {
      isMounted = false;
      signalRService.offAll();
    };
  }, [onDocumentChange, onUserChange, onChatChange]);

  return { isConnected };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useDocuments.ts 
```tsx 
'use client';

import { useState, useCallback } from 'react';
import { documentRepository } from '@/infrastructure/repositories/DocumentRepository';
import { DocumentUseCases } from '@/core/usecases/documentUseCases';
import { Document, DocumentAccessUser, SaveDocumentDto } from '@/core/domain/document';

const docUseCases = new DocumentUseCases(documentRepository);

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [keyword, setKeyword] = useState<string>('');
  const [namaTenagaAhli, setNamaTenagaAhli] = useState<string>('');
  const [jenisDokumen, setJenisDokumen] = useState<string>('');
  const [periodeLaporan, setPeriodeLaporan] = useState<string>('');
  const [bidang, setBidang] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocuments = useCallback(async (overrides?: { page?: number; searchKey?: string; tenagaAhli?: string; jenisDok?: string; periode?: string; bidang?: string }) => {
    setLoading(true);
    const page = overrides?.page ?? currentPage;
    const searchKey = overrides?.searchKey ?? keyword;
    const tenagaAhli = overrides?.tenagaAhli ?? namaTenagaAhli;
    const jenisDok = overrides?.jenisDok ?? jenisDokumen;
    const periode = overrides?.periode ?? periodeLaporan;
    const filterBidang = overrides?.bidang ?? bidang;

    try {
      const res = await docUseCases.fetchDocuments({
        pageNumber: page,
        pageSize: 10,
        keyword: searchKey,
        namaTenagaAhli: tenagaAhli,
        jenisDokumen: jenisDok,
        periodeLaporan: periode,
        bidang: filterBidang,
      });

      if (res.sukses) {
        const docList = res.data.data || [];
        setDocuments(docList);
        const total = Math.ceil(res.data.totalRecords / res.data.pageSize) || 1;
        setTotalPages(total);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, keyword, namaTenagaAhli, jenisDokumen, periodeLaporan, bidang]);

  const saveDocument = async (dto: SaveDocumentDto) => {
    const res = await docUseCases.saveDocument(dto);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const deleteDocument = async (id: string) => {
    const res = await docUseCases.deleteDocument(id);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const downloadDocument = async (id: string, fileName?: string) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<div style="font-family:sans-serif;padding:20px;text-align:center;">Memuat dokumen, harap tunggu...</div>');
    }

    try {
      const blob = await docUseCases.downloadDocument(id);
      const url = URL.createObjectURL(blob);
      
      if (newWindow) {
        newWindow.document.body.innerHTML = `
          <body style="margin:0;padding:0;overflow:hidden;">
            <embed src="${url}" type="application/pdf" width="100%" height="100%" style="border:none;" />
          </body>
        `;
        newWindow.document.title = fileName || 'Dokumen';
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      if (newWindow) newWindow.close();
      throw err;
    }
  };

  const fetchShares = async (documentId: string): Promise<DocumentAccessUser[]> => {
    return await docUseCases.fetchShares(documentId);
  };

  const shareDocument = async (documentId: string, username: string) => {
    const res = await docUseCases.shareDocument(documentId, username);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  const revokeShare = async (documentId: string, targetUserId: string) => {
    const res = await docUseCases.revokeShare(documentId, targetUserId);
    if (res.ok) {
      await fetchDocuments();
    }
    return res;
  };

  return {
    documents,
    currentPage,
    totalPages,
    keyword,
    namaTenagaAhli,
    jenisDokumen,
    periodeLaporan,
    bidang,
    loading,
    setCurrentPage,
    setKeyword,
    setNamaTenagaAhli,
    setJenisDokumen,
    setPeriodeLaporan,
    setBidang,
    fetchDocuments,
    saveDocument,
    deleteDocument,
    downloadDocument,
    fetchShares,
    shareDocument,
    revokeShare,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useProfile.ts 
```tsx 
'use client';

import { useState, useCallback } from 'react';
import { userRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/core/usecases/userUseCases';
import { UserAccount, UpdateProfileDto } from '@/core/domain/user';

const userUseCases = new UserUseCases(userRepository);

export function useProfile() {
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userUseCases.getProfile();
      setProfile(data);
      return data;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat profil';
      setError(msg);
      console.error('Failed to fetch profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async (dto: UpdateProfileDto) => {
    setSaving(true);
    setError(null);
    try {
      const res = await userUseCases.updateProfile(dto);
      if (res.ok && res.user) {
        setProfile(res.user);
      } else if (res.ok) {
        await fetchProfile();
      }
      return res;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
      setError(msg);
      return { ok: false, message: msg };
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    fetchProfile,
    updateProfile,
    setProfile,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useSignalR.ts 
```tsx 
'use client';

export function useSignalR(_sessionId?: string | null) {
  return { isConnected: false };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useToast.ts 
```tsx 
'use client';

import { useState, useCallback } from 'react';

export interface ToastState {
  show: boolean;
  message: string;
  isError: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: '',
    isError: false,
  });

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  return { toast, showToast };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\hooks\useUsers.ts 
```tsx 
'use client';

import { useState, useCallback } from 'react';
import { userRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/core/usecases/userUseCases';
import { UserAccount, CreateUserDto, UpdateUserDto } from '@/core/domain/user';

const userUseCases = new UserUseCases(userRepository);

export function useUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userUseCases.fetchUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (dto: CreateUserDto) => {
    const res = await userUseCases.createUser(dto);
    if (res.ok) fetchUsers();
    return res;
  };

  const updateUser = async (dto: UpdateUserDto) => {
    const res = await userUseCases.updateUser(dto);
    if (res.ok) fetchUsers();
    return res;
  };

  const approveUser = async (id: string, bidang: string) => {
    const res = await userUseCases.approveUser(id, bidang);
    if (res.ok) fetchUsers();
    return res;
  };

  const deleteUser = async (id: string) => {
    const res = await userUseCases.deleteUser(id);
    if (res.ok) fetchUsers();
    return res;
  };

  return {
    users,
    loading,
    fetchUsers,
    createUser,
    updateUser,
    approveUser,
    deleteUser,
  };
}
 
``` 
.
### File: \dokumen\siap\siap-fe\src\presentation\utils\formatters.ts 
```tsx 
export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatBytes(bytes: number | undefined | null, decimals = 2): string {
  if (!bytes || !+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
 
``` 
.
