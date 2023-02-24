import { defineConfig, devices } from '@playwright/test'

const port = 8099
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testMatch: /.*e2e.*/,
  use: {
    baseURL,
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: `npx -y http-server -p ${port}`,
    url: baseURL,
    timeout: 120 * 1000
  },
  timeout: 10 * 1000,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'edge',
      use: { channel: 'msedge' }
    }
  ]
})
