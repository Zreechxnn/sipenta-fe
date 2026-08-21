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

