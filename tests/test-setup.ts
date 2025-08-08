/**
 * @fileoverview Test Setup Configuration
 * @description Global test setup for PersonaFlux AI evaluation suite
 */

// Global test environment setup
globalThis.TEST_CONFIG = {
  API_BASE_URL: process.env.TEST_API_URL || 'http://localhost:3000/api',
  API_KEY: process.env.TEST_API_KEY || 'test-key',
  TIMEOUT: 30000,
  MAX_RETRIES: 3
};

// Mock fetch for testing environments that don't have it
if (!globalThis.fetch) {
  const { default: fetch } = await import('cross-fetch');
  globalThis.fetch = fetch;
}

// Set up test performance tracking
globalThis.performance = globalThis.performance || {
  now: () => Date.now()
};

// Global test utilities
globalThis.testUtils = {
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  
  generateTestId: () => `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  expectWithinRange: (value: number, expected: number, tolerance: number) => {
    const min = expected - tolerance;
    const max = expected + tolerance;
    if (value < min || value > max) {
      throw new Error(`Expected ${value} to be within ${tolerance} of ${expected}`);
    }
  },
  
  retryAsync: async <T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await globalThis.testUtils.delay(delay);
        return globalThis.testUtils.retryAsync(fn, retries - 1, delay);
      }
      throw error;
    }
  }
};

// Console setup for test environment
if (process.env.NODE_ENV === 'test') {
  console.log('PersonaFlux Test Environment Initialized');
  console.log(`API Base URL: ${globalThis.TEST_CONFIG.API_BASE_URL}`);
  console.log(`Test Timeout: ${globalThis.TEST_CONFIG.TIMEOUT}ms`);
}

export {};
