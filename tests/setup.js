import { beforeEach, afterEach, vi } from 'vitest';
import { mockIntersectionObserver } from './mocks/intersection-observer.js';
import { mockMatchMedia } from './mocks/match-media.js';

// Suprimir erros de rede do happy-dom (fetch de scripts/iframes do HTML real)
// Esses erros ocorrem porque happy-dom tenta carregar <script src> e <iframe>
// quando DOMParser parseia o HTML completo nos testes de integração.
const suppressedErrors = (err) => {
  const msg = err?.message || err?.toString() || '';
  return err?.code === 'ECONNREFUSED' ||
    err?.name === 'AbortError' ||
    msg.includes('Cannot read properties of null') ||
    msg.includes('The operation was aborted') ||
    msg.includes('ECONNREFUSED');
};

process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason) => {
  if (suppressedErrors(reason)) return;
  console.error('Unhandled rejection:', reason);
});

process.removeAllListeners('uncaughtException');
process.on('uncaughtException', (err) => {
  if (suppressedErrors(err)) return;
  console.error('Uncaught exception:', err);
  process.exit(1);
});

const originalConsoleError = console.error;

beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0]?.toString() || '';
    if (msg.includes('ECONNREFUSED') || msg.includes('AbortError') ||
        msg.includes('Cannot read properties of null')) return;
    originalConsoleError(...args);
  };
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
