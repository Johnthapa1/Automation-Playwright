// playwright.config.js - Enhanced configuration with environment-specific settings
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Dynamic timeout based on environment
  timeout: process.env.CI ? 60000 : 90000,
  
  expect: {
    timeout: 15000,
  },
  
  // Parallel execution based on environment
  fullyParallel: process.env.CI ? false : false, // Keep sequential for stability
  forbidOnly: !!process.env.CI,
  
  // Retry configuration
  retries: process.env.CI ? 2 : 1,
  
  // Worker configuration - sequential execution
  workers: 1,
  
  // Enhanced reporter configuration
  reporter: [
    ['html', { 
      open: process.env.CI ? 'never' : 'on-failure',
      outputFolder: './playwright-report'
    }],
    ['list'],
    ['json', { outputFile: './test-results/results.json' }],
    ['junit', { outputFile: './test-results/junit.xml' }]
  ],
  
  // Global test configuration
  use: {
    // Base URL for your application
    baseURL: 'https://automationexercise.com',
    
    // Tracing and debugging
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Timeout configurations
    actionTimeout: 15000,
    navigationTimeout: 45000,
    
    // Browser behavior
    headless: process.env.CI ? true : false,
    slowMo: process.env.CI ? 0 : 1000,
    
    // Additional useful settings
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    },
    
    // Output directory for test artifacts
    outputDir: './test-results',
  },
  
  // Browser project configurations
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chrome-specific settings
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        }
      },
    },
    
    // Uncomment for multi-browser testing
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     launchOptions: {
    //       firefoxUserPrefs: {
    //         'media.navigator.streams.fake': true,
    //         'media.navigator.permission.disabled': true,
    //       }
    //     }
    //   },
    // },
    
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Mobile testing projects
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //     hasTouch: true,
    //   },
    // },
    
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 12'],
    //     hasTouch: true,
    //   },
    // },
  ],
  
  // Global setup and teardown
  // globalSetup: './tests/global-setup.js',
  // globalTeardown: './tests/global-teardown.js',
  
  // Web server configuration (uncomment if needed)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
  
  // Test metadata
  metadata: {
    testType: 'e2e',
    environment: process.env.NODE_ENV || 'test',
    version: process.env.npm_package_version || '1.0.0',
  },
  
  // Output directory structure
  outputDir: './test-results',
  
  // Maximum failures before stopping
  maxFailures: process.env.CI ? 10 : 5,
  
  // Test filtering
  testMatch: [
    '**/tests/**/*.spec.js',
    '**/tests/**/*.test.js',
    '**/e2e/**/*.spec.js'
  ],
  
  // Ignore certain test files
  testIgnore: [
    '**/tests/ignore/**',
    '**/node_modules/**'
  ],
});