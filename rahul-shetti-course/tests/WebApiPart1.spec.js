const { test, expect, request } = require('@playwright/test');

test.beforeAll('Login with page object', async ({ page }) => {
    const apiContext = await request.newContext();
    apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login")
});

test('Login with page object', async ({ page }) => {
    
  });