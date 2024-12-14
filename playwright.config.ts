import { defineConfig, devices, Reporter } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

// Custom reporter to log failed test cases
class FailedTestsReporter implements Reporter {
  onTestEnd(test, result) {
    if (result.status === 'failed') {
      const log = `Test: ${test.title} - Status: ${result.status}\n`;
      fs.appendFileSync('failed-tests.log', log);
    }
  }
}

const failedTestsReporter = new FailedTestsReporter();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60000, // 60 seconds timeout per test
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }]
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://onlinelibrary.wiley.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: process.env.HEADLESS !== 'false',
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      retries: 2,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      retries: 1,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
