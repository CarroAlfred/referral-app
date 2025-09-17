import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // support path aliases
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json', // use the config above for spec files
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
export default config;
