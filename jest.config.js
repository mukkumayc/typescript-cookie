/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'mjs', 'ts'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/?(*.)+(spec|test).(mj|[tj])s?(x)'],
  transform: {}
}
