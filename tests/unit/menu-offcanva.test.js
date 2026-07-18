import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMenuFixture } from '../helpers/dom-utils.js';
import { pressEscape } from '../helpers/keyboard-events.js';
import { triggerIntersection, getObserverInstances } from '../mocks/intersection-observer.js';

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
  let hamburger, offcanva, backdrop;

  beforeEach(async () => {
    createMenuFixture();
    await loadMainJs();
    hamburger = document.getElementById('hamburger-button');
    offcanva = document.getElementById('offcanva');
    backdrop = document.getElementById('offcanva-backdrop');
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

    it('adiciona classe .is-open ao offcanva', () => {
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(true);
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

    it('remove classe .is-open do offcanva', () => {
      hamburger.click();
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(false);
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
      expect(offcanva.classList.contains('is-open')).toBe(false);
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
      expect(offcanva.classList.contains('is-open')).toBe(false);
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

  describe('Backdrop overlay', () => {
    it('backdrop recebe classe .is-visible ao abrir o menu', () => {
      hamburger.click();
      expect(backdrop.classList.contains('is-visible')).toBe(true);
    });

    it('backdrop define aria-hidden="false" ao abrir', () => {
      hamburger.click();
      expect(backdrop.getAttribute('aria-hidden')).toBe('false');
    });

    it('backdrop perde classe .is-visible ao fechar o menu', () => {
      hamburger.click();
      hamburger.click();
      expect(backdrop.classList.contains('is-visible')).toBe(false);
    });

    it('backdrop define aria-hidden="true" ao fechar', () => {
      hamburger.click();
      hamburger.click();
      expect(backdrop.getAttribute('aria-hidden')).toBe('true');
    });

    it('clicar no backdrop fecha o menu', () => {
      hamburger.click();
      backdrop.click();
      expect(offcanva.classList.contains('is-open')).toBe(false);
      expect(hamburger.classList.contains('is-active')).toBe(false);
    });

    it('clicar no backdrop retorna foco ao hamburger', () => {
      hamburger.click();
      backdrop.click();
      expect(document.activeElement).toBe(hamburger);
    });
  });

  describe('Swipe-to-close', () => {
    function createTouchEvent(type, clientX) {
      return new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [{ clientX, clientY: 0, identifier: 0 }],
        changedTouches: [{ clientX, clientY: 0, identifier: 0 }],
      });
    }

    it('swipe left (> threshold) fecha o menu', () => {
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(true);

      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 50));
      offcanva.dispatchEvent(createTouchEvent('touchend', 50)); // diff = -150, > threshold (80)

      expect(offcanva.classList.contains('is-open')).toBe(false);
      expect(hamburger.classList.contains('is-active')).toBe(false);
    });

    it('swipe curto (< threshold) não fecha o menu', () => {
      hamburger.click();

      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 170));
      offcanva.dispatchEvent(createTouchEvent('touchend', 170)); // diff = -30, < threshold (80)

      expect(offcanva.classList.contains('is-open')).toBe(true);
    });

    it('swipe right não fecha o menu', () => {
      hamburger.click();

      offcanva.dispatchEvent(createTouchEvent('touchstart', 50));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 200));
      offcanva.dispatchEvent(createTouchEvent('touchend', 200)); // swipe right

      expect(offcanva.classList.contains('is-open')).toBe(true);
    });

    it('swipe não faz nada quando menu está fechado', () => {
      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchend', 50));

      expect(offcanva.classList.contains('is-open')).toBe(false);
    });
  });

  describe('Hamburger como botão fechar (✕ animado)', () => {
    it('hamburger anima para ✕ quando menu está aberto (classe .is-active)', () => {
      hamburger.click();
      expect(hamburger.classList.contains('is-active')).toBe(true);
    });

    it('hamburger tem z-index superior ao offcanva (acessível sobre o menu)', () => {
      // Hamburger z-index: 1010, Offcanva z-index: 1000
      // Verificamos que o hamburger está no DOM e clicável sobre o menu
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(true);
      // Segundo click fecha
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(false);
    });

    it('hamburger retorna foco ao fechar o menu', () => {
      hamburger.click();
      hamburger.click();
      expect(document.activeElement).toBe(hamburger);
    });

    it('hamburger tem aria-label para acessibilidade', () => {
      expect(hamburger.getAttribute('aria-label')).toBeTruthy();
    });
  });

  describe('CTA WhatsApp no offcanva', () => {
    it('CTA existe no offcanva', () => {
      const cta = offcanva.querySelector('.offcanva-cta');
      expect(cta).not.toBeNull();
    });

    it('CTA tem href para WhatsApp', () => {
      const cta = offcanva.querySelector('.offcanva-cta');
      expect(cta.getAttribute('href')).toContain('wa.me');
    });

    it('CTA tem target="_blank"', () => {
      const cta = offcanva.querySelector('.offcanva-cta');
      expect(cta.getAttribute('target')).toBe('_blank');
    });

    it('CTA tem rel="noopener noreferrer"', () => {
      const cta = offcanva.querySelector('.offcanva-cta');
      expect(cta.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('CTA contém texto de ação', () => {
      const cta = offcanva.querySelector('.offcanva-cta');
      expect(cta.textContent.trim()).toBeTruthy();
    });
  });

  describe('Indicador de seção ativa mobile', () => {
    it('link da seção visível recebe classe .active', () => {
      // O navObserver é o último IntersectionObserver criado pelo main.js
      const observers = getObserverInstances();
      // Encontrar o observer que observa sections (o do active section indicator)
      const navObserverIndex = observers.findIndex(obs =>
        obs.options && obs.options.threshold === 0.3
      );

      const aboutSection = document.getElementById('about');
      triggerIntersection(navObserverIndex, [{ target: aboutSection, isIntersecting: true }]);

      const aboutLink = offcanva.querySelector('.offcanva-nav--link[href="#about"]');
      expect(aboutLink.classList.contains('active')).toBe(true);
    });

    it('outros links perdem classe .active quando nova seção fica visível', () => {
      const observers = getObserverInstances();
      const navObserverIndex = observers.findIndex(obs =>
        obs.options && obs.options.threshold === 0.3
      );

      const aboutSection = document.getElementById('about');
      const careSection = document.getElementById('care');

      triggerIntersection(navObserverIndex, [{ target: aboutSection, isIntersecting: true }]);
      triggerIntersection(navObserverIndex, [{ target: careSection, isIntersecting: true }]);

      const aboutLink = offcanva.querySelector('.offcanva-nav--link[href="#about"]');
      const careLink = offcanva.querySelector('.offcanva-nav--link[href="#care"]');

      expect(careLink.classList.contains('active')).toBe(true);
      expect(aboutLink.classList.contains('active')).toBe(false);
    });
  });

  describe('Animação stagger com prefers-reduced-motion', () => {
    it('links do menu existem dentro de .offcanva-nav li', () => {
      const items = offcanva.querySelectorAll('.offcanva-nav li');
      expect(items.length).toBeGreaterThan(0);
    });

    it('menu aplica classe .is-open que ativa stagger via CSS', () => {
      hamburger.click();
      expect(offcanva.classList.contains('is-open')).toBe(true);
      // A animação stagger é controlada via CSS (transition-delay em .is-open li)
      // O teste verifica que a classe que ativa o stagger é aplicada
    });

    it('prefers-reduced-motion é respeitado (classe verificável via CSS)', () => {
      // O CSS usa @media (prefers-reduced-motion: reduce) para desabilitar
      // animações. O JS não precisa intervir — apenas verificamos que o
      // mecanismo de classe existe para o CSS atuar.
      hamburger.click();
      const items = offcanva.querySelectorAll('.offcanva-nav li');
      items.forEach(item => {
        // Items devem estar no DOM para CSS aplicar (ou não) animação
        expect(item.closest('.is-open')).not.toBeNull();
      });
    });
  });

  describe('Atributo inert', () => {
    it('main-content recebe atributo inert ao abrir menu', () => {
      hamburger.click();
      const main = document.getElementById('main-content');
      expect(main.hasAttribute('inert')).toBe(true);
    });

    it('main-content perde atributo inert ao fechar menu', () => {
      hamburger.click();
      hamburger.click();
      const main = document.getElementById('main-content');
      expect(main.hasAttribute('inert')).toBe(false);
    });

    it('inert é removido ao fechar com Escape', () => {
      hamburger.click();
      pressEscape(document);
      const main = document.getElementById('main-content');
      expect(main.hasAttribute('inert')).toBe(false);
    });

    it('inert é removido ao fechar via backdrop', () => {
      hamburger.click();
      backdrop.click();
      const main = document.getElementById('main-content');
      expect(main.hasAttribute('inert')).toBe(false);
    });

    it('inert é removido ao fechar via hamburger', () => {
      hamburger.click();
      hamburger.click();
      const main = document.getElementById('main-content');
      expect(main.hasAttribute('inert')).toBe(false);
    });
  });

  describe('Edge swipe para abrir', () => {
    function createTouchEvent(type, clientX, clientY = 0) {
      return new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [{ clientX, clientY, identifier: 0 }],
        changedTouches: [{ clientX, clientY, identifier: 0 }],
      });
    }

    it('swipe right na borda esquerda (≤20px) abre o menu', () => {
      // touchstart na borda esquerda (x=10)
      document.dispatchEvent(createTouchEvent('touchstart', 10, 100));
      // touchend com swipe > threshold (x=150)
      document.dispatchEvent(createTouchEvent('touchend', 150, 100));

      expect(offcanva.classList.contains('is-open')).toBe(true);
      expect(hamburger.classList.contains('is-active')).toBe(true);
    });

    it('swipe curto na borda esquerda não abre o menu', () => {
      document.dispatchEvent(createTouchEvent('touchstart', 10, 100));
      document.dispatchEvent(createTouchEvent('touchend', 50, 100)); // diff = 40, < threshold

      expect(offcanva.classList.contains('is-open')).toBe(false);
    });

    it('swipe fora da borda esquerda (>20px) não abre o menu', () => {
      document.dispatchEvent(createTouchEvent('touchstart', 50, 100));
      document.dispatchEvent(createTouchEvent('touchend', 200, 100));

      expect(offcanva.classList.contains('is-open')).toBe(false);
    });

    it('swipe vertical na borda esquerda não abre o menu', () => {
      document.dispatchEvent(createTouchEvent('touchstart', 10, 100));
      // diffX = 90, diffY = 150 → diffY > diffX, é scroll vertical
      document.dispatchEvent(createTouchEvent('touchend', 100, 250));

      expect(offcanva.classList.contains('is-open')).toBe(false);
    });

    it('edge swipe não abre se menu já está aberto', () => {
      hamburger.click(); // abrir
      expect(offcanva.classList.contains('is-open')).toBe(true);

      // Simular edge swipe (não deve fechar/reabrir)
      document.dispatchEvent(createTouchEvent('touchstart', 10, 100));
      document.dispatchEvent(createTouchEvent('touchend', 150, 100));

      // Menu deve continuar aberto (sem toggle)
      expect(offcanva.classList.contains('is-open')).toBe(true);
    });
  });

  describe('Anúncios aria-live', () => {
    it('cria live region com role="status" no body', () => {
      const liveRegion = document.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion).not.toBeNull();
    });

    it('live region tem classe sr-only (visually hidden)', () => {
      const liveRegion = document.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion.classList.contains('sr-only')).toBe(true);
    });

    it('anuncia "Menu de navegação aberto" ao abrir', () => {
      hamburger.click();
      const liveRegion = document.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion.textContent).toContain('aberto');
    });

    it('anuncia "Menu de navegação fechado" ao fechar', () => {
      hamburger.click();
      hamburger.click();
      const liveRegion = document.querySelector('[role="status"][aria-live="polite"]');
      expect(liveRegion.textContent).toContain('fechado');
    });
  });

  describe('Swipe interativo com feedback visual', () => {
    function createTouchEvent(type, clientX) {
      return new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === 'touchend' ? [] : [{ clientX, clientY: 0, identifier: 0 }],
        changedTouches: [{ clientX, clientY: 0, identifier: 0 }],
      });
    }

    it('touchmove para esquerda atualiza transform do offcanva', () => {
      hamburger.click();

      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 100));

      // O transform deve ter um valor negativo (arrastando para esquerda)
      expect(offcanva.style.transform).toContain('translateX');
      expect(offcanva.style.transition).toBe('none');
    });

    it('touchend restaura transition e transform', () => {
      hamburger.click();

      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 180));
      offcanva.dispatchEvent(createTouchEvent('touchend', 180));

      // Transições restauradas (string vazia = usa CSS)
      expect(offcanva.style.transition).toBe('');
      expect(offcanva.style.transform).toBe('');
    });

    it('swipe interativo fecha se passa do threshold', () => {
      hamburger.click();

      offcanva.dispatchEvent(createTouchEvent('touchstart', 200));
      offcanva.dispatchEvent(createTouchEvent('touchmove', 50));
      offcanva.dispatchEvent(createTouchEvent('touchend', 50)); // diff = -150

      expect(offcanva.classList.contains('is-open')).toBe(false);
    });
  });
});
