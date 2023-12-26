const { test, expect, request } = require('@playwright/test');
const loginPayload = {"userEmail":"anshika@gmail.com","userPassword":"Iamking@000"};
let sessionToken;



test.beforeAll('Login with page object', async () => {
  const apiContext = await request.newContext();
  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: loginPayload
    }
  );
  expect(loginResponse.ok()).toBeTruthy();
  const loginResponseJson = await loginResponse.json();
  sessionToken = loginResponseJson.token;
});

test('Login with page object', async ({ page }) => {
  page.addInitScript(value => {
    window.localStorage.setItem("token", value);
  }, sessionToken);
  await page.goto("https://rahulshettyacademy.com/client/");
  await page.getByText("ORDERS").isVisible();
});