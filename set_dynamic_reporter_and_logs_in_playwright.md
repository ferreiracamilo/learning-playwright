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

##File to set pipeline (on my case I applied it to an Azure Pipeline)

```yml
# Starter pipeline
# Start with a minimal pipeline that you can customize to build and deploy your code.
# Add steps that build, run tests, deploy, and more:
# https://aka.ms/yaml

parameters:
- name: TAGS
  type: string
  default: ''

trigger:
- main

pool:
  vmImage: ubuntu-latest

variables:
  TAGS: ${{ parameters.TAGS }}
  CI: "true"

steps:
- checkout: self
  displayName: 'Checkout Repo'

- script: |
    echo " "
    echo "######################"
    echo "### Install NodeJS ###"
    echo "######################"
    echo " "
    npm install
    echo " "
    echo "##########################"
    echo "### Install Playwright ###"
    echo "##########################"
    echo " "
    npx playwright install chromium
    echo " "
    echo "##########################################################################################"
    echo "### Execute test cases only with chromium up to 1 retry and list test cases executions ###"
    echo "##########################################################################################"
    echo " "
    npx playwright test --project=chromium --retries=1
  displayName: 'Execute Playwright test cases'

- script: |
    echo "TAGS before: $(TAGS)"
    if [ -z "${TAGS}" ]; then
      echo "TAGS is empty. Setting default value."
      TAGS="repository-update"
    fi
    echo "TAGS after: $(TAGS)"
    echo "##vso[build.addbuildtag]${TAGS}"
  displayName: 'Set Build Tag'

- task: PublishBuildArtifacts@1
  condition: succeededOrFailed()
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/test-results'
    ArtifactName: 'Playwright Trace log files, attachment and videos -if applicable-'
  displayName: 'Publish Test Results Attachments'

- task: PublishBuildArtifacts@1
  condition: succeededOrFailed()
  inputs:
    PathtoPublish: '$(System.DefaultWorkingDirectory)/playwright-report/index.html'
    ArtifactName: 'Playwright HTML Report'
  displayName: 'Publish Playwright HTML Report'

- task: PublishTestResults@2
  condition: succeededOrFailed()
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: '$(System.DefaultWorkingDirectory)/junit-results/results.xml'
    failTaskOnFailedTests: true
    testRunTitle: 'Salesforce Playwright Automation'
  displayName: 'Output JUnit XML Test Results'
```


