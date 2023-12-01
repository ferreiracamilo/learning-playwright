const{test, expect} = require('@playwright/test');
const exp = require('constants');

test("First Playwright test", async ({browser}) => {
    //BROWSER AS PARAMETER TO DEFINE BROWSER SPECIFICATION COOKIES ETC
    const context = await browser.newContext(); //browser instance
    const page = await context.newPage(); //page instance

    const userName = page.locator("#username");
    const signIn = page.locator("#signInBtn");

    await page.goto("https://rahulshettyacademy.com/loginpagePractise");
    await page.locator("#username").type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await page.locator("#signInBtn").click();
    await expect(page.locator("div.alert-danger")).toContainText('Incorrect');
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    
})

test("Page Playwright test google title page", async ({page}) => {
    await page.goto("https://google.com");
    console.log("Este es mi log " + await page.title());
    await expect(page).toHaveTitle("Google");
})

test("eCommerce Practise Multiple Elements", async ({page}) => {
    const cardTitles = page.locator(".card-body a")

    await page.goto("https://rahulshettyacademy.com/angularpractice/shop");
    //Get the first element meeting the condition
    // await page.locator(".card-body a").first().textContent();
    // await page.locator(".card-body a").nth(0).textContent();

    //Get the last element meeting the condition
    // await page.locator(".card-body a").last().textContent();
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
})

test("Wait mechanisms", async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForURL("https://rahulshettyacademy.com/client/auth/login");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").type("Iamking@000");
    await page.locator("[value='Login']").click();
    
    //force to wait all the calls captured in browser dev > network > Fetch/XRR
    //await page.waitForLoadState('networkidle');
    
    //await page.locator(".card-body b").first().waitFor();
    
    //allTextContents may be flaky due not having an actual autowait
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
})

test('@Web Client App login Wait Mechanisms', async ({ page }) => {
    //js file- Login js, DashboardPage
    const email = "anshika@gmail.com";
    const productName = 'zara coat 3';
    const products = page.locator(".card-body");
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").type("Iamking@000");
    await page.locator("[value='Login']").click();
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles); 
  
 })

 test('Login with dropdown select > UI Controls > Dropdowns', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.waitForLoadState('networkidle');
    const dropdown = page.locator("#dropdown-class-example");
    // await dropdown.selectOption("option2");
    await dropdown.selectText("Option3");
    await page.pause();

    //await page.locator(".radiotextsty");
 })

 test('Login with dropdown select > UI Controls > Radio buttons', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.waitForLoadState('networkidle');
    const radioButton1 = page.locator("input[value='radio1']");
    await radioButton1.click();
    await expect(radioButton1).toBeChecked();
    const radioButton2 = page.locator("input[value='radio2']");
    await radioButton2.click();
    await expect(radioButton2).toBeChecked();
    await expect(radioButton1).not.toBeChecked();
 })

 test('Login with dropdown select > UI Controls > Checkbox', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.waitForLoadState('networkidle');
    const checkBox1 = page.locator("#checkBoxOption1");
    await checkBox1.click();
    await expect(checkBox1).toBeChecked();
    await checkBox1.click();
    await expect(checkBox1).not.toBeChecked;
 })

 test('Check attribute value', async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.waitForLoadState('networkidle');
    const docuLink = page.locator("[href*='documents-request']");
    await expect(docuLink).toHaveAttribute("class","blinkingText");
    
    const inputMultiClass = page.locator("input#autocomplete");
    await expect(inputMultiClass).toHaveClass("inputs ui-autocomplete-input");
    await expect(inputMultiClass).toHaveAttribute("class","inputs ui-autocomplete-input");
    //If multiple classes are encountered the only way to check an individual class is the way below
    expect (await inputMultiClass.getAttribute("class")).toContain("inputs");
 })


test('Child windows handling', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    await page.waitForLoadState('networkidle');
    const docuLink = page.locator("[href*='documents-request']");
    
    const [newPage] = await Promise.all([
        //PROMISE ALL await
        //wait for a new page and for clicking the button to trigger the new page
        context.waitForEvent('page'),
        docuLink.click()
    ]);
    await newPage.waitForLoadState('networkidle');
    const textD = await newPage.locator("p.red").textContent();
    const arrayText = textD.split("@");
    const domain = arrayText[1].split("") [0];
    console.log("TOTAL TEXT AT LOCATOR > "+ textD);
    console.log("DOMAIN: " + domain);
})


test('NO TEST Console terminal commands', async ({ page }) => {
    // npx playwright test tests/UIBasicstests.spec.js --debug
    // npx playwright test tests/UIBasicstests.spec.js
 })


 test('NO TEST Options for playwright config js', async ({ page }) => {
    // In order to enforce screenshot on every step add into playwright.config.js
    // at USE:  screenshot: 'on'

    // In order to enable trace logs
    // at USE: trace: 'on'

    //If traces are enabled the test result page will provide traces file
    //This file can be checked via trace.playwright.dev

 })




