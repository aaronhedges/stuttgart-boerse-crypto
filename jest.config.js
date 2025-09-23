const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customConfig = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp)$': '<rootDir>/test/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

module.exports = createJestConfig(customConfig);
