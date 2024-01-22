#Setting playwright config as traditional way
Given the reduced sample playwright config file below check out the fact that part of the file that is meant
- For setting logs (as screenshot, video, etc) are set initially hardcoded
- For reporter is seing as well hardcoded values

```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'on',
    screenshot: 'on',
  },
  //maximum time out can run for action
  timeout: 10000,
  expect:{
    //maximum time out for assertion
    timeout: 5000
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome']},
    }
  ],
});
```

#Setting values based on execution type (local or CI/pipeline)

##Playwright config tune for dynamic settings
You'll find in file below that at time of setting logs and reporters instead of hardcoded values functions are called. This is just an example more values are possible to be dynamically set and as many variations as you need. Function based on value of a variable that is expected to be load/set during pipeline execution in yml file, this will be shown at the bottom.
```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: setReporter(),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: setLogs(),
  //maximum time out can run for action
  timeout: 10000,
  expect:{
    //maximum time out for assertion
    timeout: 5000
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome']},
    }
  ],
});

function setReporter() {
  if (process.env.CI === 'true') {
    // Use at CI execution
    return [
      ['list'],
      ['html', { open: 'never' }],
      ['junit', { outputFile: './junit-results/results.xml' }],
      ]
    ];
  } else {
    // Use at local execution
    return [
      ['list'],
      ['html', { open: 'never' }],
    ];
  }
}

function setLogs() {
  if (process.env.CI === 'true') {
    // Use at CI execution
    return [
      {
        trace: 'on-first-retry',
        video: 'on-first-retry',
        screenshot: 'on'
      }
    ];
  } else {
    // Use at local execution
    return [
      {
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'off'
      }
    ];
  }
}
```


