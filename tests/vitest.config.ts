import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test-setup.ts'],
    testTimeout: 30000, // 30 seconds for AI response tests
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'test-setup.ts'
      ]
    },
    env: {
      NODE_ENV: 'test'
    }
  },
  resolve: {
    alias: {
      '@': new URL('../src', import.meta.url).pathname
    }
  }
});
