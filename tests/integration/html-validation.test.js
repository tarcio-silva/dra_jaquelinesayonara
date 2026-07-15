import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Validação HTML — index.html', () => {
  let doc;

  beforeAll(() => {
    const html = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8');
    // Usar DOMParser do happy-dom (disponível via globals)
    const parser = new DOMParser();
    doc = parser.parseFromString(html, 'text/html');
  });

  describe('Acessibilidade', () => {
    it('skip link presente e aponta para #main-content', () => {
      const skipLink = doc.querySelector('a.skip-link');
      expect(skipLink).not.toBeNull();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('#main-content existe como destino do skip link', () => {
      const main = doc.getElementById('main-content');
      expect(main).not.toBeNull();
    });

    it('apenas um H1 na página', () => {
      const h1s = doc.querySelectorAll('h1');
      expect(h1s.length).toBe(1);
    });

    it('todas as imagens possuem atributo alt', () => {
      const images = doc.querySelectorAll('img');
      const semAlt = Array.from(images).filter(img => !img.hasAttribute('alt'));
      expect(semAlt).toHaveLength(0);
    });

    it('links target="_blank" possuem rel="noopener noreferrer"', () => {
      const externalLinks = doc.querySelectorAll('a[target="_blank"]');
      expect(externalLinks.length).toBeGreaterThan(0);

      externalLinks.forEach(link => {
        const rel = link.getAttribute('rel') || '';
        expect(rel).toContain('noopener');
        expect(rel).toContain('noreferrer');
      });
    });

    it('hamburger tem aria-expanded e aria-controls', () => {
      const hamburger = doc.getElementById('hamburger-button');
      expect(hamburger).not.toBeNull();
      expect(hamburger.hasAttribute('aria-expanded')).toBe(true);
      expect(hamburger.getAttribute('aria-controls')).toBe('offcanva');
    });

    it('offcanva tem aria-hidden e role="navigation"', () => {
      const offcanva = doc.getElementById('offcanva');
      expect(offcanva).not.toBeNull();
      expect(offcanva.hasAttribute('aria-hidden')).toBe(true);
      expect(offcanva.getAttribute('role')).toBe('navigation');
    });

    it('lightbox tem role="dialog" e aria-modal="true"', () => {
      const lightbox = doc.getElementById('lightbox');
      expect(lightbox).not.toBeNull();
      expect(lightbox.getAttribute('role')).toBe('dialog');
      expect(lightbox.getAttribute('aria-modal')).toBe('true');
    });

    it('dark mode toggles têm role="switch" e aria-checked', () => {
      const desktopToggle = doc.getElementById('dark-mode-button');
      const mobileToggle = doc.querySelector('.dark-mode-toggle-mobile');

      expect(desktopToggle.getAttribute('role')).toBe('switch');
      expect(desktopToggle.hasAttribute('aria-checked')).toBe(true);
      expect(mobileToggle.getAttribute('role')).toBe('switch');
      expect(mobileToggle.hasAttribute('aria-checked')).toBe(true);
    });

    it('result-items têm role="button" e tabindex="0"', () => {
      const items = doc.querySelectorAll('.result-item');
      expect(items.length).toBeGreaterThan(0);

      items.forEach(item => {
        expect(item.getAttribute('role')).toBe('button');
        expect(item.getAttribute('tabindex')).toBe('0');
      });
    });
  });

  describe('Estrutura semântica', () => {
    it('possui elemento <main>', () => {
      expect(doc.querySelector('main')).not.toBeNull();
    });

    it('possui elemento <header>', () => {
      expect(doc.querySelector('header')).not.toBeNull();
    });

    it('possui elemento <footer>', () => {
      expect(doc.querySelector('footer')).not.toBeNull();
    });

    it('seções com IDs esperados existem', () => {
      const expectedIds = ['about', 'care', 'results', 'plans', 'location'];
      expectedIds.forEach(id => {
        expect(doc.getElementById(id)).not.toBeNull();
      });
    });
  });
});
