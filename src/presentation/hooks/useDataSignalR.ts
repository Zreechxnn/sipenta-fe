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
