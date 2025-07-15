import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Function to read credentials from the saved file (this could also be a hardcoded email for testing)
function readCredentialsFromFile() {
  const filePath = path.join(process.cwd(), 'tests', 'datas.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('Credentials file not found!');
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

test('Register User with Existing Email', async ({ page }) => {
  // Use existing credentials for this test case (can be from the previously saved datas.json or a hardcoded one)
  const existingCredentials = {
    username: 'John',
    email: 'lidegoubreidde-2047@yopmail.com', // Predefined email that's already registered
    password: 'iVWpTm@ydVFYdn9',
    // firstName: 'John',
    // lastName: 'Doe',
    // company: 'Test Company',
    // address1: '1234 Elm Street',
    // address2: 'Apt 2',
    // country: 'United States',
    // state: 'California',
    // city: 'Los Angeles',
    // zipcode: '90001',
    // mobileNumber: '1234567890'
  };

  console.log('Starting registration process with existing email...');

  // Step 1: Navigate to the homepage
  await page.goto('https://automationexercise.com/');

  // Step 2: Verify that the homepage logo is visible
  const logo = page.locator('img[alt="Website for automation practice"]');
  await expect(logo).toBeVisible();

  // Step 3: Click on 'Signup / Login' button
  await page.locator('text="Signup / Login"').click();

  // Step 4: Verify 'New User Signup!' is visible
  const signupHeading = page.locator('h2:text("New User Signup!")');
  await expect(signupHeading).toBeVisible();

  // Step 5: Enter name and email address for registration
  const nameInput = page.locator('[placeholder="Name"]');
  await nameInput.clear();
  await nameInput.fill(existingCredentials.username);

  const emailInput = page.locator('[data-qa="signup-email"]');
  await emailInput.clear();
  await emailInput.fill(existingCredentials.email);

  // Step 6: Click the 'Signup' button to proceed
  const signupButton = page.locator('[data-qa="signup-button"]');
  await signupButton.click();

  // Step 7: Wait for response (2-3 seconds)
  await page.waitForTimeout(2000);

  // Step 8: Check for email already exists error
  const emailError = await page.locator('p:text("Email Address already exist!")').isVisible().catch(() => false);
  await expect(emailError).toBeTruthy(); // This should be true if the email already exists in the system

  console.log('Email already exists, registration attempt blocked as expected.');
});
