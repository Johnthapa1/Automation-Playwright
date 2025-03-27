const{test, expect}= require('@playwright/test');

const fs = require('fs');

const config = JSON.parse(fs.readFileSync('tests/datas.json', 'utf8'));

const { email, password } = config;

// Ensure email and password are properly fetched
if (!email || !password) {
  throw new Error('Email or password not defined in datas.json');
}

test('Builtin Locaters',async({page})=>{

    await page.goto('https://automationexercise.com/');

    const logo = page.locator('img[alt="Website for automation practice"]');
    await expect(logo).toBeVisible();
  
    await page.locator('text="Signup / Login"').click();

    const LoginTitle= page.locator('h2:text("Login to your Account")');
    await expect(LoginTitle).toBeVisible;

    await page.locator('[data-qa="login-email"]').fill(email)
    await page.locator('[data-qa="login-password"]').fill(password)


    
})