export default {
  verbose: true,
  preset: 'jest-puppeteer',
  maxWorkers: 8,
  testMatch: ['**/tests/*.test.js'],
  testTimeout: 120000,
  globals: {
    EXTENSION_ID: 'phbkcfcooeicpodbdbngodeejmkaeamm',
  },
};
