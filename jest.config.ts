import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Executa mocks globais antes dos testes
  setupFiles: ['<rootDir>/tests/jest.setup.ts'],
  // Considera .ts e .tsx como módulos
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};

export default config; 