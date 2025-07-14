import { test, expect } from '@playwright/test';
import fs from 'fs';

let config;
try {
  config = JSON.parse(fs.readFileSync('tests/datas.json', 'utf8'));
} catch (error) {
  throw new Error('Error reading datas.json file or parsing JSON: ' + error.message);
}

const { email, password } = config;

if (!email || !password) {
  throw new Error('Email or password not defined in datas.json');
}

test('Login User with Correct Username and Password', async ({ page }) => {
  await page.goto('https://automationexercise.com/');

  const logo = page.locator('img[alt="Website for automation practice"]');
  await expect(logo).toBeVisible();

  await page.locator('text="Signup / Login"').click();

  const loginTitle = page.locator('h2:has-text("Login to your account")');
  await expect(loginTitle).toBeVisible();

  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);

  await page.locator('[data-qa="login-button"]').click();

  // Wait for the "Delete Account" link to appear after login
  const deleteAccount = page.locator('a:has-text("Delete Account")');
  await deleteAccount.waitFor({ state: 'visible', timeout: 40000 });  // Wait for up to 20 seconds

  // Ensure the "Delete Account" link is visible
  await expect(deleteAccount).toBeVisible();
  await deleteAccount.click();

  // Wait for the account deletion confirmation
  const deleteConfirmation = page.locator('b:has-text("Account Deleted!")');
  await expect(deleteConfirmation).toBeVisible();
});
