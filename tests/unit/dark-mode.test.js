import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDarkModeFixture } from '../helpers/dom-utils.js';

async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Dark Mode Toggle', () => {
  let desktopToggle, mobileToggle;

  beforeEach(async () => {
    localStorage.clear();
    createDarkModeFixture();
    await loadMainJs();
    desktopToggle = document.getElementById('dark-mode-button');
    mobileToggle = document.querySelector('.dark-mode-toggle-mobile');
  });

  describe('Toggle desktop', () => {
    it('adiciona .dark-theme ao body ao ativar', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(document.body.classList.contains('dark-theme')).toBe(true);
    });

    it('remove .dark-theme ao desativar', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      desktopToggle.checked = false;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(document.body.classList.contains('dark-theme')).toBe(false);
    });

    it('atualiza aria-checked para "true" quando ativo', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(desktopToggle.getAttribute('aria-checked')).toBe('true');
    });

    it('atualiza aria-checked para "false" quando inativo', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      desktopToggle.checked = false;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(desktopToggle.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('Toggle mobile', () => {
    it('adiciona .dark-theme ao body ao ativar via mobile', () => {
      mobileToggle.checked = true;
      mobileToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(document.body.classList.contains('dark-theme')).toBe(true);
    });
  });

  describe('Sincronização desktop ↔ mobile', () => {
    it('ativar desktop sincroniza o mobile toggle', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(mobileToggle.checked).toBe(true);
      expect(mobileToggle.getAttribute('aria-checked')).toBe('true');
    });

    it('ativar mobile sincroniza o desktop toggle', () => {
      mobileToggle.checked = true;
      mobileToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(desktopToggle.checked).toBe(true);
      expect(desktopToggle.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('Persistência (localStorage)', () => {
    it('salva "dark" no localStorage ao ativar', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('salva "light" no localStorage ao desativar', () => {
      desktopToggle.checked = true;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      desktopToggle.checked = false;
      desktopToggle.dispatchEvent(new Event('change', { bubbles: true }));
      expect(localStorage.getItem('theme')).toBe('light');
    });

    it('restaura dark mode ao carregar se localStorage tem "dark"', async () => {
      localStorage.setItem('theme', 'dark');
      createDarkModeFixture();
      vi.resetModules();
      await import('../../assets/js/main.js');

      expect(document.body.classList.contains('dark-theme')).toBe(true);
      const toggle = document.getElementById('dark-mode-button');
      expect(toggle.checked).toBe(true);
      expect(toggle.getAttribute('aria-checked')).toBe('true');
    });
  });
});
