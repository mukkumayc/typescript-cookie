/* global beforeAll, afterAll, test, expect */
const webdriver = require('selenium-webdriver')

// Input capabilities
const capabilities = {
  os: 'windows',
  os_version: '10',
  browserName: 'chrome',
  browser_version: 'latest',
  'browserstack.local': 'true',
  build: process.env.BROWSERSTACK_BUILD_NAME,
  project: process.env.BROWSERSTACK_PROJECT_NAME,
  'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER,
  'browserstack.user': process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY
}

const driver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(capabilities)
  .build()

beforeAll(async () => {
  // HTTP Server should be running on 8099 port of GitHub runner
  await driver.get('http://localhost:8099/test/browser.e2e.html')
}, 20000)

afterAll(async () => {
  await driver.quit()
})

test('test something', async () => {
  const title = await driver.getTitle()
  expect(title).toBe('BrowserStack Tests')
}, 5000)
