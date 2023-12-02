const{test, expect} = require('@playwright/test'); 
const { text } = require('stream/consumers');
 
test('Go back and go forward', async ({ page }) => {
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await page.goto("https://google.com");
   await page.goBack();
   await page.goForward();
})

test('Check if element is visible', async ({ page }) => {
   //this based on style display property most likely
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await expect(page.locator("input#displayed-text")).toBeVisible();
   await page.locator("input#hide-textbox").click();
   await expect(page.locator("input#displayed-text")).toBeHidden();
})

test('Handling alerts/dialogs', async ({ page }) => {
   //this based on style display property most likely
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await page.locator("input#alertbtn").click();
   page.on("dialog", dialog => dialog.accept()); //There's no way to define the button from dialog in html dom, so is needed to use this and define which button to use in dialog
   await page.locator("input#confirmbtn").click();
   const textSecondDialog = page.on("dialog", dialog => dialog.message());
   console.log("CONSOLE LOG > " + textSecondDialog);
   page.on("dialog", dialog => dialog.dismiss());
})

test('Hover elements', async ({ page }) => {
   //this based on style display property most likely
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await page.locator("button#mousehover").hover();
   await page.locator("//a[text()='Top']").click();
})

test('Handling iframes', async ({ page }) => {
   //this based on style display property most likely
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   // id="courses-iframe"
   // name="iframe-name"
   const framesPage1 = page.frameLocator("#courses-iframe");
   const framespage2 = page.frameLocator("iframe-name");
   page.keyboard.down('End'); //Force going to bottom
   await framesPage1.locator("li a[href*='lifetime-access']:visible").click();
   const textCheck = await framesPage1.locator(".text h2").textContent();
   console.log("TEXTO ADENTRO DE IFRAME > " + textCheck);
})

test('Scrolling to bottom and top', async ({ page }) => {
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   page.keyboard.down('End'); //Force going to bottom
   page.keyboard.down('Home'); //Force going to top
})

test('Screenshot', async ({ page }) => {
   await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
   await expect(page.locator("input#displayed-text")).toBeVisible();
   await page.locator("input#displayed-text").screenshot({path: 'partialScreenshot.png'});
   await page.locator("input#hide-textbox").click();
   await page.screenshot({path: 'screenshot.png'});
   await expect(page.locator("input#displayed-text")).toBeHidden();
})

test('Visual Comparison', async ({ page }) => {
   await page.goto("https://flightaware.com");
   expect(await page.screenshot()).toMatchSnapshot("landing.png");
})




