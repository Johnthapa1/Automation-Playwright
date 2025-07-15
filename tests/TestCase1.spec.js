import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Function to generate random credentials
function generateTestCredentials() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15); // Longer random string
  const randomNum = Math.floor(Math.random() * 10000);
  
  return {
    username: `TestUser_${timestamp}_${randomNum}`,
    email: `testuser_${randomString}_${timestamp}@yopmail.com`,
    password: 'Admin@123',
    firstName: 'David',
    lastName: 'Beckham',
    company: 'Test Company',
    address1: 'Newyork,street-23',
    address2: 'Apt 456',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Bihar',
    zipcode: '446000',
    mobileNumber: '9876543276'
  };
}

// Function to save credentials to JSON file
function saveCredentialsToFile(credentials) {
  const filePath = path.join(process.cwd(), 'tests', 'datas.json');
  const dataToSave = {
    email: credentials.email,
    password: credentials.password,
    username: credentials.username,
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    company: credentials.company,
    address1: credentials.address1,
    address2: credentials.address2,
    country: credentials.country,
    state: credentials.state,
    city: credentials.city,
    zipcode: credentials.zipcode,
    mobileNumber: credentials.mobileNumber,
    createdAt: new Date().toISOString()
  };
  
  try {
    // Create tests directory if it doesn't exist
    const testsDir = path.dirname(filePath);
    if (!fs.existsSync(testsDir)) {
      fs.mkdirSync(testsDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2));
    console.log('Credentials saved to datas.json successfully');
    console.log('Email:', credentials.email);
    console.log('Password:', credentials.password);
    console.log('Username:', credentials.username);
  } catch (error) {
    console.error('Error saving credentials:', error);
    throw error;
  }
}

test('Register User', async ({ page }) => {
  let credentials = generateTestCredentials();
  let retryCount = 0;
  const maxRetries = 3;
  
  console.log('Starting signup process with generated credentials...');
  
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
  
  // Retry logic for email conflicts
  while (retryCount < maxRetries) {
    try {
      // Step 5: Enter name and email address for registration
      const nameInput = page.locator('[placeholder="Name"]');
      await nameInput.clear();
      await nameInput.fill(credentials.username);
      
      // Fill email input with generated email
      const emailInput = page.locator('[data-qa="signup-email"]');
      await emailInput.clear();
      await emailInput.fill(credentials.email);
      
      // Step 6: Click the 'Signup' button to proceed
      const signupButton = page.locator('[data-qa="signup-button"]');
      await signupButton.click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Check for email already exists error
      const emailError = await page.locator('p:text("Email Address already exist!")').isVisible().catch(() => false);
      
      if (emailError) {
        console.log(`Email already exists (attempt ${retryCount + 1}/${maxRetries}), generating new credentials...`);
        credentials = generateTestCredentials();
        retryCount++;
        continue;
      }
      
      // If no error, break out of retry loop
      break;
      
    } catch (error) {
      console.log(`Error during signup attempt ${retryCount + 1}:`, error.message);
      if (retryCount === maxRetries - 1) {
        throw error;
      }
      retryCount++;
      credentials = generateTestCredentials();
    }
  }
  
  if (retryCount >= maxRetries) {
    throw new Error('Max retries exceeded for signup. Unable to create account.');
  }
  
  // Step 7: Verify 'ENTER ACCOUNT INFORMATION' is visible
  const accountInfoTitle = page.locator('text="Enter Account Information"');
  await expect(accountInfoTitle).toBeVisible();
  
  // Step 8: Select gender radio button (Mr.)
  const mrRadioButton = page.locator('#id_gender1');
  await expect(mrRadioButton).toBeVisible();
  await mrRadioButton.check();
  
  // Fill password
  const password = page.locator('[data-qa="password"]');
  await password.fill(credentials.password);
  
  // Select date of birth - Use string values for dropdown options
  await page.locator('[data-qa="days"]').selectOption('5');
  await page.locator('[data-qa="months"]').selectOption('8'); // August is month 8
  await page.locator('[data-qa="years"]').selectOption('2000');
  
  // Newsletter checkbox
  const NewsLetterCheckbox = page.locator('#newsletter');
  await expect(NewsLetterCheckbox).toBeVisible();
  await NewsLetterCheckbox.check();
  
  // Special offers checkbox
  const SpecialOffersCheckbox = page.locator('#optin');
  await expect(SpecialOffersCheckbox).toBeVisible();
  await SpecialOffersCheckbox.check();
  
  // Fill personal information
  const FirstName = page.locator('[data-qa="first_name"]');
  await FirstName.fill(credentials.firstName);
  
  const LastName = page.locator('[data-qa="last_name"]');
  await LastName.fill(credentials.lastName);
  
  const Address = page.locator('[data-qa="address"]');
  await Address.fill(credentials.address1);
  
  // Select country dropdown
  const dropdown = page.locator('#country');
  await dropdown.selectOption({ label: credentials.country });
  
  const State = page.locator('[data-qa="state"]');
  await State.fill(credentials.state);
  
  const City = page.locator('[data-qa="city"]');
  await City.fill(credentials.city);
  
  const Zipcode = page.locator('[data-qa="zipcode"]');
  await Zipcode.fill(credentials.zipcode);
  
  const MobileNumber = page.locator('[data-qa="mobile_number"]');
  await MobileNumber.fill(credentials.mobileNumber);
  
  // Create account
  const CreateAccount = page.locator('[data-qa="create-account"]');
  await CreateAccount.click();
  
  // Verify account creation
  const accountCreate = page.locator('b:text("Account Created!")');
  await expect(accountCreate).toBeVisible();
  
  // Save credentials to file AFTER successful registration
  saveCredentialsToFile(credentials);
  
  const ContinueButton = page.locator('[data-qa="continue-button"]');
  await ContinueButton.click();
  
  // Verify logged in status
  const loggedInText = page.locator('a:has-text("Logged in as")');
  await expect(loggedInText).toContainText(`Logged in as ${credentials.username}`);
  
  // Logout to prepare for login test
  const logoutButton = page.locator('a:has-text("Logout")');
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();
  
  console.log('User registration completed successfully!');
  console.log('Credentials saved for login test.');
  console.log('Ready for login test execution.');
});