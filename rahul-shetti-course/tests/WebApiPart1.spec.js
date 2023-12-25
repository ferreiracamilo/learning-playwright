const { test, expect, request } = require('@playwright/test');
const loginPayload = {"userEmail":"anshika@gmail.com","userPassword":"Iamking@000"};

test.beforeAll('Login with page object', async ({ page }) => {
    const apiContext = await request.newContext();
    const loginResponse = apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: loginPayload
      });
    expect((await loginResponse).ok()).toBeTruthy();
    console.log("LoginResponse es > " + loginResponse);
    const loginResponseJson = (await loginResponse).json();
    console.log("LoginResponse es > " + loginResponseJson);
    const sessionToken = loginResponseJson.token;
    console.log("LoginResponse es > " + sessionToken);
});

test('Login with page object', async ({ page }) => {
  
});