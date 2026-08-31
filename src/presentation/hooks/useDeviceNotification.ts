'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  isDeviceNotificationSupported,
  isDeviceNotificationEnabled,
  getDeviceNotificationPermission,
  toggleDeviceNotifications,
  sendDeviceNotification,
  playNotificationChime,
  NOTIFICATION_EVENT_NAME,
  DeviceNotificationPermission,
  DeviceNotificationOptions,
} from '@/presentation/utils/deviceNotification';

export function useDeviceNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [permission, setPermission] = useState<DeviceNotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = useCallback(() => {
    const supported = isDeviceNotificationSupported();
    setIsSupported(supported);
    if (supported) {
      setPermission(getDeviceNotificationPermission());
      setIsEnabled(isDeviceNotificationEnabled());
    } else {
      setPermission('unsupported');
      setIsEnabled(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();

    const handlePreferenceChange = () => {
      checkStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(NOTIFICATION_EVENT_NAME, handlePreferenceChange);
      window.addEventListener('focus', handlePreferenceChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(NOTIFICATION_EVENT_NAME, handlePreferenceChange);
        window.removeEventListener('focus', handlePreferenceChange);
      }
    };
  }, [checkStatus]);

  const toggle = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await toggleDeviceNotifications();
      checkStatus();
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [checkStatus]);

  const notify = useCallback((title: string, options?: DeviceNotificationOptions) => {
    return sendDeviceNotification(title, options);
  }, []);

  return {
    isSupported,
    isEnabled,
    permission,
    isLoading,
    toggle,
    notify,
    playChime: playNotificationChime,
  };
}
