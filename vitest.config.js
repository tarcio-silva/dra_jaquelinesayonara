import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
    environmentOptions: {
      happyDOM: {
        settings: {
          fetch: {
            disableSameOriginPolicy: true
          },
          navigator: {
            userAgent: 'Mozilla/5.0 (test)'
          }
        }
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['assets/js/**/*.js'],
      exclude: ['node_modules/', 'tests/'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90
      }
    }
  }
});
