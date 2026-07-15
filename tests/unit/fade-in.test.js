import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSectionsFixture } from '../helpers/dom-utils.js';
import { getObserverInstances, triggerIntersection } from '../mocks/intersection-observer.js';

async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Fade-in on Scroll', () => {
  beforeEach(async () => {
    createSectionsFixture();
    await loadMainJs();
  });

  it('cria IntersectionObserver com threshold 0.05', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    expect(fadeObserver).toBeDefined();
  });

  it('observa todos os elementos .fade-in', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    const fadeEls = document.querySelectorAll('.fade-in');
    expect(fadeObserver.elements.size).toBe(fadeEls.length);
  });

  it('adiciona .visible quando elemento está intersecting', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    const fadeEl = document.querySelector('.fade-in');

    triggerIntersection(instances.indexOf(fadeObserver), [
      { isIntersecting: true, target: fadeEl }
    ]);

    expect(fadeEl.classList.contains('visible')).toBe(true);
  });

  it('chama unobserve após trigger (um-shot)', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    const fadeEl = document.querySelector('.fade-in');

    triggerIntersection(instances.indexOf(fadeObserver), [
      { isIntersecting: true, target: fadeEl }
    ]);

    expect(fadeObserver.unobserve).toHaveBeenCalledWith(fadeEl);
  });

  it('não adiciona .visible quando não está intersecting', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    const fadeEl = document.querySelector('.fade-in');

    triggerIntersection(instances.indexOf(fadeObserver), [
      { isIntersecting: false, target: fadeEl }
    ]);

    expect(fadeEl.classList.contains('visible')).toBe(false);
  });

  it('não chama unobserve quando não intersecting', () => {
    const instances = getObserverInstances();
    const fadeObserver = instances.find(i => i.options && i.options.threshold === 0.05);
    const fadeEl = document.querySelector('.fade-in');

    triggerIntersection(instances.indexOf(fadeObserver), [
      { isIntersecting: false, target: fadeEl }
    ]);

    expect(fadeObserver.unobserve).not.toHaveBeenCalled();
  });
});
