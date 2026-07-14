import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMenuFixture } from '../helpers/dom-utils.js';
import { pressEscape } from '../helpers/keyboard-events.js';

/**
 * O main.js executa no escopo global, então precisamos:
 * 1. Montar o DOM (fixture)
 * 2. Importar o script (execução dos event listeners)
 * 
 * Usamos vi.resetModules() + import() dinâmico para re-executar o main.js a cada teste.
 */
async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Menu Offcanva', () => {
  let hamburger, offcanva;

  beforeEach(async () => {
    createMenuFixture();
    await loadMainJs();
    hamburger = document.getElementById('hamburger-button');
    offcanva = document.getElementById('offcanva');
  });

  describe('toggleNav() — abrir', () => {
    it('adiciona .is-active ao hamburger ao clicar', () => {
      hamburger.click();
      expect(hamburger.classList.contains('is-active')).toBe(true);
    });

    it('define aria-expanded="true" no hamburger', () => {
      hamburger.click();
      expect(hamburger.getAttribute('aria-expanded')).toBe('true');
    });

    it('define aria-hidden="false" no offcanva', () => {
      hamburger.click();
      expect(offcanva.getAttribute('aria-hidden')).toBe('false');
    });

    it('move offcanva para left: 0', () => {
      hamburger.click();
      expect(offcanva.style.left).toBe('0px');
    });

    it('bloqueia scroll do body', () => {
      hamburger.click();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('move foco para o primeiro link do offcanva', () => {
      hamburger.click();
      const firstLink = offcanva.querySelector('a');
      expect(document.activeElement).toBe(firstLink);
    });
  });

  describe('toggleNav() — fechar', () => {
    it('remove .is-active ao clicar novamente', () => {
      hamburger.click(); // abrir
      hamburger.click(); // fechar
      expect(hamburger.classList.contains('is-active')).toBe(false);
    });

    it('define aria-expanded="false"', () => {
      hamburger.click();
      hamburger.click();
      expect(hamburger.getAttribute('aria-expanded')).toBe('false');
    });

    it('define aria-hidden="true"', () => {
      hamburger.click();
      hamburger.click();
      expect(offcanva.getAttribute('aria-hidden')).toBe('true');
    });

    it('restaura left: -120%', () => {
      hamburger.click();
      hamburger.click();
      expect(offcanva.style.left).toBe('-120%');
    });

    it('restaura scroll do body', () => {
      hamburger.click();
      hamburger.click();
      expect(document.body.style.overflow).toBe('');
    });

    it('retorna foco para o hamburger', () => {
      hamburger.click();
      hamburger.click();
      expect(document.activeElement).toBe(hamburger);
    });
  });

  describe('Fechar com Escape', () => {
    it('Escape fecha o menu quando aberto', () => {
      hamburger.click();
      pressEscape(document);
      expect(hamburger.classList.contains('is-active')).toBe(false);
    });

    it('Escape não faz nada quando menu está fechado', () => {
      pressEscape(document);
      expect(hamburger.classList.contains('is-active')).toBe(false);
      expect(offcanva.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Fechar via nav links', () => {
    it('clicar em nav link fecha o menu', () => {
      hamburger.click();
      const navLink = offcanva.querySelector('.offcanva-nav--link');
      navLink.click();
      expect(hamburger.classList.contains('is-active')).toBe(false);
    });
  });

  describe('Focus Trap', () => {
    it('Tab no último focusable volta para o primeiro', () => {
      hamburger.click();
      const focusables = offcanva.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
      const last = focusables[focusables.length - 1];
      last.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      offcanva.dispatchEvent(event);

      // O focus trap previne o default e foca o primeiro
      // Nota: happy-dom pode não simular focus perfeitamente
      // mas o event listener deve ser chamado
      expect(event.defaultPrevented || document.activeElement === focusables[0]).toBe(true);
    });

    it('Shift+Tab no primeiro focusable volta para o último', () => {
      hamburger.click();
      const focusables = offcanva.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      first.focus();

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
      offcanva.dispatchEvent(event);

      expect(event.defaultPrevented || document.activeElement === focusables[focusables.length - 1]).toBe(true);
    });
  });
});
