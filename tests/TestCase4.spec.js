import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Function to read credentials from the saved datas.json file
function readCredentialsFromFile() {
  const filePath = path.join(process.cwd(), 'tests', 'datas.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('Credentials file not found!');
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

test('Logout User', async ({ page }) => {
  // Step 1: Read credentials from the file
  const credentials = readCredentialsFromFile();
  console.log('Using the following credentials for login test:');
  console.log('Email:', credentials.email);
  console.log('Password:', credentials.password);
  
  // Step 2: Navigate to the homepage
  await page.goto('https://automationexercise.com/');
  
  // Step 4: Click on 'Signup / Login' button
  await page.locator('text="Signup / Login"').click();

  // Step 5: Enter email and password to log in
  const emailInput = page.locator('[data-qa="login-email"]');
  await emailInput.fill(credentials.email);
  
  const passwordInput = page.locator('[data-qa="login-password"]');
  await passwordInput.fill(credentials.password);

  // Step 6: Click the 'Login' button
  const loginButton = page.locator('[data-qa="login-button"]');
  await loginButton.click();
  
  // Step 7: Verify that the user has successfully logged in
  const loggedInText = page.locator('a:has-text("Logged in as")');
  await expect(loggedInText).toContainText(`Logged in as ${credentials.username}`);
  
  // Step 8: Locate and click the 'Logout' button
  const logoutButton = page.locator('a:has-text("Logout")');
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();
  
  // Step 9: Verify that the user is logged out and redirected to the login page
  const loginPageText = page.locator('h2:text("New User Signup!")');
  await expect(loginPageText).toBeVisible();
  
  console.log('User logout completed successfully!');
});
