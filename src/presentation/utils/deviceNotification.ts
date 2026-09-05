import { getCookie, setCookie } from './cookies';

export const NOTIFICATION_COOKIE_KEY = 'sipenta_device_notifications';
export const NOTIFICATION_EVENT_NAME = 'sipenta-notification-preference-changed';

export type DeviceNotificationPermission = 'granted' | 'denied' | 'default' | 'unsupported';

export interface DeviceNotificationOptions {
  body?: string;
  icon?: string;
  tag?: string;
  url?: string;
  sound?: boolean;
}

/**
 * Check if the current browser environment supports the Web Notification API.
 */
export function isDeviceNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission status.
 */
export function getDeviceNotificationPermission(): DeviceNotificationPermission {
  if (!isDeviceNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check if device notifications are enabled via cookie and permission.
 */
export function isDeviceNotificationEnabled(): boolean {
  if (!isDeviceNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  const cookieValue = getCookie(NOTIFICATION_COOKIE_KEY);
  return cookieValue === 'true';
}

/**
 * Synthesize a modern, pleasant notification chime using Web Audio API.
 * Requires zero external audio files.
 */
export function playNotificationChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now + 0.08);
    gain2.gain.setValueAtTime(0.15, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.5);
  } catch {
  }
}

/**
 * Request notification permission and enable notifications in cookies.
 */
export async function enableDeviceNotifications(): Promise<{
  success: boolean;
  permission: DeviceNotificationPermission;
  message: string;
}> {
  if (!isDeviceNotificationSupported()) {
    return {
      success: false,
      permission: 'unsupported',
      message: 'Browser Anda tidak mendukung notifikasi perangkat.',
    };
  }

  try {
    let perm = Notification.permission;

    if (perm === 'default') {
      perm = await Notification.requestPermission();
    }

    if (perm === 'granted') {
      setCookie(NOTIFICATION_COOKIE_KEY, 'true', 365);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT_NAME, { detail: { enabled: true } }));
      }

      playNotificationChime();

      try {
        new Notification('SIPENTA - Notifikasi Perangkat Aktif', {
          body: 'Anda akan menerima notifikasi langsung di perangkat saat ada aktivitas baru.',
          icon: '/sipenta.svg',
          tag: 'sipenta-welcome',
        });
      } catch {
      }

      return {
        success: true,
        permission: 'granted',
        message: 'Notifikasi perangkat berhasil diaktifkan!',
      };
    } else if (perm === 'denied') {
      setCookie(NOTIFICATION_COOKIE_KEY, 'false', 365);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT_NAME, { detail: { enabled: false } }));
      }
      return {
        success: false,
        permission: 'denied',
        message: 'Izin notifikasi diblokir oleh browser. Harap izinkan notifikasi pada ikon gembok di bilah alamat browser.',
      };
    } else {
      setCookie(NOTIFICATION_COOKIE_KEY, 'false', 365);
      return {
        success: false,
        permission: perm,
        message: 'Izin notifikasi tidak diberikan.',
      };
    }
  } catch (err) {
    console.error('Failed to request notification permission:', err);
    return {
      success: false,
      permission: getDeviceNotificationPermission(),
      message: 'Gagal mengaktifkan notifikasi perangkat.',
    };
  }
}

/**
 * Disable device notifications in cookies.
 */
export function disableDeviceNotifications(): void {
  setCookie(NOTIFICATION_COOKIE_KEY, 'false', 365);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT_NAME, { detail: { enabled: false } }));
  }
}

/**
 * Toggle device notifications.
 */
export async function toggleDeviceNotifications(): Promise<{
  success: boolean;
  isEnabled: boolean;
  message: string;
}> {
  if (isDeviceNotificationEnabled()) {
    disableDeviceNotifications();
    return {
      success: true,
      isEnabled: false,
      message: 'Notifikasi perangkat telah dinonaktifkan.',
    };
  } else {
    const res = await enableDeviceNotifications();
    return {
      success: res.success,
      isEnabled: res.success,
      message: res.message,
    };
  }
}

/**
 * Send a native device notification if enabled.
 */
export function sendDeviceNotification(
  title: string,
  options?: DeviceNotificationOptions
): boolean {
  if (!isDeviceNotificationEnabled()) return false;

  try {
    const notif = new Notification(title, {
      body: options?.body,
      icon: options?.icon || '/sipenta.svg',
      tag: options?.tag || `sipenta-${Date.now()}`,
    });

    if (options?.url && typeof window !== 'undefined') {
      notif.onclick = () => {
        window.focus();
        if (window.location.pathname !== options.url) {
          window.location.href = options.url!;
        }
      };
    }

    if (options?.sound !== false) {
      playNotificationChime();
    }

    return true;
  } catch (err) {
    console.error('Error dispatching device notification:', err);
    return false;
  }
}
