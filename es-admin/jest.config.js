export default {
  verbose: true,
  preset: 'jest-puppeteer',
  maxWorkers: 1,
  testMatch: ['**/tests/*.test.js'],
  testTimeout: 1000,
  globals: {
    EXTENSION_ID: 'phbkcfcooeicpodbdbngodeejmkaeamm',
  },
};
