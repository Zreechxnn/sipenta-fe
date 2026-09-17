'use client';

import { useEffect, useRef } from 'react';

interface UseAntiInspectOptions {
  onDevToolsDetected?: () => void;
  showWarning?: (msg: string) => void;
  enabled?: boolean;
}

export function useAntiInspect(options?: UseAntiInspectOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (options?.enabled === false) return;

    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      optionsRef.current?.showWarning?.('Inspeksi elemen dan klik kanan dinonaktifkan pada area konfigurasi demi keamanan!');
    };

    // 2. Block Inspect Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        optionsRef.current?.onDevToolsDetected?.();
        optionsRef.current?.showWarning?.('Pintasan Developer Tools (F12) diblokir! Sesi dikunci demi keamanan.');
        return;
      }

      // Ctrl+Shift+I / Cmd+Option+I (Inspect)
      // Ctrl+Shift+J / Cmd+Option+J (Console)
      // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        optionsRef.current?.onDevToolsDetected?.();
        optionsRef.current?.showWarning?.('Pintasan inspeksi browser diblokir! Sesi dikunci demi keamanan.');
        return;
      }

      // Ctrl+U / Cmd+Option+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
        optionsRef.current?.showWarning?.('Melihat kode sumber halaman diblokir demi keamanan!');
        return;
      }

      // Ctrl+S / Cmd+S (Save Page)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+C / Cmd+C (Copy)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          e.preventDefault();
          e.stopPropagation();
          optionsRef.current?.showWarning?.('Penyalinan data konfigurasi dilarang demi keamanan!');
        }
      }
    };

    // 3. Block Copy and Cut events
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      optionsRef.current?.showWarning?.('Penyalinan data konfigurasi dilarang demi keamanan!');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      optionsRef.current?.showWarning?.('Pemotongan data konfigurasi dilarang demi keamanan!');
    };

    // 4. DevTools Detection Trap (Resize anomaly check)
    const threshold = 180;
    let devToolsTriggered = false;
    const checkDevTools = () => {
      if (devToolsTriggered) return;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      if (widthDiff || heightDiff) {
        devToolsTriggered = true;
        optionsRef.current?.onDevToolsDetected?.();
        optionsRef.current?.showWarning?.('Terdeteksi percobaan inspeksi (DevTools)! Halaman konfigurasi dikunci otomatis.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('cut', handleCut);
    window.addEventListener('resize', checkDevTools);

    const interval = setInterval(checkDevTools, 2000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('resize', checkDevTools);
      clearInterval(interval);
    };
  }, [options?.enabled]);
}
