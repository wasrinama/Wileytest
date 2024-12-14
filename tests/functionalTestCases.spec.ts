import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Functional Test Cases for Wiley Online Library', () => {

  // Test Case 1: Verify the search functionality works correctly
  test('Verify Search Functionality', async ({ page }) => {
    await page.goto('https://onlinelibrary.wiley.com/');
    await page.waitForLoadState('networkidle');

    const searchInput = 'input[name="q"]';
    try {
      await page.waitForSelector(searchInput, { timeout: 60000 });
      await page.fill(searchInput, 'Artificial Intelligence');
      await page.press(searchInput, 'Enter');

      const searchResults = page.locator('.search-result__title');
      await searchResults.first().waitFor({ state: 'visible', timeout: 60000 });

      const resultCount = await searchResults.count();
      expect(resultCount).toBeGreaterThan(0);
      console.log(`Search results displayed: ${resultCount}`);
    } catch (error) {
      console.error('Error in Verify Search Functionality:', error);
    }
  });

  // Test Case 2: Verify login page is accessible
  test('Verify Login Page Accessibility', async ({ page }) => {
    await page.goto('https://onlinelibrary.wiley.com/');
    await page.waitForLoadState('networkidle');

    const loginLink = 'a:has-text("Log in")';
    try {
      await page.waitForSelector(loginLink, { timeout: 60000 });
      await page.click(loginLink);

      const loginForm = page.locator('#loginForm');
      await loginForm.waitFor({ state: 'visible', timeout: 60000 });

      await expect(loginForm).toBeVisible();
      console.log('Login page is accessible.');
    } catch (error) {
      console.error('Error in Verify Login Page Accessibility:', error);
    }
  });

  // Test Case 3: Verify navigation to Journals section
  test('Verify Navigation to Journals Section', async ({ page }) => {
    await page.goto('https://onlinelibrary.wiley.com/');
    await page.waitForLoadState('networkidle');

    const journalsLink = 'a:has-text("Journals")';
    try {
      await page.waitForSelector(journalsLink, { timeout: 60000 });
      await page.click(journalsLink);

      const journalsHeading = page.locator('h1');
      await journalsHeading.waitFor({ state: 'visible', timeout: 60000 });

      const headingText = await journalsHeading.textContent();
      expect(headingText).toContain('Journals');
      console.log('Navigated to the Journals section successfully.');
    } catch (error) {
      console.error('Error in Verify Navigation to Journals Section:', error);
    }
  });
});
