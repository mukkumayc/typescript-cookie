import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://example.org/test' // So we can test setting cookies at the /test path..
  },
  testMatch: ['**/?(*.)+(spec|test).(mj|[tj])s?(x)'],
  transform: {}
}

export default config
