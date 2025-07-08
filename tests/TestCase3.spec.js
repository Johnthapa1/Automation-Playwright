const{test, expect}= require('@playwright/test');

test('Login User with incorrect email and password',async({page})=>{

    await page.goto('https://automationexercise.com/');

    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();
  
    await page.locator('text="Signup / Login"').click();

    const LoginTitle= page.locator('h2:text("Login to your Account")');
    await expect(LoginTitle).toBeVisible;

    await page.locator('[data-qa="login-email"]').fill("test123@gmail.com")
    await page.locator('[data-qa="login-password"]').fill("jhsd5325sdb")

    await page.locator('[data-qa="login-button"]').click();
    
})