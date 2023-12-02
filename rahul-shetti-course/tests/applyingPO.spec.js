// @ts-check
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pageobjects/LoginPage');

test('Login with page object', async ({ page }) => {
  const loginpage = new LoginPage(page);
  await page.goto("https://rahulshettyacademy.com/client");
  loginpage.validLogin("anshika@gmail.com","Iamking@000");
});