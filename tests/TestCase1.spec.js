const { test, expect } = require('@playwright/test');

test('Register User', async ({ page }) => {
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
  await nameInput.fill('ABCTest');
  
  const emailInput = page.locator('[data-qa="signup-email"]');
  await emailInput.fill('voiyeddoikipi-5239@yopmail.com');

  // Step 6: Click the 'Signup' button to proceed
  const signupButton = page.locator('[data-qa="signup-button"]');
  await signupButton.click();

  // Step 7: Verify 'ENTER ACCOUNT INFORMATION' is visible
  const accountInfoTitle = page.locator('b:text("Enter Account Information")');
  await expect(accountInfoTitle).toBeVisible();

  // Step 8: Select gender radio button (Mr.)
  const mrRadioButton = page.locator('#id_gender1');
  await expect(mrRadioButton).toBeVisible();  // Ensures the radio button is visible
  await mrRadioButton.check();

  const password= page.locator('[data-qa="password"]');
  await password.fill('Admin@123');

    await page.locator('[data-qa="years"]').click('2000');
    await page.locator('[data-qa="months"]').click('August');
    await page.locator('[data-qa="days"]').click('5');


});
