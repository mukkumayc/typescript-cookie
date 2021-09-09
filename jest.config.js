/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
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
