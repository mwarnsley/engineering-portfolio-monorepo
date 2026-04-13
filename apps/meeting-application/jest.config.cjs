const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  clearMocks: true,
  collectCoverageFrom: [
    'app/**/*.js',
    'components/**/*.jsx',
    'lib/**/*.js',
    'models/**/*.js',
    '!app/globals.css',
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  setupFiles: ['<rootDir>/tests/setup/jest.env.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
};

module.exports = createJestConfig(customJestConfig);
