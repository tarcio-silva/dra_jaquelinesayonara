import { vi } from 'vitest';

let mediaQueryState = {};

export function mockMatchMedia(overrides = {}) {
  mediaQueryState = {
    '(prefers-reduced-motion: reduce)': false,
    ...overrides
  };

  window.matchMedia = vi.fn((query) => ({
    matches: mediaQueryState[query] || false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

export function setMediaQuery(query, matches) {
  mediaQueryState[query] = matches;
}
