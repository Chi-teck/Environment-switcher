export default {
  verbose: true,
  preset: 'jest-puppeteer',
  maxWorkers: 8,
  testMatch: ['**/tests/*.test.js'],
  testTimeout: 5_000,
  globals: {
    EXTENSION_ID: 'phbkcfcooeicpodbdbngodeejmkaeamm',
  },
};
