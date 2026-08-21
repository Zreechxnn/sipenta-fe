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
