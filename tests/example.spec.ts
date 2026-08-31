import { test, expect } from '@playwright/test';

test.describe('SIAP Application Tests', () => {
  test('homepage has SIPENTA title and branding', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SIAP|SIPENTA/);
  });
});
