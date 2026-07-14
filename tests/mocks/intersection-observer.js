import { vi } from 'vitest';

let observerInstances = [];

export function mockIntersectionObserver() {
  observerInstances = [];

  const MockIntersectionObserver = vi.fn((callback, options) => {
    const instance = {
      callback,
      options,
      elements: new Set(),
      observe: vi.fn((el) => instance.elements.add(el)),
      unobserve: vi.fn((el) => instance.elements.delete(el)),
      disconnect: vi.fn(() => instance.elements.clear()),
    };
    observerInstances.push(instance);
    return instance;
  });

  window.IntersectionObserver = MockIntersectionObserver;
  return MockIntersectionObserver;
}

/**
 * Simula uma intersecção para um observer específico.
 * @param {number} observerIndex - Índice do observer (ordem de criação)
 * @param {Array} entries - Array de entry objects ({ isIntersecting, target })
 */
export function triggerIntersection(observerIndex, entries) {
  const instance = observerInstances[observerIndex];
  if (instance) {
    instance.callback(entries, instance);
  }
}

export function getObserverInstances() {
  return observerInstances;
}

export function getLastObserverInstance() {
  return observerInstances[observerInstances.length - 1];
}
