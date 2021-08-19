/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'https://example.org/test'
  },
  testMatch: ['**/?(*.)+(spec|test).(mj|[tj])s?(x)'],
  transform: {}
}
