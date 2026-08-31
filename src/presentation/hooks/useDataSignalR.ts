'use client';

import { useEffect, useState } from 'react';
import { signalRService } from '@/infrastructure/signalr/SignalRService';
import { sendDeviceNotification } from '@/presentation/utils/deviceNotification';

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

      signalRService.onDocumentChanged((event, data) => {
        // Dispatch device notification if enabled via cookies
        if (event === 'DocumentCreated') {
          sendDeviceNotification('SIPENTA - Dokumen Baru', {
            body: data?.nama || data?.namaFile || 'Dokumen laporan kerja baru telah ditambahkan ke sistem.',
            url: '/dokumen',
            tag: 'doc-created',
          });
        } else if (event === 'DocumentShared') {
          sendDeviceNotification('SIPENTA - Dokumen Dibagikan', {
            body: 'Akses membaca dokumen laporan telah dibagikan kepada Anda.',
            url: '/dokumen',
            tag: 'doc-shared',
          });
        } else if (event === 'DocumentAccessRevoked') {
          sendDeviceNotification('SIPENTA - Akses Dokumen Dicabut', {
            body: 'Hak akses membaca ke suatu dokumen telah dicabut.',
            url: '/dokumen',
            tag: 'doc-revoked',
          });
        }

        if (onDocumentChange) {
          onDocumentChange(event, data);
        }
      });

      signalRService.onUserChanged((event, data) => {
        if (event === 'UserRegistered' || event === 'UserCreated') {
          sendDeviceNotification('SIPENTA - Pengguna Baru', {
            body: 'Pengguna baru telah mendaftar dan menunggu verifikasi Admin/Kasubag.',
            url: '/users',
            tag: 'user-registered',
          });
        }

        if (onUserChange) {
          onUserChange(event, data);
        }
      });

      signalRService.onChatChanged((event, data) => {
        if (event === 'ReceiveSessionMessage') {
          sendDeviceNotification('SIPENTA - Asisten AI', {
            body: typeof data === 'string' ? data : data?.content || 'Pesan baru diterima dari Asisten AI.',
            url: '/chat',
            tag: 'chat-message',
          });
        }

        if (onChatChange) {
          onChatChange(event, data);
        }
      });
    };

    initConnection();

    return () => {
      isMounted = false;
      signalRService.offAll();
    };
  }, [onDocumentChange, onUserChange, onChatChange]);

  return { isConnected };
}
