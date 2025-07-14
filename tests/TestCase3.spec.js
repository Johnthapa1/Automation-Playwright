import { test, expect } from '@playwright/test';

test('Login User with incorrect email and password', async ({ page }) => {
    await page.goto('https://automationexercise.com/');

    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();

    await page.locator('text="Signup / Login"').click();

    const loginTitle = page.locator('h2:has-text("Login to your account")');
    await expect(loginTitle).toBeVisible();

    await page.locator('[data-qa="login-email"]').fill("test123@gmail.com");
    await page.locator('[data-qa="login-password"]').fill("jhsd5325sdb");

    await page.locator('[data-qa="login-button"]').click();

    const errorMsg = page.locator('p', { hasText: 'Your email or password is incorrect!' });
    await expect(errorMsg).toBeVisible();
});
