import { test } from '@playwright/test';
import path from 'path';

test.describe('Diagram Visual Audit', () => {
  const pages = [
    '/sequence/auth.html',
    '/sequence/document.html',
    '/sequence/chat.html',
    '/sequence/user.html',
    '/sequence/dashboard.html',
    '/activity/auth.html',
    '/activity/document.html',
    '/activity/chat.html',
    '/activity/user.html',
    '/activity/dashboard.html'
  ];

  for (const pageUrl of pages) {
    test(`Screenshot ${pageUrl}`, async ({ page }) => {
      await page.goto(`http://localhost:5500${pageUrl}`);
      // Wait for font loading
      await page.waitForTimeout(500);
      const filename = pageUrl.replace(/\//g, '_').substring(1) + '.png';
      const filepath = path.join('..', 'diagram', 'screenshots', filename);
      await page.screenshot({ path: filepath, fullPage: true });
      console.log(`Saved ${filepath}`);
    });
  }
});
