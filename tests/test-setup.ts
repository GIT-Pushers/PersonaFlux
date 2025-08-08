/**
 * @fileoverview Test setup configuration for PersonaFlux
 * @description Global test environment configuration and utilities
 */

// Extend the global namespace to include test configuration
declare global {
  var TEST_CONFIG: {
    API_BASE_URL: string;
    API_KEY: string;
    TIMEOUT: number;
  };
}

// Global test environment setup
globalThis.TEST_CONFIG = {
  API_BASE_URL: process.env.TEST_API_URL || 'http://localhost:3000/api',
  API_KEY: process.env.TEST_API_KEY || 'test-key',
  TIMEOUT: 30000,
};

export {};