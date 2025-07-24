import { test, expect } from '@playwright/test';

test.describe('Simple Test Suite', () => {
  test('should pass - basic test', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('should fail - intentional failure', async ({ page }) => {
    await page.goto('https://playwright.dev/');
    // This will fail intentionally to demonstrate error reporting
    await expect(page).toHaveTitle('This Title Does Not Exist');
  });

  test('should skip - conditional test', async ({ page }) => {
    test.skip(true, 'This test is skipped for demo purposes');
    await page.goto('https://playwright.dev/');
  });
});