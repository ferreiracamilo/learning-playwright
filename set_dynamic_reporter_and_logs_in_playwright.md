# Setting playwright config as traditional way
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

# Setting values based on execution type (local or CI/pipeline)

## Playwright config tune for dynamic settings
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

## File to set pipeline (on my case I applied it to an Azure Pipeline)
Below you'll see a brief explanation of what this yml is doing at time of pipeline execution
1. TAG Parameter is created to later tag the build.
  1. Let's say know beforehand execution is expected after main branch changes but as well from external execution. For external execution I refer a dev team using a POST request to execute our automation testing solution, so we give them the possibility to place a tag to the build which is going to provide easy and simple visibility of the reason of the execution. E.g. dev team is executing our automation due to "TICKET 344 - Add button to forward email", this will be displayed at top of the build in Azure
2. main branch is triggered
3. "computer"(image) so is stated
4. Internal variables are set
  1. Build TAG is set/assigned which was previously received declared
  2. CI variable is enforced to TRUE so our expected settings for pipeline execution are in place
5. Checkout done over main branch which was previously selected
6. script is executed
  1. 'npm install' is done so Playwright and any other dependencies are installed
  2. 'npx playwright install chromium' on this case we are only using one browser at CI execution, so it is the only one installed
  3.  'npx playwright test --project=chromium --retries=1' test, browser and retry expected are defined
7. script is executed
  1. If tag is empty -as expected for main branch update from automation testing team behalf- is default to "repository-update"
  2. Otherwise TAG is loaded with the value received e.g. received from POST request
8. Publish artifact to attach test-results (images, videos, trace) into build. That means anyone with access to build without having NodeJS, Playwright, etc on their computer are able to see result attachments
9. Publish artifact to attach HTML report. As previous case team without any configuration done in their PCs are able to see the actual result of the test cases
10. Populate 

```yml
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

### Image samples to showoff result
![image](https://github.com/ferreiracamilo/learning-playwright/assets/6466791/0afd045e-acba-4ed0-86e2-103b47d882f7)
![image](https://github.com/ferreiracamilo/learning-playwright/assets/6466791/1fb055f1-986b-4d54-bd73-9ae876740d8d)



