import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createLightboxFixture } from '../helpers/dom-utils.js';
import { pressEscape, pressEnter, pressSpace } from '../helpers/keyboard-events.js';

async function loadMainJs() {
  vi.resetModules();
  await import('../../assets/js/main.js');
}

describe('Lightbox Acessível', () => {
  let lightbox, lightboxImg, closeBtn, resultItems;

  beforeEach(async () => {
    createLightboxFixture();
    await loadMainJs();
    lightbox = document.getElementById('lightbox');
    lightboxImg = lightbox.querySelector('img');
    closeBtn = lightbox.querySelector('.lightbox-close');
    resultItems = document.querySelectorAll('.result-item');
  });

  describe('openLightbox()', () => {
    it('click no result-item abre o lightbox', () => {
      resultItems[0].click();
      expect(lightbox.classList.contains('active')).toBe(true);
    });

    it('atualiza src da imagem no lightbox', () => {
      resultItems[0].click();
      expect(lightboxImg.src).toContain('clareamento.webp');
    });

    it('atualiza alt da imagem no lightbox', () => {
      resultItems[0].click();
      expect(lightboxImg.alt).toBe('Antes e depois clareamento');
    });

    it('bloqueia scroll do body ao abrir', () => {
      resultItems[0].click();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('focus vai para o botão fechar ao abrir', () => {
      resultItems[0].click();
      expect(document.activeElement).toBe(closeBtn);
    });

    it('Enter no result-item abre o lightbox', () => {
      pressEnter(resultItems[0]);
      expect(lightbox.classList.contains('active')).toBe(true);
    });

    it('Space no result-item abre o lightbox', () => {
      pressSpace(resultItems[0]);
      expect(lightbox.classList.contains('active')).toBe(true);
    });
  });

  describe('closeLightbox()', () => {
    it('click no botão fechar fecha o lightbox', () => {
      resultItems[0].click();
      closeBtn.click();
      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('restaura scroll do body ao fechar', () => {
      resultItems[0].click();
      closeBtn.click();
      expect(document.body.style.overflow).toBe('');
    });

    it('Escape fecha o lightbox', () => {
      resultItems[0].click();
      pressEscape(document);
      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('click no backdrop (lightbox element) fecha', () => {
      resultItems[0].click();
      // Simula click no backdrop (o próprio lightbox, não a imagem)
      lightbox.click();
      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('focus retorna para o elemento que abriu o lightbox', () => {
      resultItems[0].focus();
      resultItems[0].click();
      closeBtn.click();
      expect(document.activeElement).toBe(resultItems[0]);
    });
  });

  describe('Focus Trap', () => {
    it('Tab mantém foco no botão fechar', () => {
      resultItems[0].click();
      const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
      lightbox.dispatchEvent(event);
      expect(document.activeElement).toBe(closeBtn);
    });
  });

  describe('Isolamento', () => {
    it('Escape não fecha quando lightbox não está ativo', () => {
      pressEscape(document);
      // Não deve causar erro
      expect(lightbox.classList.contains('active')).toBe(false);
    });

    it('segundo result-item abre com imagem correta', () => {
      resultItems[1].click();
      expect(lightboxImg.src).toContain('facetas.webp');
      expect(lightboxImg.alt).toBe('Antes e depois facetas');
    });
  });
});
