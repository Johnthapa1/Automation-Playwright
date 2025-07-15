import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Function to load credentials from JSON file
function loadCredentialsFromFile() {
  const filePath = path.join(process.cwd(), 'tests', 'datas.json');
  
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('datas.json file not found. Please run the signup test first.');
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const credentials = JSON.parse(fileContent);
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Invalid credentials in datas.json. Email or password is missing.');
    }
    
    console.log('Loaded credentials from datas.json');
    console.log('Email:', credentials.email);
    console.log('Username:', credentials.username);
    
    return credentials;
  } catch (error) {
    console.error('Error loading credentials:', error.message);
    throw error;
  }
}

test('Login User with Correct Username and Password', async ({ page }) => {
  // Load credentials from file
  const credentials = loadCredentialsFromFile();
  
  console.log(`Attempting to login with: ${credentials.email}`);
  
  try {
    // Navigate to the homepage first
    await page.goto('https://automationexercise.com/');
    
    // Verify that the homepage logo is visible
    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();
    
    // Click on 'Signup / Login' button
    await page.locator('text="Signup / Login"').click();
    
    // Verify 'Login to your account' is visible
    const loginHeading = page.locator('h2:text("Login to your account")');
    await expect(loginHeading).toBeVisible();
    
    // Fill login form with auto-loaded credentials
    const emailInput = page.locator('[data-qa="login-email"]');
    await emailInput.fill(credentials.email);
    
    const passwordInput = page.locator('[data-qa="login-password"]');
    await passwordInput.fill(credentials.password);
    
    // Click login button
    const loginButton = page.locator('[data-qa="login-button"]');
    await loginButton.click();
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    
    // Debug: Check current URL and page state
    console.log('🔍 Current URL after login attempt:', page.url());
    
    // Check for login error first
    const loginErrorLocator = page.locator('.login-form .text-danger');
    const loginErrorExists = await loginErrorLocator.count() > 0;
    
    if (loginErrorExists) {
      const loginError = await loginErrorLocator.textContent();
      console.log('Login error found:', loginError);
      console.log('Login failed with credentials:', credentials.email);
      throw new Error(`Login failed. Error: ${loginError}. Email: ${credentials.email}`);
    }
    
    // Check if we're still on the login page (login failed)
    const stillOnLoginPage = await page.locator('h2:text("Login to your account")').isVisible().catch(() => false);
    if (stillOnLoginPage) {
      console.log('Still on login page - login may have failed silently');
      throw new Error(`Login failed - still on login page. Email: ${credentials.email}`);
    }
    
    // Wait a bit for the page to fully load
    await page.waitForTimeout(2000);
    
    // Check if logged in by looking for the user menu
    const loggedInText = page.locator('a:has-text("Logged in as")');
    const isLoggedIn = await loggedInText.isVisible().catch(() => false);
    
    if (!isLoggedIn) {
      console.log('Login verification failed - "Logged in as" text not found');
      console.log('Current page content:', await page.content());
      throw new Error(`Login verification failed. Cannot find "Logged in as" text. Email: ${credentials.email}`);
    }
    
    // Verify successful login by checking for logged-in user indicator
    await expect(loggedInText).toContainText(`Logged in as ${credentials.username}`);
    
    // Additional verification - check if we're on the home page
    await expect(page.locator('img[alt="Website for automation practice"]')).toBeVisible();
    
    console.log('Login successful!');
    console.log('User is now logged in as:', credentials.username);
    
    // Optional: Logout after successful login test
    const logoutButton = page.locator('a:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
    
    // Verify logout - should see login page again
    await expect(page.locator('h2:text("Login to your account")')).toBeVisible();
    
    console.log('Logout successful - test completed!');
    
  } catch (error) {
    console.log('Test failed with error:', error.message);
    console.log('Final URL:', page.url());
    console.log('Page title:', await page.title());
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'login-failure.png', fullPage: true });
    console.log('Screenshot saved as login-failure.png');
    
    throw error;
  }
});