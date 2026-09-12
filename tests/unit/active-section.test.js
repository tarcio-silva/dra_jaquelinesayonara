import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSectionsFixture } from '../helpers/dom-utils.js';
import { getObserverInstances, triggerIntersection } from '../mocks/intersection-observer.js';

async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Active Section Indicator', () => {
  beforeEach(async () => {
    createSectionsFixture();
    await loadMainJs();
  });

  it('cria IntersectionObserver do scroll-spy com rootMargin de detecção', () => {
    const instances = getObserverInstances();
    // O navObserver usa rootMargin com offset do topo (header+subnav) e threshold 0
    const navObserver = instances.find(i => i.options && typeof i.options.rootMargin === 'string' && i.options.rootMargin.includes('-120px'));
    expect(navObserver).toBeDefined();
    expect(navObserver.options.threshold).toBe(0);
  });

  it('observa todas as sections com id', () => {
    const instances = getObserverInstances();
    const navObserver = instances.find(i => i.options && typeof i.options.rootMargin === 'string' && i.options.rootMargin.includes('-120px'));
    const sections = document.querySelectorAll('section[id]');
    expect(navObserver.elements.size).toBe(sections.length);
  });

  it('adiciona .active ao header-link correspondente quando seção entra na viewport', () => {
    const instances = getObserverInstances();
    const navObserver = instances.find(i => i.options && typeof i.options.rootMargin === 'string' && i.options.rootMargin.includes('-120px'));

    const aboutSection = document.getElementById('about');
    triggerIntersection(instances.indexOf(navObserver), [
      { isIntersecting: true, target: aboutSection }
    ]);

    const activeLink = document.querySelector('.header-link[href="#about"]');
    expect(activeLink.classList.contains('active')).toBe(true);
  });

  it('remove .active dos outros links quando nova seção fica ativa', () => {
    const instances = getObserverInstances();
    const navObserver = instances.find(i => i.options && typeof i.options.rootMargin === 'string' && i.options.rootMargin.includes('-120px'));

    // Ativar "about"
    triggerIntersection(instances.indexOf(navObserver), [
      { isIntersecting: true, target: document.getElementById('about') }
    ]);

    // Ativar "care"
    triggerIntersection(instances.indexOf(navObserver), [
      { isIntersecting: true, target: document.getElementById('care') }
    ]);

    const aboutLink = document.querySelector('.header-link[href="#about"]');
    const careLink = document.querySelector('.header-link[href="#care"]');
    expect(aboutLink.classList.contains('active')).toBe(false);
    expect(careLink.classList.contains('active')).toBe(true);
  });

  it('não adiciona .active quando seção não está intersecting', () => {
    const instances = getObserverInstances();
    const navObserver = instances.find(i => i.options && typeof i.options.rootMargin === 'string' && i.options.rootMargin.includes('-120px'));

    triggerIntersection(instances.indexOf(navObserver), [
      { isIntersecting: false, target: document.getElementById('about') }
    ]);

    const activeLinks = document.querySelectorAll('.header-link.active');
    expect(activeLinks.length).toBe(0);
  });
});
