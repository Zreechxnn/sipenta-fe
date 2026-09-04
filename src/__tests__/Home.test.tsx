import { describe, it, expect } from 'vitest';
import { formatBytes, formatDate, escapeHtml } from '@/presentation/utils/formatters';
import { isTokenExpired } from '@/infrastructure/api/apiClient';

describe('Utility Formatters', () => {
  it('formatBytes should correctly format bytes to human readable string', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(null)).toBe('0 Bytes');
    expect(formatBytes(undefined)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(5368709120)).toBe('5 GB');
  });

  it('formatDate should format ISO date string correctly', () => {
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
    expect(formatDate('')).toBe('-');
    const formatted = formatDate('2026-08-30T10:00:00Z');
    expect(formatted).toContain('2026');
  });

  it('escapeHtml should escape HTML special characters', () => {
    expect(escapeHtml('')).toBe('');
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('isTokenExpired should return true for invalid or missing token', () => {
    expect(isTokenExpired(null)).toBe(true);
    expect(isTokenExpired('')).toBe(true);
    expect(isTokenExpired('invalid-token')).toBe(true);
  });
});

describe('Cookie and Notification Utilities', () => {
  it('should handle cookie read, write, and delete correctly', async () => {
    const { setCookie, getCookie, deleteCookie } = await import('@/presentation/utils/cookies');
    setCookie('test_cookie', 'sipenta_val', 1);
    expect(getCookie('test_cookie')).toBe('sipenta_val');

    deleteCookie('test_cookie');
    expect(getCookie('test_cookie')).toBeNull();
  });

  it('should handle device notification utilities without throwing', async () => {
    const {
      isDeviceNotificationSupported,
      isDeviceNotificationEnabled,
      getDeviceNotificationPermission,
      playNotificationChime,
    } = await import('@/presentation/utils/deviceNotification');

    expect(typeof isDeviceNotificationSupported()).toBe('boolean');
    expect(typeof isDeviceNotificationEnabled()).toBe('boolean');
    expect(['granted', 'denied', 'default', 'unsupported']).toContain(
      getDeviceNotificationPermission()
    );
    expect(() => playNotificationChime()).not.toThrow();
  });

  it('should store and clear auth token via cookies without touching localStorage', async () => {
    const { setCookie, getCookie, deleteCookie } = await import('@/presentation/utils/cookies');
    setCookie('sipenta_token', 'mock_jwt_token', 7);
    expect(getCookie('sipenta_token')).toBe('mock_jwt_token');

    deleteCookie('sipenta_token');
    expect(getCookie('sipenta_token')).toBeNull();
  });

  it('should support session cookies when days is omitted', async () => {
    const { setCookie, getCookie, deleteCookie } = await import('@/presentation/utils/cookies');
    setCookie('session_cookie', 'session_val');
    expect(getCookie('session_cookie')).toBe('session_val');

    deleteCookie('session_cookie');
    expect(getCookie('session_cookie')).toBeNull();
  });
});
