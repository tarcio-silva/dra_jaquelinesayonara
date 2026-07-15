import { beforeEach, afterEach, vi } from 'vitest';
import { mockIntersectionObserver } from './mocks/intersection-observer.js';
import { mockMatchMedia } from './mocks/match-media.js';

// Suprimir erros de rede (happy-dom tenta fazer fetch de recursos do HTML)
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('ECONNREFUSED') || msg.includes('AbortError')) return;
    originalConsoleError(...args);
  };
  // Suprimir unhandled promise rejections de fetch
  process.on('unhandledRejection', (reason) => {
    if (reason?.code === 'ECONNREFUSED' || reason?.name === 'AbortError') return;
    throw reason;
  });
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Mock global do IntersectionObserver e matchMedia antes de cada teste
beforeEach(() => {
  mockIntersectionObserver();
  mockMatchMedia();
});

// Limpar DOM e mocks após cada teste
afterEach(() => {
  document.body.innerHTML = '';
  document.body.className = '';
  document.head.innerHTML = '';
  vi.restoreAllMocks();
});
